Ext.define('OwsInspector.view.ows.wms.WmsPanelController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.ms_wmspanel',

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
