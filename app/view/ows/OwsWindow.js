Ext.define('OwsInspector.view.ows.OwsWindow', {
    extend: 'Ext.window.Window',
    requires: [
        'OwsInspector.view.ows.OwsWindowModel',
        'OwsInspector.view.ows.OwsWindowController',
        'OwsInspector.view.ows.wms.WmsPanel',
        'OwsInspector.view.ows.wfs.WfsPanel'
    ],
    xtype: 'ms_owswindow',
    viewModel: 'ms_owswindow',
    controller: 'ms_owswindow',
    title: 'Open Web Services Inspector',
    width: 800,
    height: 600,
    maximizable: true,
    closeAction: 'hide',
    layout: 'border',
    items: [
        {
            xtype: 'container',
            region: 'north',
            padding: 5,
            layout: {
                type: 'hbox',
            },
            items: [

                {
                    xtype: 'combo',
                    forceSelection: false,
                    editable: true,
                    fieldLabel: 'Server URL',
                    emptyText: 'To test against different servers enter the root URL here',
                    flex: 1,
                    bind: {
                        store: '{serverUrls}',
                        value: '{mapserverUrl}'
                    },
                    listeners: {
                        change: function (textfield, newValue) {
                            textfield.setValue(newValue.trim());
                        }
                    }
                },
                {
                    xtype: 'button',
                    width: 150,
                    text: 'Update Capabilities',
                    handler: 'onUpdateCapabilities',
                    margin: '0 0 0 5' // Add some margin to separate the button from the textbox
                }],
        },
        {
            xtype: 'tabpanel',
            region: 'west',
            minWidth: 330,
            width: 330,
            //split: true,
            activeTab: 0, // First tab active by default
            split: true,
            listeners: {
                tabchange: 'onTabChange'
            },
            items: [
                {
                    tabConfig: {
                        title: 'WMS'
                    },
                    xtype: 'ms_wmspanel',
                    listeners: {
                        parametersupdated: 'onParametersUpdated'
                    }
                },
                {
                    tabConfig: {
                        title: 'WFS'
                    },
                    xtype: 'ms_wfspanel',
                    listeners: {
                        parametersupdated: 'onParametersUpdated'
                    },
                    hidden: false
                }]
        },
        {
            xtype: 'panel',
            region: 'center',
            itemId: 'center',
            layout: 'fit',
            items: [{
                xtype: 'container',
                itemId: 'xml',
                html: '<div id="xmlEditor" style="width: 100%; height: 100%" />',
                style: {
                    backgroundColor: 'white'
                },
                listeners: {
                    resize: 'onEditorResize'
                }
            }, {
                xtype: 'container',
                visible: false,
                itemId: 'imageOutput',
                html: '<div id="imageOutput" style="width: 100%; height: 100%" />',
                style: {
                    backgroundColor: 'white'
                }
            }, {
                xtype: 'container',
                itemId: 'json',
                html: '<div id="jsonEditor" style="width: 100%; height: 100%" />',
                style: {
                    backgroundColor: 'white'
                },
                listeners: {
                    resize: 'onEditorResize'
                }
            }, {
                xtype: 'container',
                itemId: 'html',
                html: '<div id="htmlEditor" style="width: 100%; height: 100%" />',
                style: {
                    backgroundColor: 'white'
                },
                listeners: {
                    resize: 'onEditorResize'
                }
            }]
        }, {
            region: 'south',
            header: false,
            collapsible: true,
            scrollable: true,
            split: true,
            height: 80,
            minHeight: 80,
            items: [{
                xtype: 'textarea',
                grow: true,
                fieldStyle: {
                    fontFamily: 'monospace'
                },
                value: 'If you edit your Mapfile then remember to press the "Serve" button so any changes are shown in the OwS Tester',
                width: '100%',
                height: '100%',
                anchor: '100%',
                bind: {
                    value: '{requestUrl}',
                }
            }]
        }],
    buttons: [
        {
            xtype: 'button',
            text: 'Send Request',
            handler: 'onSendRequest'
        },
        {
            text: 'Close',
            handler: 'onClose'
        }
    ]
});