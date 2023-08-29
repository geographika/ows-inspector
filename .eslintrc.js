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
        "MapServerStudio": false,
        "LayerFactory": false,
        "GeoStylerSLDParser": false,
        "GeoStylerOpenlayersParser": false,
        "auth0": false
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
