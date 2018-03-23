sap.ui.define([],
    function(){
        const THIS_NAMESPACE = 'sap.ZG001.Sample.CO114.js';
        sap.ui.getCore().initLibrary({
            name : THIS_NAMESPACE,
            version: '1.44.1',
            dependencies : [],
            elements : [
                'sap.ZG001.Sample.CO114.js.sheet',
                'sap.ZG001.Sample.CO114.js.jszip',
                'sap.ZG001.Sample.CO114.js.FileSaver'
            ],
            noLibraryCSS : true
        });
    }
);