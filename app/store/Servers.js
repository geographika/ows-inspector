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
                return `${record.get('name')} - ${record.get('url')}`;
            }
        }
    ],
    data: [
        { name: 'MapServer Demo Server', url: 'https://demo.mapserver.org/cgi-bin/wms' },
        { name: 'MapServer msautotest', url: 'https://demo.mapserver.org/cgi-bin/msautotest' },
        { name: 'EPA Ireland WMS', url: 'https://gis.epa.ie/geoserver/wms?' },
        { name: 'EPA Ireland WFS', url: 'https://gis.epa.ie/geoserver/wfs?' },
        { name: 'European Marine Observation and Data Network Bathymetry', url: 'https://ows.emodnet-bathymetry.eu/' },
        { name: 'Terrestris OWS Demo', url: 'https://ows-demo.terrestris.de/geoserver/osm/ows' },
    ],
    // sorters: ['name']
});