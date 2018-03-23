sap.ui.define([
  "sap/ui/core/mvc/Controller"
], function(Controller) {
  "use strict";
  return Controller.extend("sap.ZG001.simpleReport3.controller.ZZmain", {
    onInit: function(){
      var oComponent = this.getOwnerComponent();
      this._oDataManager = oComponent.oDataManager;
      this._oSearchModel = oComponent.oSearchModel;
      this._oResultModel = oComponent.oResultModel;
      var oFilterBarPromise = new Promise(function(resolve, reject) {
        this.getView().byId("smartFilterBar").attachEventOnce("initialized",function() {
          resolve();
        }.bind(this));
      }.bind(this));
      var oSmartTablePromise = new Promise(function(resolve, reject) {
        this.getView().byId("smarttable").attachEventOnce("initialise",function() {
          resolve();
        }.bind(this));
      }.bind(this));

      this._setFilter();
      Promise.all([oFilterBarPromise, oSmartTablePromise]).then(function() {
//        this.getView().byId("pageVariantId").setCurrentVariantId("id_1509505956444_212_page");
    	  if(this.SBukrs){
  	    	var oSmartTable = this.getView().byId("smarttable");
  	    	oSmartTable._toggleFullScreen(true,true);
      	}
      }.bind(this));
    },
    oncheck2: function(oControlEvent) {
      var x = 1;
      //this.getOwnerComponent().getModel().submitChanges();
    },
    onSave: function(oControlEvent) {
      this.getOwnerComponent().getModel().submitChanges();
    },
    onAdd: function(oControlEvent) {
      var context = this.getOwnerComponent().getModel().createEntry("/ET3Set");
      this.getOwnerComponent().getModel().updateBindings(true);
    },
    _setFilter: function() {
        "use strict"
    	var oSmartFilter = this.getView().byId("smartFilterBar");
    	
    	try {
			var oStartUpParameters = this.getOwnerComponent().getComponentData().startupParameters;
			this.SBukrs = oStartUpParameters.Bukrs[0];
    	}	catch (o) {
    	}
    	
    	if(this.SBukrs){
        	var oSelectOption0 = new sap.ui.comp.smartfilterbar.SelectOption(
        			"SBukrs",{
        				sign : sap.ui.comp.smartfilterbar.SelectOptionSign.I,
        				operator : sap.ui.model.FilterOperator.EQ,
        				low : this.SBukrs
        			})
        	
        	var oSelectOption2 = new sap.ui.comp.smartfilterbar.SelectOption(
    				"SAsnrbu",{
    					sign : sap.ui.comp.smartfilterbar.SelectOptionSign.I,
    					operator : sap.ui.model.FilterOperator.EQ,
    					low : "1000"
    				});
        	
        	oSmartFilter.getControlConfiguration()[0].insertDefaultFilterValue(oSelectOption0,0);
        	oSmartFilter.getControlConfiguration()[2].insertDefaultFilterValue(oSelectOption2,1);
   		
        	this.getView().byId("smarttable").setEnableAutoBinding(true);
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