sap.ui.define([],
    function(){
        const THIS_NAMESPACE = 'sap.ZZZ01.ZCHARTTEST.js';
        sap.ui.getCore().initLibrary({
            name : THIS_NAMESPACE,
            version: '1.44.1',
            dependencies : [],
            elements : [
                'sap.ZZZ01.ZCHARTTEST.js.sheet',
                'sap.ZZZ01.ZCHARTTEST.js.jszip',
                'sap.ZZZ01.ZCHARTTEST.js.FileSaver'
            ],
            noLibraryCSS : true
        });
    }
);