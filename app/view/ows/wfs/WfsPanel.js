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
            width: '95%' // or comboboxes are slightly truncated
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
            bind: {
                store: '{serviceVersions}',
                value: '{common.version}'
            }
        },
        {
            xtype: 'combo',
            forceSelection: true,
            editable: false,
            fieldLabel: 'Request',
            valueField: 'name',
            displayField: 'name',
            bind: {
                store: '{requests}',
                value: '{common.request}'
            }
        }]
    },
    {
        xtype: 'fieldset',
        title: 'DescribeFeatureType',
        collapsible: false,
        bind: {
            collapsed: '{describeFeatureTypeDisabled}',
        },
        items: [
            {
                xtype: 'multiselect',
                name: 'layersCombo', // required for automatic updating
                forceSelection: true,
                editable: false,
                fieldLabel: 'TypeName(s) (use CTRL to select many)',
                valueField: 'value',
                width: '90%',
                displayField: 'value',
                queryMode: 'local',
                valueProperty: '{describeFeatureType.typeNames}', // a custom property added so the value binding can be set once the store is loaded
                bind: {
                    store: '{layers}',
                    //value: 'describeFeatureType.typeNames}', // due to errors we bind this manually in the controller
                    disabled: '{describeFeatureTypeDisabled}'
                }
            },
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
        collapsible: false,
        bind: {
            collapsed: '{getFeatureDisabled}',
        },
        items: [
            //{
            //    xtype: 'multiselect',
            //    name: 'layersCombo', // required for automatic updating
            //    forceSelection: true,
            //    editable: false,
            //    fieldLabel: 'TypeName(s) (use CTRL to select many)',
            //    valueField: 'value',
            //    width: '90%',
            //    displayField: 'value',
            //    queryMode: 'local',
            //    valueProperty: '{getFeature.typeNames}',
            //    bind: {
            //        store: '{layers}',
            //        disabled: '{getFeatureDisabled}'
            //    }
            //},
            {
                xtype: 'combo',
                name: 'layersCombo', // required for automatic updating
                forceSelection: true,
                editable: false,
                fieldLabel: 'TypeName',
                displayField: 'value',
                valueField: 'value',
                queryMode: 'local',
                bind: {
                    store: '{layers}',
                    value: '{getFeature.typeNames}',
                }
            },
            {
                xtype: 'combo',
                forceSelection: true,
                editable: false,
                fieldLabel: 'OutputFormat',
                displayField: 'outputFormat',
                valueField: 'outputFormat',
                queryMode: 'local',
                bind: {
                    store: '{outputFormats}',
                    value: '{getFeature.outputFormat}',
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