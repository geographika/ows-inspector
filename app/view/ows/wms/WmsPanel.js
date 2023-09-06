Ext.define('OwsInspector.view.ows.wms.WmsPanel', {
    extend: 'Ext.panel.Panel',
    requires: [
        'Ext.ux.form.MultiSelect',
        'OwsInspector.view.ows.wms.WmsPanelModel',
        'OwsInspector.view.ows.wms.WmsPanelController'
    ],
    viewModel: 'ms_wmspanel',
    controller: 'ms_wmspanel',
    xtype: 'ms_wmspanel',
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
            //listConfig: {
            //    itemTpl: [
            //        '<div data-qtip="{[values.disabled ? "Call GetCapabilities before running other requests" : ""]}"',
            //        '  class="{[values.disabled ? "italic-text" : ""]}">{name}</div>'
            //    ]
            //},
            bind: {
                store: '{requests}',
                value: '{common.request}'
            }
        }]
    },
    {
        xtype: 'fieldset',
        title: 'DescribeLayer',
        collapsible: false,
        bind: {
            collapsed: '{describeLayerDisabled}'
        },
        items: [
            {
                xtype: 'multiselect',
                name: 'layersCombo', // required for automatic updating
                forceSelection: true,
                editable: true,
                fieldLabel: 'Layers (use CTRL to select many)',
                valueField: 'value',
                width: '90%',
                // maxHeight: 70,
                // width: 275, // need to set this to a large value to fill space?
                displayField: 'value',
                queryMode: 'local',
                valueProperty: '{describeLayer.layers}', // a custom property added so the value binding can be set once the store is loaded
                bind: {
                    store: '{layers}',
                    //value: '{describeLayer.layers}', // due to errors we bind this manually in the controller
                    disabled: '{describeLayerDisabled}'
                }
            },
            {
                xtype: 'combo',
                forceSelection: true,
                editable: false,
                fieldLabel: 'SLD Version',
                bind: {
                    store: '{sldVersions}',
                    value: '{describeLayer.sld_version}',
                    disabled: '{describeLayerDisabled}'
                }
            },
            {
                xtype: 'textfield',
                editable: false,
                fieldLabel: 'Exceptions',
                disabled: true, // make this non-editable as XML seems to be the only value
                bind: {
                    value: '{describeLayer.exceptions}',
                }
            },
        ]
    },
    {
        xtype: 'fieldset',
        title: 'GetMap',
        collapsible: false,
        bind: {
            collapsed: '{getMapDisabled}'
        },
        items: [
            {
                xtype: 'multiselect',
                name: 'layersCombo', // required for automatic updating
                fieldLabel: 'Layers (use CTRL to select many)',
                valueField: 'value',
                displayField: 'value',
                valueProperty: '{getMap.layers}', // a custom property added so the value binding can be set once the store is loaded
                bind: {
                    store: '{layers}',
                    //value: '{getMap.layers}', // due to errors we bind this manually in the controller
                    disabled: '{getMapDisabled}'
                }
            },
            {
                xtype: 'combo',
                fieldLabel: 'CRS',
                editable: true,
                bind: {
                    store: '{projections}',
                    value: '{getMap.crs}',
                    hidden: '{!useSrs}',
                    disabled: '{getMapDisabled}'
                }
            },
            {
                xtype: 'combo',
                fieldLabel: 'SRS',
                editable: true,
                bind: {
                    store: '{projections}',
                    value: '{getMap.srs}',
                    hidden: '{useSrs}',
                    disabled: '{getMapDisabled}'
                }
            },
            {
                xtype: 'textfield',
                fieldLabel: 'BBOX',
                bind: {
                    value: '{getMap.bbox}',
                    disabled: '{getMapDisabled}'
                }
            },
            {
                xtype: 'combo',
                forceSelection: false,
                editable: true, // allow users to enter other formats
                fieldLabel: 'Format',
                bind: {
                    store: '{getMapFormats}',
                    value: '{getMap.format}',
                    disabled: '{getMapDisabled}'
                },
                listeners: {
                    render: 'onComboRender'
                }
            },
            {
                xtype: 'combo',
                forceSelection: false,
                editable: true,
                fieldLabel: 'Exceptions',
                bind: {
                    store: '{exceptions}',
                    value: '{getMap.exceptions}',
                    disabled: '{getMapDisabled}'
                },
                listeners: {
                    render: 'onComboRender'
                }
            },
            {
                xtype: 'textfield',
                fieldLabel: 'Width',
                bind: {
                    value: '{getMap.width}',
                    disabled: '{getMapDisabled}'
                }
            },
            {
                xtype: 'textfield',
                fieldLabel: 'Height',
                bind: {
                    value: '{getMap.height}',
                    disabled: '{getMapDisabled}'
                }
            }
        ]
    },
    {
        xtype: 'fieldset',
        title: 'GetLegendGraphic',
        collapsible: false,
        bind: {
            collapsed: '{getLegendGraphicDisabled}'
        },
        items: [{
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
                value: '{getLegendGraphic.layer}',
                disabled: '{getLegendGraphicDisabled}'
            }
        }, {
            xtype: 'combo',
            forceSelection: false,
            editable: true, // allow users to enter other formats
            fieldLabel: 'Format',
            bind: {
                store: '{getLegendGraphicFormats}',
                value: '{getLegendGraphic.format}',
                disabled: '{getLegendGraphicDisabled}'
            },
            listeners: {
                render: 'onComboRender'
            }
        }, {
            xtype: 'combo',
            forceSelection: true,
            editable: false,
            fieldLabel: 'SLD Version',
            bind: {
                store: '{sldVersions}',
                value: '{getLegendGraphic.sld_version}',
                disabled: '{getLegendGraphicDisabled}'
            }
        }]
    },
    {
        xtype: 'fieldset',
        title: 'GetStyles',
        collapsible: false,
        bind: {
            collapsed: '{getStylesDisabled}'
        },
        items: [{
            xtype: 'multiselect',
            name: 'layersCombo', // required for automatic updating
            fieldLabel: 'Layers (use CTRL to select many)',
            valueField: 'value',
            displayField: 'value',
            valueProperty: '{getStyles.layers}', // a custom property added so the value binding can be set once the store is loaded
            bind: {
                store: '{layers}',
                //value: '{getStyles.layers}', // due to errors we bind this manually in the controller
                disabled: '{getStylesDisabled}'
            }
        }]
    },
    {
        xtype: 'fieldset',
        title: 'GetFeatureInfo',
        hidden: true,
        collapsible: false,
        bind: {
            collapsed: '{getFeatureInfoDisabled}',
        },
        items: [{
            xtype: 'multiselect',
            name: 'layersCombo', // required for automatic updating
            fieldLabel: 'Layers (use CTRL to select many)',
            valueField: 'value',
            displayField: 'value',
            valueProperty: '{getStyles.layers}', // a custom property added so the value binding can be set once the store is loaded
            bind: {
                store: '{layers}',
                //value: '{getStyles.layers}', // due to errors we bind this manually in the controller
                disabled: '{getStylesDisabled}'
            }
        }]
    }]
});