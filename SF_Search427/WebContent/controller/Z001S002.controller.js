sap.ui.define([
	"sap/pwaa/controller/ZZBaseController",
	"sap/ui/model/json/JSONModel",
	"sap/m/Token",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function(ZZBaseController, JSONModel, Token, Filter, FilterOperator) {
	"use strict";
	return ZZBaseController.extend("sap.pwaa.controller.Z001S002", {
		
		/* =========================================================== */
		/* lifecycle methods */
		/* =========================================================== */

		/**
		 * Called when the controller is instantiated.
		 * 1.Set DataManager to the controller.
		 * 2.initialize the search help.
		 * 3.Selt initial input data.
		 * @public
		 */
		onInit : function() {
			"use strict";
			let oComponent = this.getOwnerComponent();
			this._oDataManager = oComponent.oDataManager;
			this._oMessageDisplayer = oComponent.oMessageDisplayer;
			this._ZHE_CLIENT = oComponent.ZHE_CLIENT;
			this._ZHE_COMPANY = oComponent.ZHE_COMPANY;
			this._ZHE_INDUSTRY = oComponent.ZHE_INDUSTRY;
			this._ZHE_LCP = oComponent.ZHE_LCP;
			
			let oCompanyInput = this.getView().byId("OwnerCompany");
			oCompanyInput.addToken(new Token({
				key : oComponent["_oInitialData"]["companyCode"],
				text :  "(" + oComponent["_oInitialData"]["companyCode"] + ")" + oComponent["_oInitialData"]["companyName"]
			}));
						
		},
		
		/* =========================================================== */
		/* event handlers */
		/* =========================================================== */

		/**
		 * Event handling for clicking 'Search' Button Get search result
		 * 
		 * @public
		 */
		onSearch : function(aControlEvent) {
			"use strict";
			let oView = this.getView();
			let oClientInputToken    = oView.byId("ClientInput").getTokens();
			let oLCPInputToken       = oView.byId("LCPInput").getTokens();
			let oOwnerCompanyToken   = oView.byId("OwnerCompany").getTokens();
			let oClientIndustryToken = oView.byId("ClientIndustry").getTokens();
			
			this._checkSearchOption(
				oOwnerCompanyToken,
				oClientIndustryToken,
				oLCPInputToken,
				oClientInputToken
			).then(function() {
			// When there is no error for Search Option

				let oData = this.getView().getModel("SearchHelp").getData();
				this.getView().setModel(new JSONModel({
			        List: oData.ClientInformation
			      }), 'ClientInfoList');
				

				let oFilterArray = this._getInputTokenFilter(null);
				this.getView().byId("ClientList").getBinding("items").filter(oFilterArray, "Control");
				
//				this.setModel(new JSONModel({
//					ClientInformation: oClientInformation,
//					OwnerCompanyInformation: oCompanyInformation,
//					ClientIndustryInformation: oIndustryInformation,
//					LCPInformation: oLCPInformation
//				}), "SearchHelp");
				
//				
//				// Get Search Result from backend by odata model
//				let oPromise = this._oDataManager.getClientInfoListData({
//					// Filter Option for Search
//					Company    : oOwnerCompanyToken.length   > 0 ? oOwnerCompanyToken[0].getKey() : null,
//					Industry   : oClientIndustryToken.length > 0 ? oClientIndustryToken[0].getKey() : null,
//					ClientCode : oClientInputToken.length    > 0 ? oClientInputToken[0].getKey() : null,
//					LCP        : oLCPInputToken.length       > 0 ? oLCPInputToken[0].getKey() : null
//				})
//				return oPromise;
			}.bind(this)
			
			).then(function(aResults) {
//			// When get search result successfully
//				this.getView().setModel(new JSONModel({
//			        List: aResults
//			      }), 'ClientInfoList');
			}.bind(this)
			).catch(function(oErrorString) {
				this._oMessageDisplayer.showSingleError(oErrorString);
			}.bind(this))
		},
		
		/**
		 * Event handling for clicking 'Reset' Button Reset the input to initial
		 * 
		 * @public
		 */
		onReset : function(aControlEvent) {
			"use strict";
			let oView = this.getView();
			let oClientInputToken    = oView.byId("ClientInput").removeAllTokens();
			let oLCPInputToken       = oView.byId("LCPInput").removeAllTokens();
			let oOwnerCompanyToken   = oView.byId("OwnerCompany").removeAllTokens();
			let oClientIndustryToken = oView.byId("ClientIndustry").removeAllTokens();
			
			let oComponent = this.getOwnerComponent();
			
			oView.byId("OwnerCompany").addToken(new Token({
				key : oComponent["_oInitialData"]["companyCode"],
				text :  "(" + oComponent["_oInitialData"]["companyCode"] + ")" + oComponent["_oInitialData"]["companyName"]
			}));
			
		},

		/**
		 * Event handling for clicking Suggested Client Add Selected Client
		 * token to the Client input
		 * 
		 * @public
		 */
		onSuggest: function(aControlEvent) {
			let oFilterArray = this._getInputTokenFilter(null);
			
			let sTerm = aControlEvent.getParameter("suggestValue");
			let sCode = aControlEvent.getSource().getCustomData()[0].getValue();
			let sName = aControlEvent.getSource().getCustomData()[1].getValue();
			
			let oFilterCode = new Filter(sCode, FilterOperator.Contains, sTerm);
			let oFilterName = new Filter(sName, FilterOperator.Contains, sTerm);
			let oFilter = new Filter({
				filters: [oFilterCode,oFilterName],
				and: false
			})
			oFilterArray.push(oFilter);
			
			aControlEvent.getSource().getBinding("suggestionRows").filter(oFilterArray, "Application");
		},
		
		/**
		 * Event handling for clicking Suggested Client Add Selected Client
		 * token to the Client input
		 * 
		 * @public
		 */
		onSuggestionSelected : function(aControlEvent) {
			"use strict";
			let oSource = aControlEvent.getSource();
			let oRow = aControlEvent.getParameter("selectedRow");
			let oData = oRow.getCustomData()[0].getValue();
			let sCode = aControlEvent.getSource().getCustomData()[0].getValue();
			let sName = aControlEvent.getSource().getCustomData()[1].getValue();
			oSource.addToken(new sap.m.Token({
				key : oData[sCode],
				text :  "(" + oData[sCode] + ")" + oData[sName]
			}));
			oSource.setShowSuggestion(false);

		},
		
		/**
		 * When no token in input filed Set the suggestion as on
		 * 
		 * @public
		 */
		onTokenUpdate : function(aControlEvent) {
			if (aControlEvent.getParameter("removedTokens").length > 0) {
				aControlEvent.getSource().setShowSuggestion(true);
			}
		},

		/**
		 * When value is changed in input filed Check there has an exactly value
		 * in suggestion rows if has, set it as token if not, clear the value
		 * 
		 * @public
		 */
		onInputChange : function(aControlEvent) {
			let oSource = aControlEvent.getSource();
			if (oSource.getTokens().length > 0) {
				oSource.setValue("");
			} else {
				oSource.setShowSuggestion(true);
				
				let oFilterArray = this._getInputTokenFilter(null);
				let sValue = aControlEvent.getParameter("value");
				let sCode = aControlEvent.getSource().getCustomData()[0].getValue();
				let sName = aControlEvent.getSource().getCustomData()[1].getValue();
				//let oFilter = new Filter(sCode, FilterOperator.EQ, sValue);
				
				let oFilterCode = new Filter(sCode, FilterOperator.EQ, sValue);
				let oFilterName = new Filter(sName, FilterOperator.EQ, sValue);
				let oFilter = new Filter({
					filters: [oFilterCode,oFilterName],
					and: false
				})
				
				oFilterArray.push(oFilter);
				
				let oListBinding = aControlEvent.getSource().getBinding("suggestionRows");
				oListBinding.filter(oFilterArray, "Application");
				
				let oContexts = oListBinding.getContexts();
				if (oContexts.length === 1 && sValue !== "") {
					oSource.addToken(new sap.m.Token({
						key : oContexts[0].getObject()[sCode],
						text :  "(" + oContexts[0].getObject()[sCode] + ")" + oContexts[0].getObject()[sName]
					}));
					oSource.setValue("");
					oSource.setShowSuggestion(false);
				} else {

					oSource.setValue("");
					oSource.setShowSuggestion(true);
				}
			}
		},
		
		/**
		 * Event handling for clicking 'client data' Navigate to the Top Group
		 * Screen
		 * 
		 * @public
		 */
		onNavToTop: function(aControlEvent) {
			"use strict";
			let oClientData = aControlEvent.getSource().getBindingContext("ClientInfoList").getObject();
			let oComponent = this.getOwnerComponent();
			let oModel = oComponent.getModel("Parameter");

			oModel.setProperty("/ClientCode",oClientData["clientCode"])
			
			this.getOwnerComponent().getRouter().getTargets().display("top");
			
			
		},

		/**
		 * Event handling for clicking 'ValueHelp' of Client Input
		 * 
		 * @public
		 */
		onClientValueHelp: function(aControlEvent) {
			
			let oFilterArray = this._getInputTokenFilter("clientCode");
			
			this._ZHE_CLIENT.open(oFilterArray).then(function(aRet) {
				if (aRet) {
					let oInput = this.getView().byId("ClientInput");
					oInput.removeAllTokens();
					oInput.addToken(new Token({
						key : aRet["client"]["clientCode"],
						text :  "(" + aRet["client"]["clientCode"] + ")" + aRet["client"]["clientName"]
					}))
					oInput.setShowSuggestion(false);
				}
			}.bind(this)).catch(function() {});
		},

		/**
		 * Event handling for clicking 'ValueHelp' of Company Input
		 * 
		 * @public
		 */
		onCompanyValueHelp: function(aControlEvent) {

			let oFilterArray = this._getInputTokenFilter("ownerCompanyCode");
			
			this._ZHE_COMPANY.open(oFilterArray).then(function(aRet) {
				if (aRet) {
					let oInput = this.getView().byId("OwnerCompany");
					oInput.removeAllTokens();
					oInput.addToken(new Token({
						key : aRet["company"]["ownerCompanyCode"],
						text :  "(" + aRet["company"]["ownerCompanyCode"] + ")" + aRet["company"]["ownerCompanyName"]
					}))
					oInput.setShowSuggestion(false);
				}
			}.bind(this)).catch(function() {});
		},

		/**
		 * Event handling for clicking 'ValueHelp' of Industry Input
		 * 
		 * @public
		 */
		onIndustryValueHelp: function(aControlEvent) {

			let oFilterArray = this._getInputTokenFilter("clientIndustryCode");
			
			this._ZHE_INDUSTRY.open(oFilterArray).then(function(aRet) {
				if (aRet) {
					let oInput = this.getView().byId("ClientIndustry");
					oInput.removeAllTokens();
					oInput.addToken(new Token({
						key : aRet["industry"]["clientIndustryCode"],
						text :  "(" + aRet["industry"]["clientIndustryCode"] + ")" + aRet["industry"]["clientIndustryName"]
					}))
					oInput.setShowSuggestion(false);
				}
			}.bind(this)).catch(function() {});
		},

		/**
		 * Event handling for clicking 'ValueHelp' of LCP Input
		 * 
		 * @public
		 */
		onLCPValueHelp: function(aControlEvent) {

			let oFilterArray = this._getInputTokenFilter("lcpcode");
			
			this._ZHE_LCP.open(oFilterArray).then(function(aRet) {
				if (aRet) {
					let oInput = this.getView().byId("LCPInput");
					oInput.removeAllTokens();
					oInput.addToken(new Token({
						key : aRet["lcp"]["lcpcode"],
						text :  "(" + aRet["lcp"]["lcpcode"] + ")" + aRet["lcp"]["lcpname"]
					}))
					oInput.setShowSuggestion(false);
				}
			}.bind(this)).catch(function() {});
		},
		
		
		/* =========================================================== */
		/* begin: internal methods */
		/* =========================================================== */
		
		/**
		 * Check the select option
		 * 
		 * @private
		 */
		_checkSearchOption: function(oOwnerCompanyToken, oClientIndustryToken, oLCPInputToken,	oClientInputToken) {
			let oResourceBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
			
			// Owner Company : Please input value.
			if (oOwnerCompanyToken.length === 0) {
				let oErrorString = oResourceBundle.getText("ZFSearchMSG001",[oResourceBundle.getText("ZFOwnerCompanyLabel")])
				return Promise.reject(oErrorString);
			}
			
			// Client Industry, LCP, Client : Please input value in at least one
			// of them.
			if (oClientIndustryToken.length === 0 &&
					oLCPInputToken.length === 0 &&
					oClientInputToken.length === 0) {
				let oErrorString = oResourceBundle.getText("ZFSearchMSG002",
						[oResourceBundle.getText("ZFClientIndustryLabel"),
							oResourceBundle.getText("ZFLCPLable"),
							oResourceBundle.getText("ZFClientLabel")
					])
				return Promise.reject(oErrorString);
			}
			
			// No Error
			return Promise.resolve();
		},
		
		/**
		 * Return Filter Array according to the current input
		 * 
		 * @private
		 */
		_getInputTokenFilter: function(aExceptCode) {
			let oView = this.getView();
			let oClientInputToken    = oView.byId("ClientInput").getTokens();
			let oLCPInputToken       = oView.byId("LCPInput").getTokens();
			let oOwnerCompanyToken   = oView.byId("OwnerCompany").getTokens();
			let oClientIndustryToken = oView.byId("ClientIndustry").getTokens();
			let oFilterArray = [];
			
			[
				{key:"ownerCompanyCode",	value: oOwnerCompanyToken.length   > 0 ? oOwnerCompanyToken[0].getKey() : null},
				{key:"clientIndustryCode",	value: oClientIndustryToken.length > 0 ? oClientIndustryToken[0].getKey() : null},
				{key:"clientCode",	value: oClientInputToken.length    > 0 ? oClientInputToken[0].getKey() : null},
				{key:"lcpcode",		value: oLCPInputToken.length       > 0 ? oLCPInputToken[0].getKey() : null}
			].forEach(function(aCurrentValue, aIndex, aArr) {
				if (aCurrentValue.value && aCurrentValue.key !== aExceptCode) {
					let oFilter = new Filter(aCurrentValue.key, FilterOperator.Contains, aCurrentValue.value) 
					oFilterArray.push(oFilter);
				}
			});
			
			return oFilterArray;
		}
		
	});
});
