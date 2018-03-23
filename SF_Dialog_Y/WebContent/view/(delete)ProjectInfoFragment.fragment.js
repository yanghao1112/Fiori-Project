sap.ui.jsfragment ( "sap.ui.demo.wt.view.ProjectInfoFragment",{ 
	createContent: function (oController) {
        var oProjectInfo = sap.ui.xmlfragment(
					"sap.ui.demo.wt.view.ProjectInfo", oController);
        oController.getView().addDependent(oProjectInfo);
        var xxx = oProjectInfo.getId();
        oProjectInfo.attachBrowserEvent("click", function() {
        	var ttt = oController.getView().byId(xxx);
        	var x = 1;
        	var t = xxx;
        }, this);
        
		return oProjectInfo; 
	} 
});