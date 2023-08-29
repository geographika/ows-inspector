Ext.define('OwsInspector.view.ows.wfs.WfsPanelModel', {
    extend: 'Ext.app.ViewModel',

    alias: 'viewmodel.ms_wfspanel',

    data: {

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
            exceptions: 'xml'
        },
        getFeature: {
            typeNames: '',
            exceptions: 'xml',
            count: 10,
            maxFeatures: 10
        }
    },

    stores: {
        layerNames: {
            source: 'layers'
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