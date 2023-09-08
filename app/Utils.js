
Ext.define('OwsInspector.Utils', {
    alternateClassName: 'OwsInspectorUtil',

    singleton: true,

    convertXmlToJson: function (xmlText, schemas) {

        // Option to ignore XML elements that lack mapping info
        // https://github.com/highsource/jsonix/issues/35
        // https://github.com/highsource/jsonix/issues/187
        // can also create an XML doc and remove any elements to avoid errors such as
        // could not be unmarshalled as is not known in this context and the property does not allow DOM content

        // see https://stackoverflow.com/a/37058587
        // and https://github.com/highsource/jsonix/issues/145
        // see https://github.com/landryb/MapStore2/commit/35f31b2 for MapServer vendor support
        // https://github.com/georchestra/mapstore2-georchestra/issues/300
        var MapServerModule = {
            name: 'MapServerModule',
            typeInfos: [{
                type: 'classInfo',
                localName: 'AnyElementType',
                propertyInfos: [{
                    type: 'anyElement',
                    allowDom: true,
                    allowTypedObject: true,
                    name: 'any',
                    collection: false
                }]
            }],
            elementInfos: [{
                elementName: {
                    namespaceURI: 'http://mapserver.gis.umn.edu/mapserver',
                    localPart: 'GetStyles'
                },
                typeInfo: 'MapServerModule.AnyElementType'
            },
            // Element [{http://inspire.ec.europa.eu/schemas/inspire_vs/1.0}inspire_vs:ExtendedCapabilities] could not be unmarshalled
            {
                elementName: {
                    namespaceURI: 'http://inspire.ec.europa.eu/schemas/inspire_vs/1.0',
                    localPart: 'ExtendedCapabilities'
                },
                typeInfo: 'MapServerModule.AnyElementType'
            }]
        };

        // also handle INPIRE schemas?
        // https://github.com/geosolutions-it/MapStore2/issues/6489
        // might just be simpler to use https://www.npmjs.com/package/xml2js

        schemas.push(MapServerModule);

        var namespacePrefixes = {
            'ms': 'http://mapserver.gis.umn.edu/mapserver',
        };

        // convert XML to JSON
        var context = new Jsonix.Context(schemas, {
            namespacePrefixes: namespacePrefixes
        });

        var unmarshaller = context.createUnmarshaller();
        var jsonMetadata = unmarshaller.unmarshalString(xmlText);
        return jsonMetadata;
    }
});
