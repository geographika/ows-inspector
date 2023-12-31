Ext.define('OwsInspector.view.ows.OwsWindowModel', {
    extend: 'Ext.app.ViewModel',

    alias: 'viewmodel.ms_owswindow',

    requires: ['OwsInspector.store.Servers'],

    data: {
        // https://demo.mapserver.org/cgi-bin/mapserv/localdemo/ogcapi/
        // https://demo.mapserver.org/cgi-bin/wfs
        // https://demo.mapserver.org/cgi-bin/wms
        // 'https://demo.mapserver.org/cgi-bin/mapserv/localdemo/ogcapi/'
        mapserverUrl: '', // this will set the default server when the UI is first opened
        requestUrl: '',
        isFloatingWindow: false,
        activeContainerId: '#blank',
        scale: 'medium', // small
        activeTab: 'ms_wmspanel', // only updated when the tab is changed so set a default value
        lastRequestTimestamp: null // a property that is updated whenever a new request is made that updates editor content
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
        },

        outputIsCode: {
            bind: {
                bindTo: '{activeContainerId}'
            },
            get: function (activeContainerId) {
                if (
                    (activeContainerId === '#json') ||
                    (activeContainerId === '#xml')
                ) {
                    return true;
                } else {
                    return false;

                }
            }
        },

        outputIsHtml: {
            bind: {
                bindTo: '{activeContainerId}'
            },
            get: function (activeContainerId) {
                if (
                    (activeContainerId === '#html')) {
                    return true;
                } else {
                    return false;

                }
            }
        },

        outputIsSLD: {
            bind: {
                activeContainerId: '{activeContainerId}',
                lastRequestTimestamp: '{lastRequestTimestamp}'
            },
            get: function (data) {
                if (data.activeContainerId === '#xml') {
                    var ctrl = this.getView().getController();
                    return Boolean(ctrl.getEditorSLD.call(ctrl));
                }
                return false;
            }
        }
    }

});