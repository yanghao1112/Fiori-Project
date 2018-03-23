(function(){
	"use strict";
	
	jQuery.sap.declare("sap.ZG001.timesheet.valuehelp.util.ZHE_APPROVER");
	
	var oValueHelpDialog = null;
	var oFilterBar = null;
	var oResultTable = null;
	var oTemplate = null;
	var oSearchModel = null;
	var oResultModel = null;
	var bIsInitialized = false;
	var bIsPhone = sap.ui.Device.system.phone;
	var sServiceUrl = "proxy/sap/opu/odata/sap/ZGOHR004_SRV/?&sap-client=120";
	var oDeferred = null;
	
	/* Initialize for first time */
	function initialize(){
		"use strict";
		
		/* For phone need to initialize and destroy every time */ 
		if (bIsPhone === false){
			bIsInitialized = true;
		}
		
		/* Create table line template */
		if (bIsPhone === true){
			oTemplate = new sap.m.ColumnListItem({
				customData: [new sap.ui.core.CustomData({key: "Pernr", value: "{result>Pernr}"}),
				             new sap.ui.core.CustomData({key: "Ename", value: "{result>Ename}"}),
				             new sap.ui.core.CustomData({key: "Orgtx", value: "{result>Orgtx}"}),
				             new sap.ui.core.CustomData({key: "Zranknme", value: "{result>Zranknme}"}),
				             new sap.ui.core.CustomData({key: "Zlname", value: "{result>Zlname}"}),
				             new sap.ui.core.CustomData({key: "Zfname", value: "{result>Zfname}"})
				],
				cells:[
				       new sap.m.VBox({
				    	   items: [new sap.m.ObjectIdentifier({title: "{result>Pernr}"}),
				    	           new sap.m.ObjectIdentifier({title: "{result>Orgtx}"})]
				       }),
				       new sap.m.VBox({
				    	   items: [new sap.m.ObjectIdentifier({title: "{result>Ename}"}),
				    	           new sap.m.ObjectIdentifier({title: "{result>Zranknme}"})]
				       })
				]
	
			});
		}
		else{
			oTemplate = new sap.m.ColumnListItem({
				customData: [new sap.ui.core.CustomData({key: "Pernr", value: "{result>Pernr}"}),
				             new sap.ui.core.CustomData({key: "Ename", value: "{result>Ename}"}),
				             new sap.ui.core.CustomData({key: "Orgtx", value: "{result>Orgtx}"}),
				             new sap.ui.core.CustomData({key: "Zranknme", value: "{result>Zranknme}"}),
				             new sap.ui.core.CustomData({key: "Zlname", value: "{result>Zlname}"}),
				             new sap.ui.core.CustomData({key: "Zfname", value: "{result>Zfname}"})
				],
				cells:[
				       new sap.m.ObjectIdentifier({title: "{result>Pernr}"}),
				       new sap.m.ObjectIdentifier({title: "{result>Ename}"}),
				       new sap.m.ObjectIdentifier({title: "{result>Orgtx}"}),
				       new sap.m.ObjectIdentifier({title: "{result>Zranknme}"}),
				]
	
			});
		}
		
		
		/* Create ValueHelpDialog */
		oValueHelpDialog = sap.ui.xmlfragment(
				"sap.ZG001.timesheet.valuehelp.view.ZHE_APPROVER_VH",
				this);
		
		/* Create FilterBar */
		oFilterBar = sap.ui.getCore().byId("ZHE_APPROVER_FB");
		oFilterBar.setBasicSearch(new sap.m.SearchField({
			value: "{search>/Zfreetext}",
			showSearchButton: bIsPhone
		}));
		

		oFilterBar.attachSearch(onSearch);
		oFilterBar.attachClear(onClear);

		/* Create Result Table */
		oResultTable = sap.ui.xmlfragment(
				"sap.ZG001.timesheet.valuehelp.view.ZHE_APPROVER_RT",
				this);

		/* Add Result Table to Value Help Dialog */
		oValueHelpDialog.setTable(oResultTable);
		oValueHelpDialog.attachSelectionChange(onSelect);
		oValueHelpDialog.attachCancel(onCancel);
		oValueHelpDialog.attachAfterClose(onAfterClose);
		
		/* Initialize models */
		oSearchModel = new sap.ui.model.json.JSONModel();
		oResultModel = new sap.ui.model.odata.ODataModel(sServiceUrl, true);
		oFilterBar.setModel(oSearchModel, "search");
		oResultTable.setModel(oResultModel, "result");
		
        /* set device model */
        var deviceModel = new sap.ui.model.json.JSONModel(
                {
                    isTouch : sap.ui.Device.support.touch,
                    isNoTouch : !sap.ui.Device.support.touch,
                    isPhone : sap.ui.Device.system.phone,
                    isNoPhone : !sap.ui.Device.system.phone,
                    listMode : sap.ui.Device.system.phone ? "None"
                            : "SingleSelectMaster",
                    listItemType : sap.ui.Device.system.phone ? "Active"
                            : "Inactive",
                    singlePerson : true        
                });
        
        /* set i18n model */
        var sRootPath = jQuery.sap.getModulePath("sap.ZG001.timesheet.valuehelp");
        var i18nModel = new sap.ui.model.resource.ResourceModel({
                    bundleUrl : [ sRootPath, "i18n/i18n.properties" ].join("/")
                });
        
        deviceModel.setDefaultBindingMode("OneWay");
        oFilterBar.setModel(deviceModel, "device");
        oResultTable.setModel(deviceModel, "device");

        oFilterBar.setModel(i18nModel, "i18n");
        oResultTable.setModel(i18nModel, "i18n");
        
		oFilterBar.setModel(oSearchModel, "search");
		oResultTable.setModel(oResultModel, "result");
		
	}
	
	/* Clear all conditions */
	function clearConditions(){
		"use strict";
		oSearchModel.setData({
			Pernr: "",
			Orgtx: "",
			Ename: "",
			Zlname: "",
			Zfname: "",
			Zfreetext: ""
		});
	}
	
	/* Clear table entries */
	function clearTable(){
		oResultTable.bindItems({
		    path : "null>/",
		    template: oTemplate
		});
	}
	
	/* Search Button Press Event */
	function onSearch(aEvent){
		"use strict";
		var condArray = [];
		var oFilters = null;
		var oConds = {"Pernr": [], 
				"Ename": [],
				"Orgtx": [],
				"Zfname": [],
				"Zlname": [],
				"Zfreetext": []
		}
		
		/* generate conditions for each field */
		$.each(oSearchModel.getData(), function(aKey, aVal){
			if (aVal !== ""){
				oConds[aKey].push(new sap.ui.model.Filter(aKey, "Contains", aVal));
			}
			
		});
		
		/* merge conditions for each field */
		$.each(oConds, function(aKey, aVal){
			if (oConds[aKey].length > 0){
				condArray.push(new sap.ui.model.Filter({
					filters: oConds[aKey],
					and: false
				}));
			}
		});
		
		/* merge all conditions */
		if (condArray.length > 0){
			oFilters = new sap.ui.model.Filter({
				filters: condArray,
				and: true
			})
		}
		
		oResultTable.bindItems({
		    path : "result>/ZHE_APPROVERSet",
		    template: oTemplate,
		    filters: oFilters
		});
		
	}
	
	/* Select Table Item Event */
	function onSelect(aEvent){
		"use strict";
		var oSelected = aEvent.getParameter("tableSelectionParams").listItem.getCustomData();
		var oRet = {};
		
		$.each(oSelected, function(aKey, aValue){
			oRet[aValue.getKey()] = aValue.getValue();
		});
		
		oValueHelpDialog.close();
		oDeferred.resolve(oRet);

	}
	
	/* OK Button Press Event */
	function onOK(aEvent){
		"use strict";
		sap.m.MessageToast.show("OK!");
	}
	
	/* Clear Button Press Event */
	function onClear(aEvent){
		"use strict";
		clearConditions();
	}

	/* Cancel Button Press Event */
	function onCancel(aEvent){
		"use strict";
		oValueHelpDialog.close();
		oDeferred.reject();
	}
	
	/* Clean up */
	function onAfterClose(aEvent){
		if (bIsPhone === true){
			oValueHelpDialog.destroy();
		}
	}
	
	sap.ZG001.timesheet.valuehelp.util.ZHE_APPROVER = {
		
		/* Open dialog */
		open : function(){
				"use strict";
				
				oDeferred = jQuery.Deferred();
				if (bIsInitialized === false){
					initialize();
				}
				else{
					clearConditions();
					clearTable();
				}

				oValueHelpDialog.open();
				oValueHelpDialog.update();
				
				return oDeferred;
		}

	}
})();
