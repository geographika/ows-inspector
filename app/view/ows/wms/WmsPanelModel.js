Ext.define('OwsInspector.view.ows.wms.WmsPanelModel', {
    extend: 'Ext.app.ViewModel',

    requires: [
        'OwsInspector.store.Layers',
        'OwsInspector.store.Requests'
    ],

    alias: 'viewmodel.ms_wmspanel',

    data: {

        // for drop-down values
        getMapFormats: ['image/png', 'image/jpeg'],
        getLegendGraphicFormats: ['image/png', 'image/jpeg'],
        exceptions: ['XML', 'INIMAGE', 'BLANK'],
        sldVersions: ['1.0.0', '1.1.0'],
        serviceVersions: ['1.0.0', '1.1.0', '1.1.1', '1.3.0'],
        projections: ['EPSG:3857'],

        // parameters used by all services
        common: {
            request: 'GetCapabilities',
            version: '1.3.0',
            service: 'WMS'
        },
        getCapabilities: {
            // no additional parameters required
        },
        describeLayer: {
            layers: '',
            sld_version: '',
            exceptions: ''
        },
        getLegendGraphic: {
            layer: '',
            format: '',
            sld_version: '',
        },
        getStyles: {
            layers: '',
        },
        getMap: {
            layers: '',
            styles: '',
            crs: '',
            srs: '',
            bbox: '',
            format: '',
            exceptions: '',
            width: 500,
            height: 500,
            transparent: true
        },
        getFeatureInfo: {
            layers: '',
            query_layers: '',
            format: '',
            styles: '',
            crs: 'EPSG:3857',
            bbox: '-25304964.300801154,-20037508.3427892,25304964.300801154,20037508.3427892',
            exceptions: 'INIMAGE',
            width: 500,
            height: 500,
            transparent: true
        }
    },

    stores: {
        layers: {
            type: 'layers',
            data: [{ value: 'Example' }],
        },
        // all requests are disabled (shown in italics) until GetCapabilities is called
        requests: {
            type: 'requests',
            data: [
                { name: 'GetCapabilities', disabled: false },
                { name: 'DescribeLayer', disabled: true },
                { name: 'GetLegendGraphic', disabled: true },
                { name: 'GetStyles', disabled: true },
                { name: 'GetMap', disabled: true },
                // TODO
                // { name: 'GetFeatureInfo', disabled: true }
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

        getLegendGraphicChanged: {
            bind: {
                bindTo: '{getLegendGraphic}',
                deep: true,
            },
            get: function () {
                this.onParametersUpdate();
            }
        },

        describeLayerChanged: {

            bind: {
                bindTo: '{describeLayer}',
                deep: true,
            },
            get: function () {
                this.onParametersUpdate();
            }
        },

        getStylesChanged: {

            bind: {
                bindTo: '{getStyles}',
                deep: true,
            },
            get: function () {
                this.onParametersUpdate();
            }
        },

        getMapChanged: {

            bind: {
                bindTo: '{getMap}',
                deep: true,
            },
            get: function () {
                this.onParametersUpdate();
            }
        },

        getFeatureInfoChanged: {

            bind: {
                bindTo: '{getFeatureInfo}',
                deep: true,
            },
            get: function () {
                this.onParametersUpdate();
            }
        },
        // custom formulas for WMS

        sldVersion: {
            bind: {
                bindTo: '{common.version}'
            },
            get: function (version) {

                var sldVersion = '1.0.0';

                if (version === '1.3.0') {
                    sldVersion = '1.1.0';
                }

                this.set('describeLayer.sld_version', sldVersion);
                this.set('getLegendGraphic.sld_version', sldVersion);
            }
        },

        useSrs: {
            bind: {
                bindTo: '{common.version}'
            },
            get: function (version) {

                var useSrs = false;
                if (version === '1.3.0') {
                    useSrs = true;
                }
                return useSrs;
            }
        },


        // functions to enable and disable fieldsets in the WMS panel
        describeLayerDisabled: {
            bind: {
                bindTo: '{common.request}'
            },
            get: function (request) {
                return request !== 'DescribeLayer';
            }
        },
        getMapDisabled: {
            bind: {
                bindTo: '{common.request}'
            },
            get: function (request) {
                return request !== 'GetMap';
            }
        },
        getFeatureInfoDisabled: {
            bind: {
                bindTo: '{common.request}'
            },
            get: function (request) {
                return request !== 'GetFeatureInfo';
            }
        },
        getLegendGraphicDisabled: {
            bind: {
                bindTo: '{common.request}'
            },
            get: function (request) {
                return request !== 'GetLegendGraphic';
            }
        },
        getStylesDisabled: {
            bind: {
                bindTo: '{common.request}'
            },
            get: function (request) {
                return request !== 'GetStyles';
            }
        },
    }
});