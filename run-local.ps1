switch ($env:computername)
{
    "DESKTOP-69OC7NT"{
        $PROJECT_PATH = "D:\GitHub\ows-inspector"
        $env:Path = "D:\Tools\Sencha\Cmd\7.5.1.20;" + $env:Path
    }
}

cd $PROJECT_PATH

# run just linting

# npm run lint
# install globally if required

# npm install -g eslint --save-dev
# powershell Set-ExecutionPolicy -Scope "CurrentUser" -ExecutionPolicy "RemoteSigned"
# eslint app

# can autofix most lint issues with
eslint app --fix

# may need to add any new dependencies
# npm install

# to build a production build
# cd $PROJECT_PATH
# sencha app build production
# cd D:\GitHub\ows-inspector\build\production\OwsInspector
# C:\Python310\python -m http.server 8000

# and a test build
# cd $PROJECT_PATH
# sencha app build testing
# cd D:\GitHub\ows-inspector\build\testing\OwsInspector
# C:\Python310\python -m http.server 8001

# [ERR] C2001: Closure Compiler Error (Parse error. invalid arrow function parameters) -- compression-input:180095:16
# caused by using the following syntax:  .then(({ responseType, responseText })

sencha app watch  --j2ee --port 3334
# http://localhost:3334

