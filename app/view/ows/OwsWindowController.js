/**
 * See also https://openlayers.org/en/latest/examples/wms-capabilities.html
 */
Ext.define('OwsInspector.view.ows.OwsWindowController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.ms_owswindow',

    xmlEditor: null,
    jsonEditor: null,
    jsonStyleEditor: null,
    htmlEditor: null,

    editorContainerIds: ['#blank', '#imageOutput', '#xml', '#json', '#html', '#htmlOutput'],

    onClose: function () {
        var me = this;
        me.getView().close();
    },

    onEditorResize: function () {

        var me = this;
        const editors = [me.xmlEditor, me.jsonEditor, me.htmlEditor];

        Ext.each(editors, function (editor) {
            // bug where if the window is resized the bottom part
            // of the editors becomes blank
            if (editor) {
                // https://ace.c9.io/#nav=api&api=editor
                // true is to force a refresh
                editor.resize(true);
            }
        });
    },

    setupEditor: function (editor) {

        var theme = 'ace/theme/chrome';

        editor.setOptions({
            showPrintMargin: false,
            displayIndentGuides: false,
            highlightActiveLine: false,
            theme: theme,
            //readOnly: true,
            wrap: true
        });
    },

    setupXmlEditor: function () {

        var me = this;

        if (me.xmlEditor !== null) {
            return;
        }

        // only active when tab is pressed
        me.xmlEditor = ace.edit('xmlEditor');
        me.xmlEditor.getSession().setMode('ace/mode/xml');
        me.setupEditor(me.xmlEditor);
    },

    setupJsonEditor: function () {

        var me = this;

        if (me.jsonEditor !== null) {
            return;
        }

        // only active when tab is pressed
        me.jsonEditor = ace.edit('jsonEditor');
        me.jsonEditor.getSession().setMode('ace/mode/json');
        me.setupEditor(me.jsonEditor);
    },

    setupJsonStyleEditor: function () {

        var me = this;

        if (me.jsonStyleEditor !== null) {
            return;
        }

        // only active when tab is pressed
        me.jsonStyleEditor = ace.edit('jsonStyleEditor');
        me.jsonStyleEditor.getSession().setMode('ace/mode/json');
        me.setupEditor(me.jsonStyleEditor);
    },

    setupHtmlEditor: function () {

        var me = this;

        if (me.htmlEditor !== null) {
            return;
        }

        // only active when tab is pressed
        me.htmlEditor = ace.edit('htmlEditor');
        me.htmlEditor.getSession().setMode('ace/mode/html');
        me.setupEditor(me.htmlEditor);
    },


    /**
     * Show one container and hide the others
     * @param {any} activeEditor
     */
    setEditorVisibilites: function (activeEditor) {

        const me = this;
        var container;

        Ext.each(me.editorContainerIds, function (id) {
            container = me.getView().down(id);
            if (activeEditor === id) {
                container.setVisible(true);
                me.getViewModel().set('activeContainerId', id);
            } else {
                container.setVisible(false);
            }
        });
    },

    onHelp: function () {
        const me = this;
        me.setEditorVisibilites('#blank');
    },

    downloadFile: function (filename, content) {

        var element = document.createElement('a');
        element.setAttribute('href', content);
        element.setAttribute('download', filename);

        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);

    },

    onSave: function () {
        const me = this;
        const activeContainerId = me.getViewModel().get('activeContainerId');

        if (!activeContainerId) {
            return;
        }

        var extension = '.unknown';
        var editor;
        var content;

        switch (activeContainerId) {

            case '#xml':
                extension = '.xml';
                editor = me.xmlEditor;
                break;
            case '#json':
                extension = '.json';
                editor = me.jsonEditor;
                break;
            case '#html':
                extension = '.html';
                editor = me.htmlEditor;
                break;
            case '#htmlOutput':
                break;
            case '#imageOutput':
                // this seems to simply open the image in a new tab
                // may rely on the server setting the following header
                // Content-Disposition: attachment;

                //const container = me.getView().down(activeContainerId);
                //const imageUrl = container.down('image').src;
                //const lowercaseParams = me.getQueryStringParamsFromUrl(imageUrl);

                //if (lowercaseParams.format) {
                //    var format = lowercaseParams.format;
                //    var parts = format.split('/');

                //    if (parts.length === 2) {
                //        extension = "." + parts[1];
                //    } else {
                //        extension = "." + format;
                //    }
                //}
                //content = imageUrl;
                break;
            default:
        }

        if (editor) {
            content = editor.getValue();
            content = 'data:text/plain;charset=utf-8,' + encodeURIComponent(content);
        }

        if (content) {
            var filename = 'mapserverstudio-ows' + extension;
            me.downloadFile(filename, content);
        }
    },

    updateWfsCapabilities: function () {
        // see https://gist.github.com/ThomasG77/3a136ebb9895d4b73231c5f5782636ae
        // https://github.com/openlayers/openlayers/issues/8909
    },

    onParametersUpdated: function () {

        var me = this;
        const outputUrl = decodeURIComponent(me.buildRequest());
        me.getViewModel().set('requestUrl', outputUrl);
    },

    buildRequest: function () {

        var me = this;

        const mapserverUrl = me.getViewModel().get('mapserverUrl');

        if (!mapserverUrl) {
            return '';
        }

        const xType = me.getViewModel().get('activeTab');
        const panel = me.getView().down(xType);
        const params = me.getParams(panel);

        // apply any further custom logic from the panel controller
        const panelController = panel.getController();

        var queryString = '';
        if (panelController.buildQueryString) {
            queryString = panelController.buildQueryString.call(panelController, params);
        }

        var urlPath = '';
        if (panelController.buildUrlPath) {
            urlPath = panelController.buildUrlPath.call(panelController, params);
        }

        var outputUrl = mapserverUrl;

        if (urlPath) {
            if (Ext.String.endsWith(mapserverUrl, '/') === false) {
                outputUrl = outputUrl + '/' + urlPath;
            } else {
                outputUrl = outputUrl + urlPath;
            }
        }

        // Append the new parameters to the URL, with a ? or & as appropriate
        if (queryString) {
            const separator = outputUrl.indexOf('?') === -1 ? '?' : '&';

            // encode the URL prior to sending as if + isn't encoded e.g. application/gml+xml
            // the request will convert these to empty spaces and fail
            outputUrl = outputUrl + separator + encodeURIComponent(queryString);
        }

        return outputUrl;

    },

    getParams: function (panel) {

        var vm = panel.getViewModel();
        const requestType = vm.get('common.request');
        const requestParameters = Ext.clone(vm.get('common')); // clone here or it is not a simple key-value object

        // change the first character of the request type to lowercase to get the object from the viewmodel
        var requestParametersDataName = requestType.charAt(0).toLowerCase() + requestType.slice(1);

        // apply parameters for the service
        Ext.apply(requestParameters, Ext.clone(vm.get(requestParametersDataName)));

        // ensure any list parameters are converted to comma separated strings
        // rather than repeated querystring pairs e.g. return layers=1,2 rather than layers=1&layers=2
        Ext.Object.each(requestParameters, function (key, value) {
            if (Ext.isArray(value)) {
                requestParameters[key] = value.join(',');
            }
        });

        return requestParameters;
    },

    onServerChange: function (textfield, newValue, oldValue) {
        var me = this;

        if (newValue !== oldValue) {

            // mark all request types in italic ("disabled") if the server URL
            // is changed
            const xType = me.getViewModel().get('activeTab');

            const vm = me.getView().down(xType).getViewModel();
            const requestStore = vm.getStore('requests');

            // for WMS and WFS we need to call GetCapabilities to populate the UI
            if (xType !== 'ms_ogcfeaturespanel') {
                requestStore.each(function (record) {
                    if (record.get('name') !== 'GetCapabilities') {
                        record.set('disabled', true);
                    }
                });
                vm.set('common.request', 'GetCapabilities');
            }

            // ensure any URLs don't have spaces entered at the end
            if (newValue) {
                textfield.setValue(newValue.trim());
            }

        }
    },

    onSendRequest: function () {
        var me = this;
        const outputUrl = me.getViewModel().get('requestUrl').trim();
        me.sendRequest(outputUrl);
    },

    getQueryStringParamsFromUrl: function (url) {

        var queryStringStart = url.indexOf('?');
        var queryString;

        if (queryStringStart !== -1) {
            queryString = url.substring(queryStringStart + 1);
        }

        const lowerCaseParams = {};

        if (queryString) {
            const params = Ext.Object.fromQueryString(queryString);
            Ext.Object.each(params, function (key, value) {
                lowerCaseParams[key.toLowerCase()] = value.toLowerCase();
            });

        }
        return lowerCaseParams;
    },

    downloadFileFromResponse: function (response) {

        const responseType = response.headers.get('content-type');
        const contentDisposition = response.headers.get('content-disposition');

        var extension = 'dat';

        if (responseType.includes('zip')) {
            extension = '.zip';
        }

        var filename = `download.${extension}`;

        if (contentDisposition) {
            // Find the part that starts with "filename="
            const parts = contentDisposition.split('; ');
            const filenamePart = parts.find(part => part.startsWith('filename='));

            if (filenamePart) {
                // Extract the filename by removing "filename=" from the part
                filename = filenamePart.substring('filename='.length);
            }
        }
        // Force download by creating a blob and a download link
        response.blob().then(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
        });

    },

    sendRequest: function (outputUrl) {

        const me = this;

        const mapserverUrl = me.getViewModel().get('mapserverUrl');
        if (!mapserverUrl) {
            // if there is no server url then display the default help HTML
            me.setEditorVisibilites('#blank');
            return;
        }

        var imageContainer = me.getView().down('#imageOutput');
        var xmlContainer = me.getView().down('#xml');

        const centerRegion = me.getView().down('#center');
        centerRegion.mask('Sending request...');

        console.log('Requesting: ' + outputUrl);

        fetch(outputUrl)
            .then(response => {

                //const headerNames = response.headers.keys();
                //console.log(Array.from(headerNames))

                // only headers in the Access-Control-Allow-Headers can be accessed here
                // Accept,Accept-Charset,Accept-Encoding,Accept-Language,Connection,Content-Type,Cookie,DNT,Host,
                // Keep-Alive,Origin,Referer,User-Agent,X-CSRF-Token,X-Requested-With
                // server needs to set Access-Control-Expose-Headers to allow this to be accessed
                const responseType = response.headers.get('content-type');

                // check for attachment downloads (from GetFeature requests)
                const contentDisposition = response.headers.get('content-disposition');

                if (
                    (contentDisposition && contentDisposition.includes('attachment')) ||
                    (responseType.includes('zip'))
                ) {
                    me.downloadFileFromResponse(response);
                    return Promise.reject('Response was a data file');
                } else {
                    return response.text().then(responseText => ({ responseType, responseText }));
                }
            })
            .then(result => {
                console.log('Server responded successfully');
                const { responseType, responseText } = result;

                // if a collections or GetCapabilities request was called then we update the UI
                // with settings from the server

                const lowerCaseParams = me.getQueryStringParamsFromUrl(outputUrl);
                const urlWithoutQueryString = outputUrl.split('?')[0];

                if (
                    (lowerCaseParams.request === 'getcapabilities') ||
                    (
                        urlWithoutQueryString.endsWith('collections') ||
                        urlWithoutQueryString.endsWith('collections/')
                    )
                ) {
                    try {
                        const activeTab = me.getViewModel().get('activeTab');
                        const ctrl = me.getView().down(activeTab).getController();
                        ctrl.updateCapabilities.call(ctrl, responseText);
                    } catch (e) {
                        console.log(e);
                    }
                }

                if (responseType.includes('xml')) {
                    me.setEditorVisibilites('#xml');
                    me.setupXmlEditor();
                    me.xmlEditor.getSession().doc.setValue(responseText);
                } else if (responseType.includes('json')) {
                    // handle API errors from proxies that return JSON messages
                    me.setEditorVisibilites('#json');
                    me.setupJsonEditor();
                    me.jsonEditor.getSession().doc.setValue(responseText);
                    me.formatJson();
                } else if (responseType.includes('html') || responseType.includes('text')) {
                    // some errors have a HTTP 200 success code but an HTML response
                    me.setEditorVisibilites('#html');
                    me.setupHtmlEditor();
                    me.htmlEditor.getSession().doc.setValue(responseText);
                } else {
                    // assume an image
                    me.setEditorVisibilites('#imageOutput');
                    // for images set the src of the div to the server URL
                    // this makes a second request to the server, but is more robust than converting to a dataUrl
                    imageContainer.removeAll();

                    // using an Ext.Img makes it easier to get a reference later
                    var image = Ext.create('Ext.Img', {
                        src: outputUrl,
                        alt: 'OwS Generated Image',
                        style: {
                            borderColor: 'gray',
                            borderStyle: 'solid',
                            borderWidth: '2px'
                        }
                    });
                    // Add the image to the container
                    imageContainer.add(image);
                }
            })
            .catch(error => {

                var errorHandled = false;

                if (error.response) {
                    const response = error.response;
                    var responseType = response.headers.get('content-type');
                    if (responseType && responseType.includes('xml')) {
                        imageContainer.setVisible(false);
                        xmlContainer.setVisible(true);
                        me.setupXmlEditor();
                        me.xmlEditor.getSession().doc.setValue(response.responseText);
                        errorHandled = true;
                    }
                }

                if (errorHandled === false) {
                    // Handle cases where the response itself is not available
                    // (e.g.network error, CORS issue preventing access to response headers)
                    me.setEditorVisibilites('#json');
                    me.setupJsonEditor();
                    const doc = me.jsonEditor.getSession().doc;
                    const errorMessage = error.message ? error.message : error;
                    doc.setValue(errorMessage);
                    //<debug>
                    Ext.log(errorMessage);
                    //</debug>
                }
            })
            .finally(() => {
                centerRegion.unmask();
                me.getViewModel().set('lastRequestTimestamp', new Date().getTime());
            });
    },

    /**
     * Update the multiselect combos with the layer lists
     */
    updateMultiSelectBindings: function () {

        const me = this;
        const view = me.getView();
        // if combos are collapsed then they aren't visible. so select all for now
        // const layerCombos = view.query('[name=layersCombo]:visible');
        const layerCombos = view.query('[name=layersCombo]');
        const updatedLayerCombos = [];


        // use setTimeout so the store is loaded before we set the value
        window.setTimeout(function () {
            Ext.each(layerCombos, function (cmb) {
                // manually set binding for the multiselectbox or get errors about getCount
                // if the value bind has already been added then do not do anything
                if (cmb.rendered && !cmb.getBind().value) {
                    cmb.setBind({
                        value: cmb.valueProperty
                    });
                    // after a bind we then need to default to a value
                    updatedLayerCombos.push(cmb);
                }
            });

        }, 100);
    },

    formatXml: function () {

        const me = this;
        const editor = me.xmlEditor;
        if (editor) {
            const content = editor.getValue();
            if (content) {
                // https://github.com/riversun/xml-beautify
                const prettyContent = new XmlBeautify().beautify(content, {
                    indent: '  ',  //indent pattern like white spaces
                    useSelfClosingElement: true //true:use self-closing element when empty element.
                });
                editor.getSession().doc.setValue(prettyContent);
            }
        }

    },

    formatJson: function () {

        const me = this;
        const editor = me.jsonEditor;
        if (editor) {
            const content = editor.getValue();
            if (content) {
                const jsonObject = JSON.parse(content);
                var prettyContent = JSON.stringify(jsonObject, null, 4);
                editor.getSession().doc.setValue(prettyContent);
            }
        }
    },

    onFormatCode: function () {

        const me = this;
        const activeContainerId = me.getViewModel().get('activeContainerId');

        if (!activeContainerId) {
            return;
        }

        switch (activeContainerId) {

            case '#xml':
                me.formatXml();
                break;
            case '#json':
                me.formatJson();
                break;
            case '#html':
                break;
            case '#imageOutput':
                break;
            default:
        }
    },

    /**
     * Render HTML output into an iframe
     */
    onRenderHTML: function () {
        const me = this;
        const htmlPanel = me.getView().down('#htmlOutput');
        if (me.htmlEditor) {
            const content = me.htmlEditor.getValue();
            if (content) {
                me.setEditorVisibilites('#htmlOutput');
                const html = `<iframe style='width: 100%; height: 100%' srcdoc='${content}'></iframe>`;
                htmlPanel.update(html);
            }
        }
    },

    getEditorSLD: function () {

        const me = this;
        const editor = me.xmlEditor;

        if (editor) {
            const content = editor.getValue();
            if (content.includes('StyledLayerDescriptor')) {
                return content;
            }
        }

        return null;

    },

    onSldToGeoStyler: function () {
        const me = this;
        me.outputStyle(false);
    },

    onSldToMapbox: function () {
        const me = this;
        me.outputStyle(true);
    },

    /**
     * Convert SLD to either Mapbox style
     * or raw GeoStyler output
     * @param {any} sldString
     * @param {any} toMapbox
     */
    convertSld: function (sldString, toMapbox) {

        const me = this;

        // assume SLD 1.1.0 until https://github.com/geostyler/geostyler-sld-parser/issues/696 is implemented
        var sldParser = new GeoStylerSLDParser.SldStyleParser({ sldVersion: '1.1.0' });
        const mapBoxParser = new GeoStylerMapboxParser.MapboxStyleParser();

        sldParser.readStyle(sldString)
            .then(function (gs) {

                if (gs.errors) {
                    console.log('Errors parsing the SLD: ' + gs.errors);

                    Ext.toast({
                        html: 'Please check the Log tab for details',
                        title: 'Unable to Parse SLD',
                        width: 200,
                        align: 'br'
                    });
                    return;
                }

                var jsnOutput = gs.output;

                if (toMapbox === true) {
                    mapBoxParser.writeStyle(gs.output).then(function (mbStyle) {
                        if (mbStyle.errors) {
                            console.log('Errors writing the style: ' + mbStyle.errors);

                            Ext.toast({
                                html: 'Please check the Log tab for details',
                                title: 'Unable to Create Style',
                                width: 200,
                                align: 'br'
                            });

                            return;
                        } else {
                            jsnOutput = mbStyle.output;
                        }
                    });
                }

                me.setupJsonStyleEditor();
                jsnOutput = JSON.stringify(jsnOutput, null, 4);
                me.jsonStyleEditor.getSession().doc.setValue(jsnOutput);
            });
    },

    /**
     * Output a style in the JSON Style editor
     * @param {any} toMapbox
     * @returns
     */
    outputStyle: function (toMapbox) {

        const me = this;
        var sldString = me.getEditorSLD();

        if (!sldString) {
            console.log('The editor does not currently contain SLD');
            return;
        }

        const tabPanel = me.getView().down('#center');
        const tab = tabPanel.down('#styleOutput');

        if (tabPanel.getActiveTab().id === tab.id) {
            me.convertSld(sldString, toMapbox);
        } else {
            // if the style output tab has not been activated then the DIV
            // will not have been created and the Ace Editor cannot be created
            // we switch to the tab and wait for it to be active
            tabPanel.on('tabchange', function () {
                me.convertSld(sldString, toMapbox);
            }, me, {
                single: true
            });

            tabPanel.setActiveTab(tab);
        }
    },

    filterServersByType: function (xtype) {

        const me = this;
        const vm = me.getViewModel();
        const serverStore = vm.getStore('servers');

        serverStore.clearFilter();
        var service;

        // Apply the filter to the store

        switch (xtype) {

            case 'ms_wmspanel':
                service = 'WMS';
                break;
            case 'ms_wfspanel':
                service = 'WFS';
                break;
            case 'ms_ogcfeaturespanel':
                service = 'OAPIF';
                break;
            default:
        }

        if (service) {
            serverStore.filterBy(record => serverStore.filterByService(record, service));
        }
    },

    /**
     * If the comboboxes were not visible when first bound, then try again when
     * they become visible on a new tab
     */
    onTabChange: function (tabPanel, newTab) {

        const me = this;
        const vm = me.getViewModel();

        // update the active panel in the viewmodel
        vm.set('activeTab', newTab.xtype);

        me.filterServersByType(newTab.xtype);

        me.updateMultiSelectBindings();

        // recalculate the URL based on the new service type
        me.onParametersUpdated();


    },

    initViewModel: function () {

        const me = this;
        me.updateMultiSelectBindings();
    },

    init: function (view) {

        const me = this;

        // Capture a reference to the div element where you want to display Ext.log messages
        const logTextArea = view.down('#logOutput');

        // Store the original console.log function for later use
        const originalConsoleLog = console.log;

        // Override console.log with a custom function
        console.log = function (message) {
            // Call the original console.log function to ensure the message is still logged to the console
            originalConsoleLog(message);

            // Append the message to the logOutput div
            logTextArea.setValue(logTextArea.getValue() + message + '\n');
        };

        me.filterServersByType('ms_wmspanel');
    }
});
