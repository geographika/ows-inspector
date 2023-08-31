Ext.define('OwsInspector.view.ows.OwsWindowModel', {
    extend: 'Ext.app.ViewModel',

    alias: 'viewmodel.ms_owswindow',

    data: {
        serverUrls: [
            'https://demo.mapserver.org/cgi-bin/msautotest',
            'https://ows-demo.terrestris.de/geoserver/osm/ows',
            'https://demo.mapserver.org/cgi-bin/wms'],
        mapserverUrl: 'https://demo.mapserver.org/cgi-bin/wms',
        requestUrl: ''
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