/**
 * See also https://openlayers.org/en/latest/examples/wms-capabilities.html
 */
Ext.define('OwsInspector.view.ows.OwsWindowController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.ms_owswindow',

    xmlEditor: null,
    jsonEditor: null,
    htmlEditor: null,

    editorContainerIds: ['#blank', '#imageOutput', '#xml', '#json', '#html'],

    onClose: function () {
        var me = this;
        me.getView().close();
    },

    onEditorResize: function () {

        var me = this;
        const editors = [me.xmlEditor, me.jsonEditor];

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
            readOnly: true,
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
            outputUrl = outputUrl + separator + queryString;
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
                var responseType = response.headers.get('content-type');
                return response.text().then(responseText => ({ responseType, responseText }));
            })
            .then(result => {
                console.log('Server responded successfully');
                const { responseType, responseText } = result;

                // if a collections or GetCapabilities request was called then we update the UI
                // with settings from the server

                const lowerCaseParams = me.getQueryStringParamsFromUrl(outputUrl);

                if (
                    (lowerCaseParams.request === 'getcapabilities') ||
                    (
                        outputUrl.endsWith('collections') ||
                        outputUrl.endsWith('collections/')
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
                } else if (responseType.includes('html')) {
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
                const response = error.response;
                var errorHandled = false;

                if (response) {
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
                    doc.setValue('Error occurred: ' + error.message);
                    //<debug>
                    Ext.log(error);
                    //</debug>
                }
            })
            .finally(() => {
                centerRegion.unmask();
            });
    },

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
     * If the comboboxes were not visible when first bound, then try again when
     * they become visible on a new tab
     */
    onTabChange: function (tabPanel, newTab) {

        const me = this;
        me.updateMultiSelectBindings();
        // also recalculate the URL based on the new service type
        me.onParametersUpdated();
        // update the active panel in the viewmodel
        me.getViewModel().set('activeTab', newTab.xtype);

    },

    initViewModel: function () {

        const me = this;
        me.updateMultiSelectBindings();
    },

    init: function (view) {
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
    }
});
