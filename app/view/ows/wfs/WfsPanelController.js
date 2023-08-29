Ext.define('OwsInspector.view.ows.wfs.WfsPanelController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.ms_wfspanel',

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
