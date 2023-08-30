/**
 * See also https://openlayers.org/en/latest/examples/wms-capabilities.html
 */
Ext.define('OwsInspector.view.ows.WxsWindowController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.ms_owswindow',

    xmlEditor: null,
    jsonEditor: null,
    htmlEditor: null,

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
        const containerIds = ['#imageOutput', '#xml', '#json', '#html'];
        var container;

        Ext.each(containerIds, function (id) {
            container = me.getView().down(id);
            if (activeEditor === id) {
                container.setVisible(true);
            } else {
                container.setVisible(false);
            }
        });
    },

    updateWmsCapabilities: function (text) {
        const me = this;

        const parser = new ol.format.WMSCapabilities();
        const result = parser.read(text);
        me.setupJsonEditor();
        me.setEditorVisibilites('#json');
        me.jsonEditor.getSession().doc.setValue(JSON.stringify(result, null, 2));

        const vm = me.getView().down('ms_wmspanel').getViewModel();
        const layerStore = vm.getStore('layerNames');

        // get the root layer - or ignore it?
        // var layers = [result.Capability.Layer.Name];
        var layers = Ext.Array.pluck(result.Capability.Layer.Layer, 'Name');

        // Convert the flat array into an array of objects with 'name' field
        var dataArrayWithFields = layers.map(function (item) {
            return { value: item };
        });

        layerStore.loadData(dataArrayWithFields);
        // TODO select all layers afterwards?

        // load all formats
        vm.set('formats', result.Capability.Request.GetMap.Format);
        // load projections
        const projections = result.Capability.Layer.CRS ? result.Capability.Layer.CRS : result.Capability.Layer.SRS;
        vm.set('projections', projections);
    },

    updateWfsCapabilities: function () {
        // see https://gist.github.com/ThomasG77/3a136ebb9895d4b73231c5f5782636ae
        // https://github.com/openlayers/openlayers/issues/8909
    },

    /**
     * Function to update the view models based on the response of a remote server
     */
    onUpdateCapabilities: function () {

        const me = this;
        const xType = me.getView().down('tabpanel').getActiveTab().xtype;
        var params = {
            request: 'GetCapabilities',
        };

        switch (xType) {

            case 'ms_wmspanel':
                params.service = 'WMS';
                break;
            case 'ms_wfspanel':
                params.service = 'WFS';
                break;
            default:
                console.log(`xType ${xType} unknown`);
        }

        const vm = me.getViewModel();
        const mapserverUrl = vm.get('mapserverUrl');
        const separator = mapserverUrl.indexOf('?') === -1 ? '?' : '&';
        const queryString = Ext.Object.toQueryString(params);
        const outputUrl = mapserverUrl + separator + queryString;

        me.setEditorVisibilites('#json');
        me.setupJsonEditor();
        const doc = me.jsonEditor.getSession().doc;

        const centerRegion = me.getView().down('#center');
        centerRegion.mask('Sending request...');

        fetch(outputUrl)
            .then(function (response) {
                return response.text();
            })
            .then(function (text) {

                switch (xType) {

                    case 'ms_wmspanel':
                        params.service = 'WMS';
                        me.updateWmsCapabilities(text);
                        break;
                    case 'ms_wfspanel':
                        params.service = 'WFS';
                        me.updateWfsCapabilities(text);
                        break;
                    default:
                        console.log(`xType ${xType} unknown`);
                }
            })
            .catch(error => {
                // Handle errors
                const decodedUrl = decodeURIComponent(outputUrl);
                doc.setValue(`Unable to read capabilities from: ${decodedUrl} - ${error}`);
            })
            .finally(() => {
                centerRegion.unmask();
            });
    },

    onParametersUpdated: function () {

        var me = this;
        const outputUrl = decodeURIComponent(me.buildRequest());
        me.getViewModel().set('requestUrl', outputUrl);
    },

    buildRequest: function () {

        var me = this;

        const xType = me.getView().down('tabpanel').getActiveTab().xtype;
        const panel = me.getView().down(xType);
        const params = me.getParams(panel);

        // apply any further custom logic from the panel controller
        const panelController = panel.getController();

        if (panelController.customProcessParameters) {
            panelController.customProcessParameters.call(panelController, params);
        }

        const mapserverUrl = me.getViewModel().get('mapserverUrl');
        var queryString = Ext.Object.toQueryString(params);

        // Append the new parameters to the URL, with a ? or & as appropriate
        const separator = mapserverUrl.indexOf('?') === -1 ? '?' : '&';
        const outputUrl = mapserverUrl + separator + queryString;

        return outputUrl;

    },

    getParams: function (panel) {

        var vm = panel.getViewModel();
        const requestType = vm.get('common.request');
        const requestParameters = Ext.clone(vm.get('common')); // clone here or it is not a simple key-value object

        // apply parameters for the service

        // change the first character of the request type to lowercase to get the object
        var requestParametersDataName = requestType.charAt(0).toLowerCase() + requestType.slice(1);
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

    onSendRequest: function () {
        var me = this;
        const outputUrl = me.getViewModel().get('requestUrl');
        me.sendRequest(outputUrl);
    },

    sendRequest: function (outputUrl) {

        const me = this;
        var imageContainer = me.getView().down('#imageOutput');
        var xmlContainer = me.getView().down('#xml');

        const centerRegion = me.getView().down('#center');
        centerRegion.mask('Sending request...');

        fetch(outputUrl)
            .then(response => {
                var responseType = response.headers.get('content-type');
                return response.text().then(responseText => ({ responseType, responseText }));
            })
            .then(result => {
                const { responseType, responseText } = result;
                if (responseType.includes('xml')) {
                    me.setEditorVisibilites('#xml');
                    me.setupXmlEditor();
                    me.xmlEditor.getSession().doc.setValue(responseText);
                } else if (responseType.includes('json')) {
                    // handle API errors from proxies that return JSON messages
                    me.setEditorVisibilites('#json');
                    me.setupJsonEditor();
                    me.jsonEditor.getSession().doc.setValue(responseText);
                } else if (responseType.includes('html')) {
                    // some errors have a HTTP 200 success code but an HTML response
                    me.setEditorVisibilites('#html');
                    me.setupHtmlEditor();
                    me.htmlEditor.getSession().doc.setValue(responseText);
                } else {
                    // assume an image
                    me.setEditorVisibilites('#imageOutput');
                    // for images set the src of the div to the server URL
                    // /this makes a second request to the server, but is more robust than converting to a dataUrl
                    imageContainer.setHtml(`<img src="${outputUrl}" alt="OwS Generated Image">`);
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

        //if (updatedLayerCombos.length > 0) {
        //    me.updateLayerList(updatedLayerCombos);
        //}

    },

    updateLayerList: function (layerCombos) {


        const layerStore = Ext.getStore('layers');

        Ext.each(layerCombos, function (cmb) {

            if (layerStore.getCount() > 0) {
                if (cmb.getXType() === 'multiselectfield') {
                    // select all layers by default
                    cmb.setValue(layerStore.collect('value'));
                } else {
                    // default to the first layer in the list
                    cmb.setValue(layerStore.getAt(0).get('value'));
                }
            }
        });

    },

    /**
     * If the comboboxes were not visible when first bound, then try again when
     * they become visible on a new tab
     */
    onTabChange: function () {

        const me = this;
        me.updateMultiSelectBindings();
        // also recalculate the URL based on the new service type
        me.onParametersUpdated();
    },

    initViewModel: function () {

        const me = this;
        me.updateMultiSelectBindings();

        //Ext.GlobalEvents.on({
        //    mapLoaded: function (mapData) {

        //        const view = me.getView();
        //        const layerCombos = view.query('[name=layersCombo]:visible');

        //        me.updateLayerList(layerCombos);
        //        me.updateMapfileName(mapData);
        //    }
        //});
    }
});
