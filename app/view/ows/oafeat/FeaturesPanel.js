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
});