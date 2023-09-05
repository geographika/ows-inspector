Development Setup
-----------------

Download SenchaCmd from https://support.sencha.com/#download
Download the GPL version of ExtJS from https://github.com/tremez/extjs-gpl/tree/7.0.0

Run a PowerShell prompt:

.. code-block:: ps1

    $PROJECT_PATH="D:\GitHub\ows-inspector"
    cd $PROJECT_PATH
    New-Item -ItemType SymbolicLink -Path ext -Target "D:\Tools\Sencha\extjs-gpl-7.0.0"
    npm install

Eslint
------

.. code-block:: ps1

    npm install eslint --save
    eslint --init
    eslint --fix app/

Build Production Release
------------------------

.. code-block:: ps1

    $PROJECT_PATH="D:\GitHub\ows-inspector"
    $env:PATH += ";D:\Tools\Sencha\Cmd\7.5.1.20"
    cd $PROJECT_PATH
    sencha app build production


