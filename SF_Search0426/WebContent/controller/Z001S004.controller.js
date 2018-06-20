sap.ui.define([
	"sap/pwaa/controller/ZZBaseController",
	"sap/ui/model/json/JSONModel"],
function(ZZBaseController, JSONModel) {
	"use strict";
	return ZZBaseController.extend("sap.pwaa.controller.Z001S004", {
		
		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		/**
		 * Called when the controller is instantiated.
		 * 1.Set DataManager to the controller
		 * @public
		 */
		onInit : function() {
			"use strict";
			let oComponent = this.getOwnerComponent();
			this._oDataManager = oComponent.oDataManager;
			this._oMessageDisplayer = oComponent.oMessageDisplayer;
			this.getOwnerComponent().getRouter().getTargets().getTarget("detail").attachDisplay(this._onDetailMatched, this);

		},
		
		/* =========================================================== */
		/* event handlers                                              */
		/* =========================================================== */

		/**
		 * Event handling for clicking 'Back' on navigator
		 * Navigate to the GroupTop Screen
		 * @public
		 */
		onNavPress : function(aControlEvent){
			"use strict";

			//Clear All talent Card
			this.getOwnerComponent().ZPO_TALENTCARD.closeAllPopup();
			this.getOwnerComponent().getRouter().getTargets().display("top");

			//Clear Group Screen Data 
			let oGroupDetailModel = this.getView().getModel("GroupDetail")
			if (oGroupDetailModel) {
				oGroupDetailModel.setData(null);
			}
			
			//Clear Selected Group Option
			let oComponent = this.getOwnerComponent();
			oComponent._oDetailOption = {
					ClientCode: "",
					MemberAssigned: "",
					AnalysisGroupUnit: "",
					LEPCode: "",
					LEMCode: "",
					ImpEventName: "",
					EngCode: "",
					GroupName: "",
					GroupCode: ""
			};
		},

		/**
		 * Event handling for clicking image
		 * Display Talent Card Popup
		 * @public
		 */
		onPressImage: function(aControlEvent){
			"use strict";
			//Get Employee Data
			let oData = aControlEvent.getSource().getBindingContext("GroupDetail").getObject();

			this.getOwnerComponent().ZPO_TALENTCARD.open(
					this._oDataManager.getTalentInfo.bind(this._oDataManager), oData["code"],  this._oMessageDisplayer.showError.bind(this._oMessageDisplayer));

		},
		
		/**
		 * Event handling for clicking Engagement Detail Button
		 * Display Engagement Detail Dialog
		 * @public
		 */
		onDisplayEngagementDetail: function(aControlEvent) {
			let oEngagementData = aControlEvent.getSource().getBindingContext("GroupDetail").getObject();
			
			this.getEngageDetailGot = this._oDataManager.getEngageDetailData(oEngagementData.EngCode);
			this.getEngageDetailGot.then(function(aData) {
				this._handleEngageData(aData);
				this.getOwnerComponent().ZPO_ENGAGE.open(aData);
			}.bind(this));
		},

		/**
		 * Event handling for clicking 'Evaluation Type' [Progress or Proposal]
		 * Change the binding according the Evaluation Type
		 * @public
		 */
		onQRMTypeChange: function(aControlEvent) {
			let sSelectedKey = aControlEvent.getSource().getSelectedItem().getKey();
			let oQRMPart = this.getView().byId("QRM");
			oQRMPart.bindElement({
				path: "/qrmData/" + sSelectedKey,
				model: "GroupDetail"
			});
		},
		
		/* =========================================================== */
		/* begin: internal methods                                     */
		/* =========================================================== */

		/**
		 * When the application navigate to group detail screen.
		 * GET the group detail data
		 * @private
		 */
		_onDetailMatched: function(oEvent) {
			
			let oComponent = this.getOwnerComponent();
			this.getGroupDetailGot = this._oDataManager.getGroupDetailData(oComponent._oDetailOption);
			this.getGroupDetailGot.then(function(aData) {

				this._handleData(aData[0]);
				let oGroupDetailModel = new JSONModel(aData[0]);
				oGroupDetailModel.setProperty("/groupSummary/groupCode",oComponent._oDetailOption["GroupCode"])
				oGroupDetailModel.setProperty("/groupSummary/groupName",oComponent._oDetailOption["GroupName"])
				
				this.getView().setModel(oGroupDetailModel,"GroupDetail");
//				
//				jQuery.sap.delayedCall(0, this, function () {
//				var oVizFrame = this.getView().byId("idVizFrame")
//				var fSetScale = function() {
//					var labelArray = this.getView().byId("idVizFrame")._vizFrame.__internal_reference_VizFrame__._viz._vizInstance.app._chartView._plotArea._valueAxis._scale._scale.domain()
//
//					oVizFrame.setVizScales([
//						{
//							"feed": "valueAxis2",
//							"max": labelArray[1],
//							"min": labelArray[0]
//						}
//					]);
//					oVizFrame.detachRenderComplete(fSetScale);
//				}
//				oVizFrame.attachEventOnce('renderComplete',fSetScale.bind(this));
//			});
			}.bind(this)).catch(function(aError) {
				this._oMessageDisplayer.showError(aError);
			}.bind(this));
		},
		
		/**
		 * Prepare Data to display on Screen
		 * @private
		 */
		_handleData: function(aData) {
			// 1. Merge GroupMembers<Array> to each 6 Members as an Object
			// --> GroupMembers : [M1,M2,M3,M4,M5,M6,M7,M8]
			// Change to MemberPages : [ { Member6: [M1,M2,M3,M4,M5,M6] }, { Member6: [M7,M8] }]
			let oMembers = aData.groupMembers;				
			let oMemberPages = [];
			let oMember6 = [];
			let iMembersLength = oMembers.length;
			
			$.each(oMembers, function(aIdxMember, aMember) {

				if (!aMember["image"]) {
					aMember["image"] = "image/default.jpeg"
				}
				if (aIdxMember % 6 === 0 && aIdxMember !== 0) {
					oMemberPages.push({"Member6":oMember6});
					oMember6 = [];
				}
				
				oMember6.push(aMember);
				
				if (aIdxMember === (iMembersLength - 1)) {
					oMemberPages.push({"Member6":oMember6});
					oMember6 = [];
				}
			});
			
			aData["MemberPages"] = oMemberPages;
			
			// 2. For LeaderSkillData: Add classText (display as legend text), add classColor (color of the group), classId(unique Id for group)
			let oLeaderSkillList = aData.leaderSkill.memberSkills;
			let oColorArray = this.getOwnerComponent().oColorArray;
			let iHasAverage = 0;
			$.each(oLeaderSkillList, function(aIdxLeaderSkill, aLeaderSkill){
				aLeaderSkill["axes"] = aLeaderSkill["skillValues"];
				if (aLeaderSkill["talentName"] === "Average") {
					iHasAverage += 1;
					aLeaderSkill["classText"] = aLeaderSkill["talentName"];
					aLeaderSkill["classColor"] = "blue";
					aLeaderSkill["classId"] = aIdxLeaderSkill;
					aLeaderSkill["className"] = "ZAverageOpacity";
					return true;
				}
				aLeaderSkill["classText"] = aLeaderSkill["talentName"];
				aLeaderSkill["classColor"] = oColorArray[(aIdxLeaderSkill - iHasAverage) % oColorArray.length];
				aLeaderSkill["classId"] = aIdxLeaderSkill;
				
			}.bind(this));
			
			// 3. For QRMData: Add classText (display as legend text), add classColor (color of the group), classId(unique Id for group)
			let oQRMProgressProject = aData["qrmData"]["progress"]["project"];
			let oQRMProgressQAP		= aData["qrmData"]["progress"]["qap"];
			let oQRMProposalProject = aData["qrmData"]["proposal"]["project"];
			let oQRMProposalQAP		= aData["qrmData"]["proposal"]["qap"];
			//let oColorArray = this.getOwnerComponent().oColorArray;
			iHasAverage = 0;
			$.each([oQRMProgressProject,oQRMProgressQAP,oQRMProposalProject,oQRMProposalQAP], function(aIdxType, aType){
				$.each(aType, function(aIdxQRM, aQRM){
				aQRM["classText"] = aQRM["text"];
				aQRM["classColor"] = oColorArray[(aIdxQRM - iHasAverage) % oColorArray.length];
				aQRM["classId"] = aIdxQRM;
				}.bind(this));
			}.bind(this))
			
			aData["qrmData"]["progress"]["Option"] = this.getView().getModel("chartConfiguration").getData()["TopQRMProgress"];
			aData["qrmData"]["proposal"]["Option"] = this.getView().getModel("chartConfiguration").getData()["TopQRMProposal"];
			
			// 3. For AssignBalance
			let oAssignmentArray = aData["assignBalance"]["assignmentDetails"];
			let oAssignmentChart = [];
			$.each(oAssignmentArray, function(aIdxAssignment, aAssignment){
				let oNormal = {
						rankType : "Normal",
						rankCode : aAssignment["rankCode"],
						rankName : aAssignment["rankName"],
						e : aAssignment["e"],
						p : aAssignment["p"],
						t : aAssignment["t"],
						r : aAssignment["r"],
						s : aAssignment["s"],
						standard : 0
				}
				let oStandard = {
						rankType : "Standard",
						rankCode : aAssignment["rankCode"],
						rankName : aAssignment["rankName"],
						e : 0,
						p : 0,
						t : 0,
						r : 0,
						s : 0,
						standard : aAssignment["standard"]
				}
				oAssignmentChart.push(oNormal);
				oAssignmentChart.push(oStandard);
			});
			aData["assignBalance"]["assignmentChart"] = oAssignmentChart;
		},
		
		/**
		 * Prepare Engagement QRM Data to display on Engagement Dialog
		 * @private
		 */
		_handleEngageData: function(aData) {
			// 3. For QRMData: Add classText (display as legend text), add classColor (color of the group), classId(unique Id for group)
			let oQRMProgressProject = aData.QRMData.Progress.Project;
			let oQRMProgressQAP		= aData.QRMData.Progress.QAP;
			let oQRMProposalProject = aData.QRMData.Proposal.Project;
			let oQRMProposalQAP		= aData.QRMData.Proposal.QAP;
			let oColorArray = this.getOwnerComponent().oColorArray;
			let iHasAverage = 0;
			$.each([oQRMProgressProject,oQRMProgressQAP,oQRMProposalProject,oQRMProposalQAP], function(aIdxType, aType){
				$.each(aType, function(aIdxQRM, aQRM){
				aQRM["classText"] = aQRM["EvaDate"];
				aQRM["classColor"] = oColorArray[(aIdxQRM - iHasAverage) % 10];
				aQRM["classId"] = aIdxQRM;
				}.bind(this));
			}.bind(this))
			
		},
		
		/**
		 * Handling for format Client Description
		 * Format: "<Group Name>(<Group Code>)"
		 * @public
		 */
		_formatGroupDescription: function(aGroupName, aGroupCode) {
			let oI18nModel = this.getOwnerComponent().getModel("i18n");
			if (aGroupName && aGroupCode) {
				return oI18nModel.getResourceBundle().getText("ZFGroupTitleFormat",[aGroupName, aGroupCode]);
			} else {
				return "";
			}
		},
	});
});
