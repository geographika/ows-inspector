# Open Web Services Inspector

OWS Inspector is a JavaScript web application for testing Open Web Service requests (such as WMS) against
geospatial servers. Please try the online application at https://ows.mapserverstudio.net/.
If you encounter any bugs or issues please open them in https://github.com/geographika/ows-inspector/issues

This project was developed as a component of [MapServer Studio](https://mapserverstudio.net/). It will be fully integrated into 
MapServer Studio to allow dynamically editing Mapfiles to configure and test OWS services.

If you find this project useful please consider sponsoring me or signing up for a MapServer Studio account. 
If you require support for working with OGC web services or require MapServer development or support you can find my company 
[Geographika Ltd.](https://geographika.net/) listed on the [MapServer Service Providers](https://mapserver.org/community/service_providers.html)
page.

## Known Limitations

A WFS service does support multiple layer names - see [here as an example](https://stackoverflow.com/questions/10931363/wfs-getfeature-with-multiple-layers-and-different-propertynames).
The OWS Inspector UI only allows a single layer to be selected, to make it easier to select field names.
Requests can always be manually edited in the URL panel before sending. 

## Development Setup

* Download SenchaCmd from https://support.sencha.com/#download
* Download the GPL version of ExtJS from https://github.com/tremez/extjs-gpl/tree/7.0.0

In a PowerShell prompt run:

```console
    $PROJECT_PATH="D:\GitHub\ows-inspector"
    cd $PROJECT_PATH
    New-Item -ItemType SymbolicLink -Path ext -Target "D:\Tools\Sencha\extjs-gpl-7.0.0"
    npm install
```

## Eslint

```console
    npm install eslint --save
    eslint --init
    eslint --fix app/
```

## Build Production Release

```console
    $PROJECT_PATH="D:\GitHub\ows-inspector"
    $env:PATH += ";D:\Tools\Sencha\Cmd\7.5.1.20"
    cd $PROJECT_PATH
    sencha app build production
```
