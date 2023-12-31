Ext.define('OwsInspector.view.ows.oafeat.FeaturesPanel', {
    extend: 'Ext.panel.Panel',
    requires: [
        'Ext.ux.form.MultiSelect',
        'OwsInspector.view.ows.oafeat.FeaturesPanelModel',
        'OwsInspector.view.ows.oafeat.FeaturesPanelController'
    ],
    viewModel: 'ms_ogcfeaturespanel',
    controller: 'ms_ogcfeaturespanel',
    xtype: 'ms_ogcfeaturespanel',
    scrollable: true,
    defaults: {
        margin: 10,
        padding: 5,
        defaults: {
            padding: 5,
            width: '95%' // or comboboxes are slightly truncated
        }
    },
    items: [

        {
            xtype: 'fieldset',
            title: 'URL Path',
            collapsible: false,
            items: [{
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
            },
            {
                xtype: 'combo',
                name: 'layersCombo', // required for automatic updating
                forceSelection: true,
                editable: false,
                fieldLabel: 'Layer',
                itemId: 'layer',
                displayField: 'value',
                valueField: 'value',
                queryMode: 'local',
                bind: {
                    store: '{layers}',
                    value: '{apiRequest.layer}',
                    //disabled: '{getLegendGraphicDisabled}'
                }
            }]
        },
        {
            xtype: 'fieldset',
            title: 'Query String Parameters',
            collapsible: false,
            //bind: {
            //    collapsed: '{getFeatureDisabled}',
            //},
            items: [
                {
                    xtype: 'combo',
                    forceSelection: true,
                    editable: false,
                    fieldLabel: 'Format',
                    bind: {
                        store: '{formats}',
                        value: '{queryString.f}',
                        //disabled: '{getMapDisabled}'
                    },
                    //listeners: {
                    //    render: 'onComboRender'
                    //}
                },
                {
                    xtype: 'numberfield',
                    fieldLabel: 'Limit',
                    minValue: 0,
                    width: 180,
                    allowBlank: true,
                    allowDecimals: false,
                    bind: {
                        value: '{queryString.limit}',
                        //hidden: '{!useCount}'
                    }
                },
                {
                    xtype: 'numberfield',
                    fieldLabel: 'Offset',
                    minValue: 0,
                    width: 180,
                    allowBlank: true,
                    allowDecimals: false,
                    bind: {
                        value: '{queryString.offset}',
                        //hidden: '{useCount}'
                    }
                },
            ]
        }
    ]
});