/// <reference path="../../../../../td/ui5/jQuery.d.ts" />.
/// <reference path="../../../../../td/ui5/sap.m.d.ts" />.
/// <reference path="../../../../../td/ui5/sap.ui.d.ts" />.

sap.ui.define([],
    function(){
        const THIS_NAMESPACE = 'sap.ab.thirdParty';
        sap.ui.getCore().initLibrary({
            name : THIS_NAMESPACE,
            version: '1.44.1',
            dependencies : [],
            elements : [
                'sap.ab.thirdParty.d3'
            ],
            noLibraryCSS : true
        });
    }
);