Ext.define('OwsInspector.view.ows.wfs.WfsPanelModel', {
    extend: 'Ext.app.ViewModel',

    requires: [
        'OwsInspector.store.Layers',
        'OwsInspector.store.Requests',
        'OwsInspector.store.OutputFormats'
    ],

    alias: 'viewmodel.ms_wfspanel',

    data: {

        serviceVersions: ['2.0.0', '1.1.0', '1.0.0'],
        projections: ['EPSG:3857'],

        // parameters used by all services
        common: {
            request: 'GetCapabilities',
            version: '2.0.0',
            service: 'WFS'
        },
        getCapabilities: {
            // no additional parameters required
        },
        describeFeatureType: {
            typeNames: '',
            exceptions: ''
        },
        getFeature: {
            typeNames: '',
            exceptions: 'xml',
            outputFormat: null,
            count: 10,
            maxFeatures: 10
        }
    },

    stores: {
        layers: {
            type: 'layers'
        },
        outputFormats: {
            type: 'outputFormats'
        },
        // all requests are hidden until GetCapabilities is called
        requests: {
            type: 'requests',
            data: [
                { name: 'GetCapabilities', disabled: false },
                { name: 'DescribeFeatureType', disabled: true },
                { name: 'GetFeature', disabled: true },
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

        describeFeatureTypeChanged: {

            bind: {
                bindTo: '{describeFeatureType}',
                deep: true,
            },
            get: function () {
                this.onParametersUpdate();
            }
        },

        getFeatureChanged: {

            bind: {
                bindTo: '{getFeature}',
                deep: true,
            },
            get: function () {
                this.onParametersUpdate();
            }
        },

        getFeatureTypeNameChanged: {

            bind: {
                bindTo: '{getFeature.typeNames}',
                deep: true,
            },
            get: function (typeNames) {
                const me = this;
                const store = me.getStore('outputFormats');
                if (typeNames) {
                    store.filter({
                        property: 'layer',
                        value: typeNames,
                    });
                } else {
                    store.clearFilter();
                }

            }
        },

        useCount: {
            bind: {
                bindTo: '{common.version}'
            },
            get: function (version) {

                var useCount = false;
                if (version === '2.0.0') {
                    useCount = true;
                }
                return useCount;
            }
        },

        // functions to enable and disable fieldsets in the WFS panel
        describeFeatureTypeDisabled: {
            bind: {
                bindTo: '{common.request}'
            },
            get: function (request) {
                return request !== 'DescribeFeatureType';
            }
        },

        getFeatureDisabled: {
            bind: {
                bindTo: '{common.request}'
            },
            get: function (request) {
                return request !== 'GetFeature';
            }
        },
    }
});