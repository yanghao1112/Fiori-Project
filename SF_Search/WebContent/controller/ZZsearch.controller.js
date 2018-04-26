sap.ui.define([ "sap/ui/core/mvc/Controller", "sap/ui/model/json/JSONModel",
		"sap/ui/demo/wt/util/formatter", "sap/ui/model/Filter", "sap/m/Token" ], function(
		Controller, JSONModel, formatter, Filter, Token) {
	"use strict";
	return Controller.extend("sap.ui.demo.wt.controller.ZZsearch", {
		formatter : formatter,
		
		onInit : function() {
			"use strict";
			let oComponent = this.getOwnerComponent();
			this._oDataManager = oComponent.oDataManager;
			this._ZHE_CLIENT = oComponent.ZHE_CLIENT;
			this._oDataManager.getClientListData().then(function(aResults) {
				this.getView().setModel(new JSONModel({
			        ClientList: aResults.results
			      }), 'Client');
			}.bind(this))
//			this.getView().setModel(this.getOwnerComponent().getModel(),"odata");

//			this.getView().byId("MultiInput").setSuggestionRowValidator(
//					this.suggestionRowValidator);
//			this.getView().byId("MultiInput").setFilterFunction(this.handleSuggest)
		},

		onAfterRendering : function() {
			"use strict";

		},

		/* Event handling for clicking 'Search' */
		onSearch : function(aControlEvent) {
			"use strict";
			let oView = this.getView();
			let oClientCodeInputToken = oView.byId("ClientCodeInput").getTokens();
			let oClientNameInputToken = oView.byId("ClientNameInput").getTokens();
			let oLCPInputToken        = oView.byId("LCPInput").getTokens();
			let oCompanyInputToken    = "";
			let oBUInputToken         = "";
			//let oCompanyInputToken    = oView.byId("CompanyInput").getTokens();
			//let oBUInputToken         = oView.byId("BUInput").getTokens();
			let oAnalysisOptionCustomData = oView.byId("AnalysisOption").getSelectedButton().getCustomData();

			// Get Search Result from backend by odata model
			this._oDataManager.getClientInfoListData({
				// Filter Option for Search
				ClientCode : oClientCodeInputToken.length > 0 ? oClientCodeInputToken[0].getKey() : null,
				ClientName : oClientNameInputToken.length > 0 ? oClientNameInputToken[0].getKey() : null,
				LCP        : oLCPInputToken.length        > 0 ? oLCPInputToken[0].getKey() : null,
				Company    : oCompanyInputToken.length    > 0 ? oCompanyInputToken[0].getKey() : null,
				BU         : oBUInputToken.length         > 0 ? oBUInputToken[0].getKey() : null,
				AnalysisOption : oAnalysisOptionCustomData[0].getKey()
			}).then(function(aResults) {
				this.getView().setModel(new JSONModel({
			        List: aResults.results
			      }), 'ClientInfoList');
			}.bind(this))
		},

		/* Event handling for clicking 'Reset' */
		onReset : function(aControlEvent) {
			"use strict";
			let oView = this.getView();
			let oClientCodeInputToken = oView.byId("ClientCodeInput").removeAllTokens();
			let oClientNameInputToken = oView.byId("ClientNameInput").removeAllTokens();
			let oLCPInputToken        = oView.byId("LCPInput").removeAllTokens();
			
		},
		suggestionItemSelected : function(aControlEvent) {
			"use strict";
			var source = aControlEvent.getSource();
			var row = aControlEvent.getParameter("selectedRow");
			var data = row.getCustomData()[0].getValue();
			source.addToken(new sap.m.Token({
				key : data["Code"],
				text : data["Name"] + "(" + data["Code"] + ")"
			}))
			source.setShowSuggestion(false);

		},
		tokenUpdate : function(aControlEvent) {
			if (aControlEvent.getParameter("removedTokens").length > 0) {
				aControlEvent.getSource().setShowSuggestion(true);
			}
			;
		},
		changewwww : function(aControlEvent) {
			var oSource = aControlEvent.getSource();
			if (oSource.getTokens().length > 0) {
				oSource.setValue("");
			} else {
				var oClientData = this.getView().getModel("Client").getData();
				var sValue = oSource.getValue();
				for (var i = 0; i < oClientData["ClientList"].length; i++) {
					if (oClientData["ClientList"][i]["Code"].indexOf(sValue) > -1) {

						oSource.addToken(new Token({
							key : oClientData["ClientList"][i]["Code"],
							text : oClientData["ClientList"][i]["Name"] + "("
									+ oClientData["ClientList"][i]["Code"] + ")"
						}))
						oSource.setShowSuggestion(false);
						break;
					}
				}
				oSource.setShowSuggestion(true);
				oSource.setValue("");
			}
		},
		onNavDetail: function(aControlEvent) {
			var oCustomData = aControlEvent.getSource().getCustomData();
			
			var sAnalysisOption = oCustomData ? oCustomData[0].getValue().AnalysisOption : "";
			var sLCP			= oCustomData ? oCustomData[0].getValue().LCP : "";
			var sType           = oCustomData ? oCustomData[1].getValue() : "";
			var sClientCode     = oCustomData ? oCustomData[0].getValue().ClientCode : "";
			
			this.getOwnerComponent().getRouter().navTo("top", {
				sAnalysisOption: sAnalysisOption,
				sType          : sType,
				sLCP           : sLCP,
				sClientCode    : sClientCode
			},false);
			
			//this._ZHE_CLIENT.open();
		},
		onClientValueHelp: function(aControlEvent) {

			this._ZHE_CLIENT.open().then(function(aRet) {
				if (aRet) {
					let oInput = this.getView().byId("ClientCodeInput");
					oInput.removeAllTokens();
					oInput.addToken(new Token({
						key : aRet["Pernr"]["Code"],
						text : aRet["Pernr"]["Name"] + "("
								+ aRet["Pernr"]["Code"] + ")"
					}))
					oInput.setShowSuggestion(false);
				}
			}.bind(this));
		}
	});
});
