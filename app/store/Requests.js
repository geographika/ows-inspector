Ext.define('OwsInspector.store.Requests', {
    extend: 'Ext.data.Store',
    alias: 'store.requests',
    fields: [
        { name: 'name', type: 'string' },
        { name: 'disabled', type: 'boolean', defaultValue: false }
    ],
    data: []
});