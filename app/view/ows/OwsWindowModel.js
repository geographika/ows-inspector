Ext.define('OwsInspector.view.ows.OwsWindowModel', {
    extend: 'Ext.app.ViewModel',

    alias: 'viewmodel.ms_owswindow',

    requires: ['OwsInspector.store.Servers'],

    data: {
        mapserverUrl: 'https://demo.mapserver.org/cgi-bin/wms',
        requestUrl: '',
        isFloatingWindow: false,
        scale: 'medium' // small
    },

    stores: {
        servers: {
            type: 'servers'
        }
    },

    // https://demo.mapserver.org/cgi-bin/umn

    formulas: {
        mapserverUrlChanged: {
            bind: {
                bindTo: '{mapserverUrl}'
            },
            get: function () {
                const controller = this.getView().getController();
                controller.onParametersUpdated.call(controller);
            }
        }
    }

});