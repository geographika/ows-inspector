module.exports = {
    "parserOptions": {
        "ecmaVersion": "latest"
        //"ecmaVersion": 5
    },
    "env": {
        "browser": true,
        "es6": true
    },
    "extends": "eslint:recommended",
    "globals": {
        "ace": false,
        "ol": false,
        "Ext": false,
        "proj4": false,
        "BasiGX": false,
        "GeoExt": false,
        "Jsonix": false,
        "XmlBeautify": false,
        "WMS_1_0_0": false,
        "WMS_1_1_0": false,
        "WMS_1_1_1": false,
        "XLink_1_0": false,
        "SE_1_1_0": false,
        "SLD_1_1_0": false,
        "GML_3_1_1": false,
        "SMIL_2_0": false,
        "SMIL_2_0_Language": false,
        "Filter_1_1_0": false,
        "WMS_1_3_0": false,
        "OWS_1_0_0": false,
        "Filter_1_0_0": false,
        "WFS_1_0_0": false,
        "WFS_1_1_0": false,
        "WFS_2_0": false,
        "Filter_2_0": false,
        "OWS_1_1_0": false,
        "OWS_1_0_0": false,
        "OwsInspector": false
    },
    "rules": {
        "no-trailing-spaces": "error",
        "indent": [
            "error",
            4,
            { "SwitchCase": 1 }
        ],
        //"linebreak-style": [
        //  "error",
        //  "unix"
        //],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "always"
        ]
    }
};
