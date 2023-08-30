/*
 * This file launches the application by asking Ext JS to create
 * and launch() the Application class.
 */
Ext.application({
    extend: 'OwsInspector.Application',

    name: 'OwsInspector',

    requires: [
        // This will automatically load all classes in the OwsInspector namespace
        // so that application classes do not need to require each other.
        'OwsInspector.*'
    ],

    // The name of the initial view to create.
    // mainView: 'OwsInspector.view.ows.WxsWindow'
});
