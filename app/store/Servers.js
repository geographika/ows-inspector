Ext.define('OwsInspector.store.Servers', {
    extend: 'Ext.data.Store',
    alias: 'store.servers',
    storeId: 'servers',
    fields: [
        { name: 'name', type: 'string' },
        { name: 'url', type: 'string' },
        {
            name: 'displayName',
            type: 'string',
            depends: ['name', 'url'],
            convert: function (value, record) {
                if (!record.id) {
                    return record.get('url');
                }
                else {
                    return `${record.get('name')} - ${record.get('url')}`;
                }
            }
        }
    ],
    data: [
        { name: 'MapServer Demo Server', url: 'https://demo.mapserver.org/cgi-bin/wms' },
        { name: 'MapServer msautotest', url: 'https://demo.mapserver.org/cgi-bin/msautotest' },
        { name: 'EPA Ireland', url: 'https://gis.epa.ie/geoserver/ows' },
        { name: 'European Marine Observation and Data Network Bathymetry WMS', url: 'https://ows.emodnet-bathymetry.eu/wms' },
        { name: 'Terrestris OWS Demo', url: 'https://ows-demo.terrestris.de/geoserver/osm/ows' },
    ],
    // sorters: ['name']
});