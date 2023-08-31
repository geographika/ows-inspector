Ext.define('OwsInspector.view.ows.wms.WmsPanelController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.ms_wmspanel',

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
