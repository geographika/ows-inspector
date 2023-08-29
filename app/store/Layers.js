Ext.define('OwsInspector.store.Layers', {
    extend: 'Ext.data.Store',
    alias: 'store.layers',
    storeId: 'layers',
    fields: ['value'],
    data: [],
    sorters: ['value']
});