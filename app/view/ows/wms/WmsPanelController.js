Ext.define('OwsInspector.view.ows.wms.WmsPanelController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.ms_wmspanel',

    updateWmsCapabilities: function (text) {

        const me = this;
        const parser = new ol.format.WMSCapabilities();
        const result = parser.read(text);
        const vm = me.getViewModel();
        const layerStore = vm.getStore('layers');

        var layers = Ext.Array.pluck(result.Capability.Layer.Layer, 'Name');

        // Convert the flat array into an array of objects with 'name' field
        var dataArrayWithFields = layers.map(function (item) {
            return { value: item };
        });

        layerStore.loadData(dataArrayWithFields);
        // TODO select all layers afterwards?

        // load all formats
        const getMapFormats = result.Capability.Request.GetMap.Format;
        vm.set('getMapFormats', getMapFormats);

        if (getMapFormats.length > 0) {
            vm.set('getMap.format', getMapFormats[0]);
        }

        // GetLegendGraphic not included in parser!
        // https://github.com/openlayers/openlayers/blob/8fbf00459802703352ce4edecb38775398fad9de/src/ol/format/WMSCapabilities.js#L205

        const getLegendGraphicFormats = getMapFormats; //result.Capability.Request.GetLegendGraphic.Format;
        vm.set('getLegendGraphicFormats', getLegendGraphicFormats);

        if (getLegendGraphicFormats.length > 0) {
            vm.set('getLegendGraphic.format', getLegendGraphicFormats[0]);
        }

        const exceptions = result.Capability.Exception;
        vm.set('exceptions', exceptions);

        // get the root layer
        const rootLayer = result.Capability.Layer;

        // load projections
        const projections = rootLayer.CRS ? rootLayer.CRS : rootLayer.SRS;
        vm.set('projections', projections);

        var bbox, crs;

        if (rootLayer.BoundingBox && rootLayer.BoundingBox.length > 0) {
            bbox = rootLayer.BoundingBox[0].extent;
            crs = rootLayer.BoundingBox[0].crs;
        } else {
            bbox = rootLayer.EX_GeographicBoundingBox;
            crs = 'EPSG:4326';
        }

        // we can't use dot notation in the set method of a view model
        // so update each item individually
        vm.set('getMap.crs', crs);
        vm.set('getMap.srs', crs);



        if (exceptions.length > 0) {
            vm.set('getMap.exceptions', exceptions[0]);
            vm.set('describeLayer.exceptions', exceptions[0]);
            vm.set('getFeatureInfo.exceptions', exceptions[0]);
        }
        vm.set('getMap.bbox', bbox.join(', '));

        if (dataArrayWithFields.length > 0) {
            vm.set('getLegendGraphic.layer', dataArrayWithFields[0].value);
        }

        // finally we can "enable" all other request types
        const requestStore = vm.getStore('requests');

        requestStore.each(function (record) {
            record.set('disabled', false);
        });
    },

    onComboRender: function (combo) {
        // open drop-down list on click
        // this is not required if forceSelection is true
        combo.getEl().on('click', function () {
            combo.expand();
        });
    },

    /**
     * Apply any custom logic to parameters prior to sending a request
     * @param {any} params
     */
    customProcessParameters: function (params) {

        if (params.request.toLowerCase() === 'getmap') {
            if (params.version === '1.3.0') {
                delete params.srs;
            } else {
                delete params.crs;
            }
        }

        return params;
    }
});
