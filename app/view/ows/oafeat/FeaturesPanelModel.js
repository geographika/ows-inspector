Ext.define('OwsInspector.view.ows.oafeat.FeaturesPanelModel', {
    extend: 'Ext.app.ViewModel',

    requires: [
        'OwsInspector.store.Layers',
        'OwsInspector.store.Requests'
    ],

    alias: 'viewmodel.ms_ogcfeaturespanel',

    data: {
        projections: ['EPSG:3857'],

        // parameters used by all services
        common: {
            request: 'collections',
        },

        apiRequest: {
            layer: ''
        }
    },

    stores: {
        layers: {
            type: 'layers',
            data: [{ value: 'Example' }],
        },
        requests: {
            type: 'requests',
            data: [
                { name: 'collections', disabled: false },
                { name: 'conformance', disabled: false },
                { name: 'api', disabled: false },
            ]
        }
    },

    onParametersUpdate: function () {
        const me = this;
        me.getView().fireEvent('parametersupdated');
    },

    formulas: {

        // formulas to listen for changes in the parameters
        commonChanged: {
            bind: {
                bindTo: '{common}',
                deep: true,
            },
            get: function () {
                this.onParametersUpdate();
            }
        },

        apiRequestChanged: {

            bind: {
                bindTo: '{apiRequest}',
                deep: true,
            },
            get: function () {
                this.onParametersUpdate();
            }
        },
    }
});