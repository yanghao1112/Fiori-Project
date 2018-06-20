sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/resource/ResourceModel",
	"./util/DataManager",
	"./util/MessageDisplayer",
	"./valuehelp/util/ZHE_CLIENT",
	"./valuehelp/util/ZHE_COMPANY",
	"./valuehelp/util/ZHE_INDUSTRY",
	"./valuehelp/util/ZHE_LCP",
	"./popup/util/ZPO_ANALYSISFILTER",
	"./popup/util/ZPO_TALENTCARD",
	"./popup/util/ZPO_ENGAGE",
	"sap/m/MessageBox"
], function(UIComponent, JSONModel, ResourceModel, DataManager, MessageDisplayer,
		ZHE_CLIENT, ZHE_COMPANY, ZHE_INDUSTRY, ZHE_LCP, ZPO_ANALYSISFILTER, ZPO_TALENTCARD, ZPO_ENGAGE, MessageBox) {
	"use strict";
	return UIComponent.extend("sap.pwaa.Component", {
		
		/* =========================================================== */
		/* Component Configuration */
		/* =========================================================== */

		/**
		 * Get configuration from manifest.json
		 * @public
		 */
		metadata : {
			manifest : "json"
		},
		
		/* =========================================================== */
		/* lifecycle methods */
		/* =========================================================== */

		/**
		 * Called when the component is instantiated.
		 * 1.Create DataManager which user for url request.
		 * 2.initialize parameter (Member Assigned / AnalysisGroupUnit ).
		 * 3.initialize search help .
		 * 4.initialize Analysis Filter Screen .
		 * 5.initialize Talent Screen .
		 * 6.initialize Engagement Detail Screen .
		 * @public
		 */
		init : function() {


			// call the init function of the parent
			UIComponent.prototype.init.apply(this, arguments);
			
			let oCore = sap.ui.getCore();
			oCore.loadLibrary('sap/ab/thirdParty', {url:'lib/ab/thirdParty', async:true});
			oCore.loadLibrary('sap/ab/graph', {url:'lib/ab/graph', async:true});
			oCore.loadLibrary('sap/ab/projectCard', {url:'lib/ab/projectCard', async:true});
			
			this.oDataManager = new DataManager(this);
			this.oMessageDisplayer = new MessageDisplayer(this);
			
			let oParameter = {
					Changeable: true,
					ClientCode: "",
					AssignMemberType: null,
					AssignMemberTypeText: "",
					AssignMemberTypeIndex: 0,
					AnalysisGroupUnit: null,
					AnalysisGroupUnitText: "",
					AnalysisGroupUnitIndex: 0
			}

			this.ZHE_CLIENT = new ZHE_CLIENT();
			this.ZHE_COMPANY = new ZHE_COMPANY();
			this.ZHE_INDUSTRY = new ZHE_INDUSTRY();
			this.ZHE_LCP = new ZHE_LCP();

			let oParameterModel = new JSONModel(oParameter);
			oParameterModel.setDefaultBindingMode("OneWay");
			this.setModel(oParameterModel, "Parameter");
			
			this.ZPO_ANALYSISFILTER = new ZPO_ANALYSISFILTER(oParameterModel);
			this.ZPO_TALENTCARD = new ZPO_TALENTCARD();
			this.ZPO_ENGAGE = new ZPO_ENGAGE(this.oDataManager);
			
			
			this.oColorArray = ["rgb(44, 44, 84)","rgb(71, 71, 135)","rgb(170, 166, 157)","rgb(34, 112, 147)","rgb(33, 140, 116)",
				"rgb(179, 57, 57)","rgb(205, 97, 51)","rgb(132, 129, 122)","rgb(204, 142, 53)","rgb(204, 174, 98)",
				"rgb(64, 64, 122)","rgb(112, 111, 211)","rgb(247, 241, 227)","rgb(52, 172, 224)","rgb(51, 217, 178)",
				"rgb(255, 82, 82)","rgb(255, 121, 63)","rgb(209, 204, 192)","rgb(255, 177, 66)","rgb(255, 218, 121)"]
			
			this.oDataManager.getInitData().then(
				this._handleInitData.bind(this)
			).then(function() {
				this.getRouter().initialize();
			}.bind(this)).catch(function(aError){
				this.oMessageDisplayer.showError(aError);
			}.bind(this));
			
			
			/* attach handlers for validation errors */
			sap.ui.getCore().attachValidationError(function (aEvent) {
				var oControl = aEvent.getParameter("element");
				var sMsg = aEvent.getParameter("message");
				if (oControl && oControl.setValueState) {
					oControl.setValueState("Error");
					oControl.setValueStateText(sMsg);
					oControl.focus();
				}
			});
			/* attach handlers for validation success */
			sap.ui.getCore().attachValidationSuccess(function (aEvent) {
				var oControl = aEvent.getParameter("element");
				if (oControl && oControl.setValueState) {
					oControl.setValueState("None");
				}
			});
			/* attach handlers for validation errors */
			sap.ui.getCore().attachParseError(function (aEvent) {
				var oControl = aEvent.getParameter("element");
				var sMsg = aEvent.getParameter("message");
				if (oControl && oControl.setValueState) {
					oControl.setValueState("Error");
					oControl.setValueStateText(sMsg);
					oControl.focus();
				}
			});
		},
		
		_initPeriod: function(aPeriod) {

			let iCurrentPeriod = aPeriod;
			let oPeriodData = [];
			for(let iIndex = 1; iIndex < 13; iIndex++) {
				let sPeriod = "";
				let sClass = "ZPeriodBorderNormal";
				if (iIndex < 10) {
					sPeriod = "P0" + iIndex;
				} else {
					sPeriod = "P" + iIndex;
				}
				if (iIndex === 12) {
					sClass = "ZPeriodBorderEnd"
				}
				if (sPeriod === iCurrentPeriod) {
					sClass += " ZCurrentPeriod"
				}
				
				oPeriodData.push({
					Period: sPeriod,
					Class: sClass
				})
			}

			let oPeriodModel = new JSONModel(oPeriodData);
			oPeriodModel.setDefaultBindingMode("OneWay");
			this.setModel(oPeriodModel, "Period");
		},
		
		_handleInitData: function(aResult) {
			let oResult = aResult[0];
			let oInitialData = {
				period : oResult["initData"]["period"],
				fy : oResult["initData"]["fy"],
				companyCode : oResult["initData"]["companyCode"],
				companyName : oResult["initData"]["companyName"],
			}
			this._oInitialData = oInitialData;
			this._initPeriod(oInitialData.period);
			
			let oClientInformation = [];
			let oLCPInformation = [];
			let oLCPIndex = {};
			let oIndustryInformation = [];
			let oIndustryIndex = {};
			let oCompanyInformation = [];
			let oCompanyIndex = {};
			oClientInformation = oResult["clients"];
			$.each(oResult["clients"], function(aIdxData, aData) {
				//LCP Information
				let iLCPIndex = oLCPIndex[aData["lcpcode"]];
				if (typeof(iLCPIndex) === "undefined") {
					oLCPIndex[aData["lcpcode"]] = oLCPInformation.length;
					oLCPInformation.push({
						"lcpcode":aData["lcpcode"],
						"lcpname":aData["lcpname"],
						"clientCode":aData["clientCode"],
						"clientIndustryCode":aData["clientIndustryCode"],
						"ownerCompanyCode":aData["ownerCompanyCode"]
					});
				} else {
					$.each(["clientCode","clientIndustryCode","ownerCompanyCode"], function(aIdxKey, aKey) {
						if (oLCPInformation[iLCPIndex][aKey].indexOf(aData[aKey]) === -1 ) {
							oLCPInformation[iLCPIndex][aKey] = 
								[oLCPInformation[iLCPIndex][aKey], aData[aKey]].join(",");
						}
					});
				}

				//Industry Information
				let iIndustryIndex = oIndustryIndex[aData["clientIndustryCode"]];
				if (typeof(iIndustryIndex) === "undefined") {
					oIndustryIndex[aData["clientIndustryCode"]] = oIndustryInformation.length;
					oIndustryInformation.push({
						"clientIndustryCode":aData["clientIndustryCode"],
						"clientIndustryName":aData["clientIndustryName"],
						"lcpcode":aData["lcpcode"],
						"clientCode":aData["clientCode"],
						"ownerCompanyCode":aData["ownerCompanyCode"]
					});
				} else {
					$.each(["clientCode","lcpcode","ownerCompanyCode"], function(aIdxKey, aKey) {
						if (oIndustryInformation[iIndustryIndex][aKey].indexOf(aData[aKey]) === -1 ) {
							oIndustryInformation[iIndustryIndex][aKey] = 
								[oIndustryInformation[iIndustryIndex][aKey], aData[aKey]].join(",");
						}
					});
				}

				//Company Information
				let iCompanyIndex = oCompanyIndex[aData["ownerCompanyCode"]];
				if (typeof(iCompanyIndex) === "undefined") {
					oCompanyIndex[aData["ownerCompanyCode"]] = oCompanyInformation.length;
					oCompanyInformation.push({
						"ownerCompanyCode":aData["ownerCompanyCode"],
						"ownerCompanyName":aData["ownerCompanyName"],
						"lcpcode":aData["lcpcode"],
						"clientCode":aData["clientCode"],
						"clientIndustryCode":aData["clientIndustryCode"]
					});
				} else {
					$.each(["clientCode","lcpcode","clientIndustryCode"], function(aIdxKey, aKey) {
						if (oCompanyInformation[iCompanyIndex][aKey].indexOf(aData[aKey]) === -1 ) {
							oCompanyInformation[iCompanyIndex][aKey] = 
								[oCompanyInformation[iCompanyIndex][aKey], aData[aKey]].join(",");
						}
					});
				}
			});

			this.ZHE_CLIENT.initialize(oClientInformation);
			this.ZHE_COMPANY.initialize(oCompanyInformation);
			this.ZHE_INDUSTRY.initialize(oIndustryInformation);
			this.ZHE_LCP.initialize(oLCPInformation);
			this.setModel(new JSONModel({
				ClientInformation: oClientInformation,
				OwnerCompanyInformation: oCompanyInformation,
				ClientIndustryInformation: oIndustryInformation,
				LCPInformation: oLCPInformation
			}), "SearchHelp");
			
			return Promise.resolve();
			
		}

	});
});
