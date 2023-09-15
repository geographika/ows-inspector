Ext.define('OwsInspector.view.ows.oafeat.FeaturesPanelController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.ms_ogcfeaturespanel',

    requires: [
        'OwsInspector.Utils'
    ],

    updateCapabilities: function (jsonText) {
        const me = this;
        const jsn = JSON.parse(jsonText);
        const layers = Ext.Array.pluck(jsn.collections, 'id');
        var utils = OwsInspector.Utils;
        utils.updateLayerList(me.getView(), layers);
    },

    populateUserInterface: function (/*jsonMetadata*/) {

    },

    /**
     * Apply any custom logic to parameters prior to building a querystring
     * @param {any} params
     */
    buildQueryString: function (/*params*/) {

        const me = this;
        const vm = me.getViewModel();

        const qsParams = Ext.clone(vm.get('queryString'));

        Ext.Object.each(qsParams, function (key, value) {
            if (!value) {
                delete qsParams[key];
            }
        });

        return Ext.Object.toQueryString(qsParams);
    },

    /**
     * Build or modify the url path after the server URL
     * @param {any} params
     */
    buildUrlPath: function (params) {

        const me = this;

        const apiRequest = me.getViewModel().get('apiRequest');

        var path = '';

        if (params.request) {
            path += params.request;
        }

        if (params.request === 'collections' && apiRequest.layer) {
            path += `/${apiRequest.layer}`;
        }

        return path;

    }

});
