sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel"
], function(Controller, JSONModel) {
	"use strict";
	
	return Controller.extend("sap.ZZZ01.ZVALUEHELP.controller.ZZmain", {
		
		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */
		
		/**
		 * Called when the controller is instantiated. It sets up the constant and JSON Model.
		 * @public
		 */
		onInit : function(evt) {

			var oView = this.getView();
			oView.bindElement("/CompanySet('123')");
			
//			var control = oView.byId("InputTest");
//            var model = oView.getModel();
//            var oHelper = new sap.ui.comp.smartfield.ODataHelper(model, new sap.ui.comp.smartfield.BindingUtil());
//            var analyser = oHelper.getAnalyzer(model);
//            var d = new sap.ui.comp.providers.ValueHelpProvider({			
//                loadAnnotation: true,
//                fullyQualifiedFieldName: "ZVALUEHELP_SRV.Company/Butxt",      
//                annotation: undefined,                   
//                metadataAnalyser: analyser,    
//                control: control,
//                model: model,		
//                preventInitialDataFetchInValueHelpDialog: true,	
//                dateFormatSettings: null,							
//                takeOverInputValue: false,						
//                supportMultiSelect: false,
//                supportRanges: false,
//                fieldName: 'Butxt',								
//                title: 'Company Name',							
//                displayBehaviour: 'null'								
//            });
//            d.attachValueListChanged(this.onValueListChanged);
//            var e = new sap.ui.comp.providers.ValueListProvider({					
//                control: control,					
//                typeAheadEnabled: true,    
//                aggregation: 'suggestionRows',			
//                loadAnnotation: true,
//                fullyQualifiedFieldName: 'ZVALUEHELP_SRV.Company/Butxt',   
//                metadataAnalyser: analyser,            
//                model: model,                                
//                dateFormatSettings: null,					
//                displayBehaviour: null					
//            });
//            e.attachValueListChanged(this.onValueListChanged);
		//		this.getOwnerComponent().getModel().getMetaModel().loaded().then(this.onAfter.bind(this));
		},
		
//		onAfterRendering: function() {
//			var oView = this.getView();
//			
//			var control = oView.byId("idCategory2");
//			var bindinginfo = control.getBindingInfo("value");
//			control.attachEventOnce("innerControlsCreated", function(){
//				control.getAggregation("_content").bindProperty("value",bindinginfo);
//				var gy = 1;
//			});
//			
//		},
		onAfter: function() {
			var oView = this.getView();
			
			var control = oView.byId("InputTest");
            var model = oView.getModel();
            var oHelper = new sap.ui.comp.smartfield.ODataHelper(model, new sap.ui.comp.smartfield.BindingUtil());

            var analyser = oHelper.getAnalyzer(model);
            var d = new sap.ui.comp.providers.ValueHelpProvider({			
                loadAnnotation: true,
                fullyQualifiedFieldName: "ZVALUEHELP_SRV.Company/Butxt",      
                annotation: undefined,                   
                metadataAnalyser: analyser,    
                control: control,
                model: model,		
                preventInitialDataFetchInValueHelpDialog: true,	
                dateFormatSettings: null,							
                takeOverInputValue: false,						
                supportMultiSelect: false,
                supportRanges: false,
                fieldName: 'Butxt',								
                title: 'Company Name',							
                displayBehaviour: 'null'								
            });
            d.attachValueListChanged(this.onValueListChanged);
            var e = new sap.ui.comp.providers.ValueListProvider({					
                control: control,					
                typeAheadEnabled: true,    
                aggregation: 'suggestionRows',			
                loadAnnotation: true,
                fullyQualifiedFieldName: 'ZVALUEHELP_SRV.Company/Butxt',   
                metadataAnalyser: analyser,            
                model: model,                                
                dateFormatSettings: null,					
                displayBehaviour: null					
            });
            e.attachValueListChanged(this.onValueListChanged);
		},
		onValueListChanged: function(evt) {
			var x = evt;
		},
		onChange: function(evt) {
			var x = evt;
		},
		/*The data type for name with code*/
		ZTypeNameCode: sap.ui.model.CompositeType.extend("ZTypeNameCode", {
			formatValue: function (aValue) {
				if (typeof (aValue) === "undefined") {
					return "";
				} else {
					if (aValue[0] && aValue instanceof Array) {
						if (aValue[1]) {
							return aValue[1] + " (" + aValue[0] + ")";
						} else {
							return aValue[0];
						}
					} else {
						if (aValue) {

							return aValue;
						} else {

							return "";
						}
					}
				}
			},
            parseValue: function (aValue) {
                var iPos1 = aValue.lastIndexOf("(")
                var iPos2 = aValue.lastIndexOf(")")
                var sName = "";
                var sNumber = "";
                if (iPos1 < 0 || iPos2 < 0) {
                       sName = "";
                       sNumber = aValue;
                } else {
                       if (iPos1 === 0) {
                              sName = "";
                       } else {
                              sName = aValue.slice(0,iPos1);
                       }
                       sNumber = aValue.slice(iPos1 + 1,iPos2);
                }
                return [sNumber,sName];
            },
            validateValue: function (aValue) {
            }
		}),
		onUpload: function() {
			var x = this.getView().byId("idCategory");
		}
	});

});