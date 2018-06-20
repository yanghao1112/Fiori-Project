sap.ui.define([
	"sap/pwaa/controller/ZZBaseController",
	"sap/ui/model/json/JSONModel",
	"sap/viz/ui5/format/ChartFormatter"
], function(Controller, JSONModel, ChartFormatter) {
	"use strict";
	return Controller.extend("sap.pwaa.controller.Z001S001", {
		onInit: function() {

			let oChartFormatter = ChartFormatter.getInstance();
			oChartFormatter.registerCustomFormatter("formatPrecentAxis",this.formatPrecentAxis.bind(this));
			
			var oApp = this.getView().byId("AppControl");
			oApp.attachAfterNavigate(function(oControlEvent) {
				/* 
				 * When the view navigate to Top screen from Search screen
				 * Fires "showAnalysisFilter" to notifies attached event handlers.
				 * For Event handlers, it will open Analysis Filter dialog for user to select
				 */
				let sToView = oControlEvent.getParameter("to").getViewName();
				let sFromView = oControlEvent.getParameter("from").getViewName();
				if (sToView === "sap.pwaa.view.Z001S003" && 
						sFromView === "sap.pwaa.view.Z001S002" ) {
					var oEventBus = sap.ui.getCore().getEventBus();
					oEventBus.publish("showAnalysisFilter");
				}

			}.bind(this))
		}
	});
});