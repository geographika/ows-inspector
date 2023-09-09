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
     * Build or modify the url path after the server URL
     * @param {any} params
     */
    buildUrlPath: function (params) {

        const me = this;

        const apiRequest = me.getViewModel().get('apiRequest');
        //return params.request.toLowerCase();
        var path = '';

        if (params.request) {
            path += '/collections';
        }

        if (apiRequest.layer) {
            path += `/${apiRequest.layer}`;
        }

        return path;

    }

});
