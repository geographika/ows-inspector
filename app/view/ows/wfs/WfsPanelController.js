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

        var layers = Ext.Array.pluck(
            Ext.Array.pluck(jsn.featureTypeList.featureType, 'name')
            , 'localPart');

        var utils = OwsInspector.Utils;
        utils.updateLayerList(me.getView(), layers);

        const outputFormatsStore = vm.getStore('outputFormats');
        outputFormatsStore.removeAll();

        var layerName, outputFormats, serviceOutputFormats;

        // get the outputformats at the GetFeature service level
        var services = Ext.Array.findBy(jsn.operationsMetadata.operation, function (item) {
            return item.name === 'GetFeature';
        });

        if (services && services.parameter) {
            const outputFormat = Ext.Array.findBy(services.parameter, function (item) {
                return item.name === 'outputFormat';
            });
            if (outputFormat && outputFormat.allowedValues && outputFormat.allowedValues.valueOrRange) {
                serviceOutputFormats = Ext.Array.pluck(outputFormat.allowedValues.valueOrRange, 'value');
            }
        }

        // add all outputFormats for each layer in the service
        Ext.each(jsn.featureTypeList.featureType, function (ft) {
            layerName = ft.name.localPart;

            outputFormats = ft.outputFormats ? ft.outputFormats : ft.outputFormat;

            if (!outputFormats && serviceOutputFormats) {
                // use service defaults
                Ext.each(serviceOutputFormats, function (format) {
                    outputFormatsStore.add({ layer: layerName, outputFormat: format });
                });
            } else if (outputFormats) {
                // use layer formats
                Ext.each(outputFormats.format, function (format) {
                    outputFormatsStore.add({ layer: layerName, outputFormat: format });
                });
            }

        });

        // finally we can "enable" all other request types
        const requestStore = vm.getStore('requests');
        // set filtered to true to include filtered records in the update
        requestStore.each(function (record) {
            record.set('disabled', false);
        }, me, { filtered: true });
    },

    /**
     * Apply any custom logic to parameters prior to building a querystring
     * @param {any} params
     */
    buildQueryString: function (params) {

        const request = params.request.toLowerCase();
        if (request === 'describefeaturetype' || request === 'getfeature') {
            if (params.version !== '2.0.0') {
                params.typeName = params.typeNames;
                delete params.typeNames;
            }
        }

        if (params.request.toLowerCase() === 'getfeature') {

            if (!params.outputFormat) {
                delete params.outputFormat;
            }

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

        return Ext.Object.toQueryString(params);
    }

});
