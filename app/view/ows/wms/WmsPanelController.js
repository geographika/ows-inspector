Ext.define('OwsInspector.view.ows.wms.WmsPanelController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.ms_wmspanel',

    removeDocType: function (node) {

        const me = this;

        if (node.nodeType === 8) { // Comment node
            node.parentNode.removeChild(node);
        } else if (node.nodeType === 10) { // DocumentType (DOCTYPE) node
            node.parentNode.removeChild(node);
        } else if (node.nodeType === 3) { // DocumentType (DOCTYPE) node
            node.parentNode.removeChild(node);
        } else if (node.nodeType === 1) { // Element node
            // Recursively remove DOCTYPE and comments from child elements
            Ext.each(node.childNodes, function (childNode) {
                me.removeDocType(childNode);
            });
        }
    },

    cleanXml: function (xmlText) {
        // create an xmlDoc
        const me = this;
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, 'text/xml');

        // remove text nodes from the root element
        me.removeDocType(xmlDoc.documentElement);

        // apply regex to remove text
        xmlText = xmlText.replace(/<!DOCTYPE[^>]*>(\s*\[([^]]*|(?!\])])*])?>/gi, '').replace(/<!--[\s\S]*?-->/g, '');

        // write back to string
        xmlText = new XMLSerializer().serializeToString(xmlDoc);

        return xmlText;
    },

    convertXmlToJson: function (xmlText, schemas) {

        // Option to ignore XML elements that lack mapping info
        // https://github.com/highsource/jsonix/issues/35
        // https://github.com/highsource/jsonix/issues/187
        // can also create an XML doc and remove any elements to avoid errors such as
        // could not be unmarshalled as is not known in this context and the property does not allow DOM content

        // see https://stackoverflow.com/a/37058587
        // and https://github.com/highsource/jsonix/issues/145
        var MapServerModule = {
            name: 'MapServerModule',
            typeInfos: [{
                type: 'classInfo',
                localName: 'AnyElementType',
                propertyInfos: [{
                    type: 'anyElement',
                    allowDom: true,
                    allowTypedObject: true,
                    name: 'any',
                    collection: false
                }]
            }],
            elementInfos: [{
                elementName: {
                    namespaceURI: 'http://mapserver.gis.umn.edu/mapserver',
                    localPart: 'GetStyles'
                },
                typeInfo: 'MapServerModule.AnyElementType'
            }]
        };

        schemas.push(MapServerModule);

        var namespacePrefixes = {
            'ms': 'http://mapserver.gis.umn.edu/mapserver',
        };

        // convert XML to JSON
        var context = new Jsonix.Context(schemas, {
            namespacePrefixes: namespacePrefixes
        });

        var unmarshaller = context.createUnmarshaller();
        var jsonMetadata = unmarshaller.unmarshalString(xmlText);
        return jsonMetadata;
    },

    updateWmsCapabilities: function (xmlText, version) {

        const me = this;

        var schemas = [];

        switch (version) {
            case '1.0.0':
                schemas = schemas.concat([WMS_1_0_0]);
                break;
            case '1.1.0':
                schemas = schemas.concat([WMS_1_1_0]);
                break;
            case '1.1.1':
                schemas = schemas.concat([WMS_1_1_1]);
                break;
            case '1.3.0':
                schemas = schemas.concat([XLink_1_0, SE_1_1_0, SLD_1_1_0,
                    GML_3_1_1, SMIL_2_0, SMIL_2_0_Language,
                    Filter_1_1_0, WMS_1_3_0, OWS_1_0_0]);
                break;
            default:
                console.log(`Version ${version} unknown`);
        }

        var jsonMetadata = me.convertXmlToJson(xmlText, schemas);
        me.populateUserInterface(jsonMetadata);
    },

    /**
     * OL only supports WMS 1.3.0 GetCapabilities parsing
     * See https://github.com/openlayers/openlayers/issues/11362
     * Use JSONIX approach instead https://gist.github.com/ThomasG77/3a136ebb9895d4b73231c5f5782636ae
     * @param {any} text
     */
    populateUserInterface: function (jsonMetadata) {

        const me = this;
        const vm = me.getViewModel();
        const jsn = jsonMetadata.value;

        //  version can differ from the querystring version for
        // example if 1.0.0 is requested GeoServer returns 1.1.1
        const version = jsn.version;

        var layers = Ext.Array.pluck(jsn.capability.layer.layer, 'name');

        // Convert the flat array into an array of objects with 'name' field
        var dataArrayWithFields = layers.map(function (item) {
            return { value: item };
        });

        me.updateLayerList(dataArrayWithFields);

        var getMapFormats;

        // load all formats
        if (version === '1.3.0') {
            // array with a single value
            getMapFormats = jsn.capability.request.getMap.format;
        } else {
            if (version == '1.0.0') {
                // complicated!
                var mapFormatArray = jsn.capability.request.mapOrCapabilitiesOrFeatureInfo[0];
                var formatTypes = mapFormatArray.format.gifOrJPEGOrPNGOrWebCGMOrSVGOrGML1OrGML2OrGML3OrWBMPOrWMSXMLOrMIMEOrINIMAGEOrTIFFOrGeoTIFFOrPPMOrBLANK;
                var formatTypeNames = Ext.Array.pluck(formatTypes, 'TYPE_NAME');

                getMapFormats = [];
                Ext.Array.each(formatTypeNames, function (f) {
                    getMapFormats.push(f.split('.')[1]);
                });

            } else {
                // array with multiple values in the form {TYPE_NAME: 'WMS_1_1_1.Format', value: 'image/png'}
                getMapFormats = Ext.Array.pluck(jsn.capability.request.getMap.format, 'value');
            }
        }

        vm.set('getMapFormats', getMapFormats);

        if (getMapFormats.length > 0) {
            vm.set('getMap.format', getMapFormats[0]);
        }

        // GetLegendGraphic not included in OL parser
        // https://github.com/openlayers/openlayers/blob/8fbf00459802703352ce4edecb38775398fad9de/src/ol/format/WMSCapabilities.js#L205

        // using JSONIX GetLegendGraphic is an extendedOperation
        const getLegendGraphicFormats = getMapFormats; //result.Capability.Request.GetLegendGraphic.Format;
        vm.set('getLegendGraphicFormats', getLegendGraphicFormats);

        if (getLegendGraphicFormats.length > 0) {
            vm.set('getLegendGraphic.format', getLegendGraphicFormats[0]);
        }

        var exceptions;
        if (version === '1.3.0') {
            // array with a single value
            exceptions = jsn.capability.exception.format;
        } else {

            if (version == '1.0.0') {
                // complicated!
                var exceptionTypes = jsn.capability.exception.format.gifOrJPEGOrPNGOrWebCGMOrSVGOrGML1OrGML2OrGML3OrWBMPOrWMSXMLOrMIMEOrINIMAGEOrTIFFOrGeoTIFFOrPPMOrBLANK;
                var exceptionTypeNames = Ext.Array.pluck(exceptionTypes, 'TYPE_NAME');

                exceptions = [];
                Ext.Array.each(exceptionTypeNames, function (f) {
                    exceptions.push(f.split('.')[1]);
                });

            } else {
                // array with multiple values in the format {TYPE_NAME: 'WMS_1_1_1.Format', value: 'application/vnd.ogc.se_xml'}
                exceptions = Ext.Array.pluck(jsn.capability.exception.format, 'value');
            }
        }

        vm.set('exceptions', exceptions);

        // get the root layer
        const rootLayer = jsn.capability.layer;

        var prjType = 'srs';

        if (version == '1.3.0') {
            prjType = 'crs';
        }

        // load projections - this could be an array or a string
        var projections = rootLayer[prjType];
        if (Ext.isArray(projections) === false) {
            projections = projections.split(' ');
        }

        vm.set('projections', projections);

        var bbox, crs;

        if (rootLayer.boundingBox) { // } && rootLayer.boundingBox.length > 0) {
            bbox = rootLayer.boundingBox[0];
            bbox = [bbox.minx, bbox.miny, bbox.maxx, bbox.maxy];
            crs = rootLayer.boundingBox[0][prjType];
        } else {
            bbox = rootLayer.exGeographicBoundingBox;
            bbox = [bbox.westBoundLongitude, bbox.eastBoundLongitude, bbox.southBoundLatitude, bbox.northBoundLatitude];
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
        vm.set('getMap.bbox', bbox.join(','));

        if (dataArrayWithFields.length > 0) {
            vm.set('getLegendGraphic.layer', dataArrayWithFields[0].value);
        }

        // finally we can "enable" all other request types
        const requestStore = vm.getStore('requests');
        // set filtered to true to include filtered records in the update
        requestStore.each(function (record) {
            record.set('disabled', false);
        }, me, { filtered: true });

    },

    updateLayerList: function (dataArrayWithFields) {

        const me = this;
        const layerCombos = me.getView().query('[name=layersCombo]');
        const layerStore = me.getViewModel().getStore('layers');

        layerStore.loadData(dataArrayWithFields);

        Ext.each(layerCombos, function (cmb) {

            if (layerStore.getCount() > 0) {
                if (cmb.getXType() === 'multiselectfield') {
                    // select all layers by default
                    cmb.setValue(layerStore.collect('value'));
                } else {
                    // default to the first layer in the list
                    cmb.setValue(layerStore.getAt(0).get('value'));
                }
            }
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
