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
    maximizable: false,
    closable: false,
    //bind: {
    //    closable: '{isFloatingWindow}',
    //},
    //closeAction: 'hide',
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
                    valueField: 'url',
                    displayField: 'displayName',
                    bind: {
                        store: '{servers}',
                        value: '{mapserverUrl}'
                    },
                    listeners: {
                        change: 'onServerChange',
                        render: function (combo) {
                            // open drop-down list on click
                            // this is not required if forceSelection is true
                            combo.getEl().on('click', function () {
                                combo.expand();
                            });
                        }
                    }
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
                    hidden: true
                }]
        },
        {
            xtype: 'panel',
            region: 'center',
            itemId: 'center',
            layout: 'fit',
            items: [{
                xtype: 'container',
                itemId: 'blank',
                html: `<h2>Welcome to the Open Web Services Inspector!</h2>
                <ol>
                <li>Select or enter a "Server URL" - the server must use <b>https</b></li>
                <li>Click "Send Request" to load the capabilities from the server into the UI</li>
                <li>Try other OwS requests!</li>
                </ol>
                `,
                style: {
                    backgroundColor: '#F5F5F5',
                    padding: '10px',
                    color: 'black',
                    fontSize: 'large',
                    //backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.8)),url(/resources/images/watermark.png)',
                    backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.8)),url(/resources/images/vector_tiles.png)',
                    //backgroundSize: 'cover',
                    backgroundSize: 'contain',
                    backgroundRepeat: 'no-repeat'
                },
            }, {
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
            text: 'Help',
            handler: 'onHelp',
            bind: {
                scale: '{scale}'
            }
        },
        '->',
        {
            xtype: 'button',
            text: 'Save Output',
            handler: 'onSave',
            bind: {
                scale: '{scale}'
            }
        },

        {
            xtype: 'button',
            text: 'Send Request',
            handler: 'onSendRequest',
            bind: {
                scale: '{scale}'
            }
        },
        {
            xtype: 'button',
            text: 'Close',
            handler: 'onClose',
            bind: {
                hidden: '{!isFloatingWindow}',
                scale: '{scale}'
            }
        }
    ]
});