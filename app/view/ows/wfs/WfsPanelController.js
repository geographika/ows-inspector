Ext.define('OwsInspector.view.ows.wfs.WfsPanelController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.ms_wfspanel',

    requires: [
        'OwsInspector.Utils'
    ],

    updateCapabilities: function (xmlText) {

        const me = this;
        // use a regex to get the version from the XML before parsing

        const pattern = /\bversion="(1\.0\.0|1\.1\.0|2\.0\.0)"/;
        const match = xmlText.match(pattern);
        var version = '2.0.0'; // use 2.0.0 as a default version

        if (match) {
            version = match[1];
        } else {
            console.log('Capabilities version not found in server response. Defaulting to 2.0.0');
        }

        var schemas = [];

        switch (version) {
            case '1.0.0':
                schemas = schemas.concat([WFS_1_0_0, Filter_1_0_0]);
                break;
            case '1.1.0':
                schemas = schemas.concat([WFS_1_1_0, Filter_1_1_0,
                    OWS_1_0_0, GML_3_1_1, XLink_1_0, SMIL_2_0_Language, SMIL_2_0]);
                break;
            case '2.0.0':
                schemas = schemas.concat([WFS_2_0, Filter_2_0,
                    OWS_1_1_0, XLink_1_0]);
                break;
        }

        var utils = OwsInspector.Utils;
        var jsonMetadata = utils.convertXmlToJson(xmlText, schemas);
        me.populateUserInterface(jsonMetadata);
    },

    populateUserInterface: function (jsonMetadata) {

        const me = this;
        const vm = me.getViewModel();
        const jsn = jsonMetadata.value;

        //debugger;

        var layers = Ext.Array.pluck(Ext.Array.pluck(jsn.featureTypeList.featureType, 'name'), 'localPart');

        // Convert the flat array into an array of objects with 'name' field
        var dataArrayWithFields = layers.map(function (item) {
            return { value: item };
        });

        me.updateLayerList(dataArrayWithFields);



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
                // default to the first layer in the list
                cmb.setValue(layerStore.getAt(0).get('value'));
            }
        });

    },

    /**
     * Apply any custom logic to parameters prior to sending a request
     * @param {any} params
     */
    customProcessParameters: function (params) {

        const request = params.request.toLowerCase();
        if (request === 'describefeaturetype' || request === 'getfeature') {
            if (params.version !== '2.0.0') {
                params.typeName = params.typeNames;
                delete params.typeNames;
            }
        }

        if (params.request.toLowerCase() === 'getfeature') {
            if (params.version === '2.0.0') {
                delete params.maxFeatures;
                // if no numeric value is set then remove the parameter so all records can be returned
                if (!params.count) {
                    delete params.count;
                }
            } else {
                delete params.count;
                if (!params.maxFeatures) {
                    delete params.maxFeatures;
                }
            }
        }
    }

});
