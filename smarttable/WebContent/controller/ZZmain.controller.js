sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(Controller) {
	"use strict";
	return Controller.extend("sap.ZG001.simpleReport2.controller.ZZmain", {
		onInit: function(){
			var oComponent = this.getOwnerComponent();
			this._oDataManager = oComponent.oDataManager;
			this._oSearchModel = oComponent.oSearchModel;
			this._oResultModel = oComponent.oResultModel;
		},
		onBeforeRebindTable:  function(oEvent) {
			var oBindingParams = oEvent.getParameter( "bindingParams" );
//	        if  (oBindingParams.parameters.select.search( "Belnr" ) > 0) {
//                 oBindingParams.parameters.select +=  ",Url" ;
//	        }
			
		},
		
		onselect: function(e) {
			var x = 1;
		},
		fmtUrl: function(aRbukrs, aGjahr, aBelnr){
			var sUrl = "FioriLaunchpad.html?#AccountingDocument-displayFactSheet?&/AccountingDocuments(CompanyCode='$1',FiscalYear='$2',AccountingDocument='$3')";
			if(aRbukrs && aGjahr && aBelnr){
				return sUrl.replace("$1", aRbukrs).replace("$2", aGjahr).replace("$3", aBelnr); 
			}
			else{
				return "#";
			}
		},
		fmtStatus: function(aGjahr){
			if(aGjahr === 'A'){
				return "1";
			} else if(aGjahr === 'B') {
				return "2";
			} else if(aGjahr === 'C') {
				return "3";
			} else {
				return "0";
			}
		},
		fmtText: function(aGjahr){
			if(aGjahr === 'A'){
				return "1";
			} else if(aGjahr === 'B') {
				return "2";
			} else if(aGjahr === 'C') {
				return "3";
			} else {
				return "0";
			}
		},

		/*
		onSearch: function(){			
			this._oDataManager.getET1(this._oSearchModel.getData()).then(function(aResult){
				this._oResultModel.setData(aResult);
				return Promise.resolve();
			}.bind(this));
		},
		onClear: function(){
			this._oSearchModel.setProperty("/Bukrs", "");
			this._oSearchModel.setProperty("/Gjahr", "");
			this._oSearchModel.setProperty("/Budat", "");
			this._oSearchModel.setProperty("/Assignment", "");
		},
		onResetAllSort: function(){
			this._resetState();
		},
		_resetState : function() {
			var oTable = this.getView().byId("result");
			var aColumns = oTable.getColumns();
			
			oTable.getBinding("rows").filter(null, "Application");
			oTable.getBinding("rows").sort(null);
			
			for (var i=0; i<aColumns.length; i++) {
				aColumns[i].setSorted(false);
				aColumns[i].setFiltered(false);
				aColumns[i].setGrouped(false);
				//oTable.filter(aColumns[i], null);
			}
			oTable.setGroupBy(null);
		},
		*/
	});

});