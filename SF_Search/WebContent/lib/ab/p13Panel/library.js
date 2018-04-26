/// <reference path="../../../../../td/ui5/jQuery.d.ts" />.
/// <reference path="../../../../../td/ui5/sap.m.d.ts" />.
/// <reference path="../../../../../td/ui5/sap.ui.d.ts" />.

sap.ui.define(['jquery.sap.global'],
    function(jQuery){
        const THIS_NAMESPACE = 'sap.ab.p13Panel';
        sap.ui.getCore().initLibrary({
            name : THIS_NAMESPACE,
            version: '1.44.1',
            dependencies : [
                'sap.ui.core'
            ],
            controls : [
                'sap.ab.p13Panel.CustomPanel'
            ],
            noLibraryCSS : true
        });
        jQuery.sap.includeStyleSheet(jQuery.sap.getModulePath(THIS_NAMESPACE) + '/library.css');
    }
);