Ext.define('OwsInspector.store.OutputFormats', {
    extend: 'Ext.data.Store',
    alias: 'store.outputFormats',
    fields: [
        { name: 'layer', type: 'string' },
        { name: 'outputFormat', type: 'string'}
    ],
    data: []
});