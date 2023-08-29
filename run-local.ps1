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
# sencha app build production

sencha app watch  --j2ee --port 3334
# http://localhost:3334

