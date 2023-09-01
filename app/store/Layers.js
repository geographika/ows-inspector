Ext.define('OwsInspector.store.Layers', {
    extend: 'Ext.data.Store',
    alias: 'store.layers',
    fields: ['value'],
    data: [],
    sorters: ['value']
});