/**
 * The main application class. An instance of this class is created by app.js when it
 * calls Ext.application(). This is the ideal place to handle application launch and
 * initialization details.
 */
Ext.define('OwsInspector.Application', {
    extend: 'Ext.app.Application',

    name: 'OwsInspector',

    requires: [
        'OwsInspector.view.ows.WxsWindowModel'
    ],

    quickTips: false,
    platformConfig: {
        desktop: {
            quickTips: true
        }
    },

    onAppUpdate: function () {
        Ext.Msg.confirm('Application Update', 'This application has an update, reload?',
            function (choice) {
                if (choice === 'yes') {
                    window.location.reload();
                }
            }
        );
    },

    launch: function () {
        Ext.create('OwsInspector.view.ows.WxsWindow', {
            maximized: true, // Set the maximized configuration
        }).show();
    },

    init: function () {

        var me = this;
        me.callParent();
        // disable warnings about the map panel having no title
        // https://docs.sencha.com/extjs/6.0.0/guides/upgrades_migrations/extjs_upgrade_guide.html#upgrades_migrations-_-extjs_upgrade_guide_-_aria_regions_should_have_a_title
        Ext.enableAriaPanels = false;
        Ext.ariaWarn = Ext.emptyFn;
    }
});
