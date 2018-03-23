sap.ui.define([],
    function(){
        const THIS_NAMESPACE = 'zco103.js';
        sap.ui.getCore().initLibrary({
            name : THIS_NAMESPACE,
            version: '1.44.1',
            dependencies : [],
            elements : [
                'zco103.js.sheet',
                'zco103.js.jszip',
                'zco103.js.FileSaver'
            ],
            noLibraryCSS : true
        });
    }
);