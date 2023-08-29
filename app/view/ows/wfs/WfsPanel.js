Ext.define('OwsInspector.view.ows.wfs.WfsPanel', {
    extend: 'Ext.panel.Panel',
    requires: [
        'Ext.ux.form.MultiSelect',
        'OwsInspector.view.ows.wfs.WfsPanelModel',
        'OwsInspector.view.ows.wfs.WfsPanelController'
    ],
    viewModel: 'ms_wfspanel',
    controller: 'ms_wfspanel',
    xtype: 'ms_wfspanel',
    scrollable: true,
    defaults: {
        margin: 10,
        padding: 5,
        defaults: {
            padding: 5,
        }
    },
    items: [{
        xtype: 'fieldset',
        title: 'General Parameters',
        items: [{
            xtype: 'combo',
            forceSelection: true,
            editable: false,
            fieldLabel: 'Version',
            store: ['2.0.0', '1.1.0', '1.0.0'],
            bind: {
                value: '{common.version}',
            }
        },
        {
            xtype: 'combo',
            forceSelection: true,
            editable: false,
            fieldLabel: 'Request',
            store: ['GetCapabilities', 'DescribeFeatureType', 'GetFeature'],
            bind: {
                value: '{common.request}',
            }
        }]
    },
    {
        xtype: 'fieldset',
        title: 'DescribeFeatureType',
        collapsible: true,
        bind: {
            collapsed: '{describeFeatureTypeDisabled}',
        },
        items: [

            {
                xtype: 'multiselect',
                name: 'layersCombo', // required for automatic updating
                forceSelection: true,
                editable: false,
                fieldLabel: 'TypeName(s)',
                valueField: 'value',
                width: 275, // need to set this to a large value to fill space?
                displayField: 'value',
                queryMode: 'local',
                valueProperty: '{describeFeatureType.typeNames}', // a custom property added so the value binding can be set once the store is loaded
                bind: {
                    store: '{layerNames}',
                    //value: 'describeFeatureType.typeNames}', // due to errors we bind this manually in the controller
                    disabled: '{describeFeatureTypeDisabled}'
                }
            },

            //{
            //    xtype: 'combo',
            //    name: 'layersCombo', // required for automatic updating
            //    forceSelection: true,
            //    editable: false,
            //    fieldLabel: 'Layer',
            //    valueField: 'value',
            //    width: 275, // need to set this to a large value to fill space?
            //    displayField: 'value',
            //    queryMode: 'local',
            //    bind: {
            //        store: '{layerNames}',
            //        value: '{describeFeatureType.layer}',
            //        disabled: '{describeLayerDisabled}'
            //    }
            //},
            {
                xtype: 'textfield',
                editable: false,
                fieldLabel: 'Exceptions',
                disabled: true, // make this non-editable as XML seems to be the only value
                bind: {
                    value: '{describeFeatureType.exceptions}',
                }
            },
        ]
    },

    {
        xtype: 'fieldset',
        title: 'GetFeature',
        collapsible: true,
        bind: {
            collapsed: '{getFeatureDisabled}',
        },
        items: [
            {
                xtype: 'multiselect',
                name: 'layersCombo', // required for automatic updating
                forceSelection: true,
                editable: false,
                fieldLabel: 'TypeName(s)',
                valueField: 'value',
                width: 275,
                displayField: 'value',
                queryMode: 'local',
                valueProperty: '{getFeature.typeNames}',
                bind: {
                    store: '{layerNames}',
                    disabled: '{getFeatureDisabled}'
                }
            },
            {
                xtype: 'numberfield',
                fieldLabel: 'Count',
                minValue: 0,
                width: 180,
                allowBlank: true,
                allowDecimals: false,
                bind: {
                    value: '{getFeature.count}',
                    hidden: '{!useCount}'
                }
            },
            {
                xtype: 'numberfield',
                fieldLabel: 'MaxFeatures',
                minValue: 0,
                width: 180,
                allowBlank: true,
                allowDecimals: false,
                bind: {
                    value: '{getFeature.maxFeatures}',
                    hidden: '{useCount}'
                }
            },
        ]
    }
    ]
});