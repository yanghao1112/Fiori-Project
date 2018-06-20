sap.ui.define([
	"sap/ui/base/Object",
	"sap/ui/model/json/JSONModel",
	"sap/viz/ui5/format/ChartFormatter",
	"sap/viz/ui5/api/env/Format",
	"sap/ui/core/Popup",
	"sap/m/MessageBox"],
function(BaseObject, JSONModel, ChartFormatter, Format, Popup, MessageBox) {
	"use strict";
	let oPopupArray = [];
	let oI18nModel = null;
	const oDual_lineOptionModel = new JSONModel(jQuery.sap.getModulePath("sap.pwaa.popup.data",
					"/dual_lineOptionPersonCard.json"));
	
	const oRadarOptionModel = new JSONModel(jQuery.sap.getModulePath("sap.pwaa.popup.data",
					"/radarOptionPersonCard.json"));
	
	var oZPO_TALENTCARD = BaseObject.extend(
	"sap.pwaa.popup.util.ZPO_TALENTCARD", {
		
		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		/**
		 * Called when the object is created.
		 * 1.Create the dialog UI
		 * 2.Set the i18n Model
		 * @public
		 */
		constructor: function() {
			/* Create Talent Card Dialog */

			var chartFormatter = ChartFormatter.getInstance();
			chartFormatter.registerCustomFormatter("formatLabelLeft",this.formatLabelLeft);
			chartFormatter.registerCustomFormatter("formatLabelRight",this.formatLabelRight);
			Format.numericFormatter(chartFormatter);
			
			/* set i18n model */
			var sRootPath = jQuery.sap.getModulePath("sap.pwaa.popup");
			oI18nModel = new sap.ui.model.resource.ResourceModel({
				bundleUrl : [ sRootPath, "i18n/i18n.properties" ].join("/")
			});
		},

		/* =========================================================== */
		/* public methods                                     */
		/* =========================================================== */
		
		/**
		 * Open the dialog
		 * If open more than 3 talent cards at same time, output error message
		 * Set Data(include chart configuration) to talent dialog
		 * Attach move talent cards event to talent card
		 * If there has already opened cards, set the new cards at the right position of them
		 * @public
		 */
		open: function(aFnGetData, aKey, aFnGetFailed) {

			if(oPopupArray.length <= 2) {

				let oPromise = aFnGetData(aKey);
				oPromise.then(function(aData) {
					if (!aData[0]["talentInfoData"]["talentImage"]) {
						aData[0]["talentInfoData"]["talentImage"] = "image/default.jpeg";
					}
					if (!aData[0]["talentInfoData"]["counselorImage"]) {
						aData[0]["talentInfoData"]["counselorImage"] = "image/default.jpeg";
					}
					this._openbyData(aData[0]);
				}.bind(this)).catch(aFnGetFailed);
			} else {

				MessageBox.error(
					"Sorry! At most, You can only open 3 Talent Cards at the same time."
				);
				return;
			}
		
		},
		_openbyData : function(aTalentInfoData) {
			"use strict";
			let oPopup = null;
			let oDialog = null;
			if(oPopupArray.length <= 2) {
				oPopup = new Popup();
				oPopupArray.push(oPopup);
				oDialog = sap.ui.xmlfragment(
							"sap.pwaa.popup.view.ZZTalentCard", this);
				oDialog.setModel(oI18nModel, "i18n");
			} else {
				MessageBox.error(
					"Sorry! At most, You can only open 3 Talent Cards at the same time."
				);
				return;
			}
			
			let aTalentInfoModel = new JSONModel(aTalentInfoData);
			let dual_lineOptionPersonCardCopy = {};
			let radarOptionPersonCardCopy = {};
			$.extend(true, dual_lineOptionPersonCardCopy, oDual_lineOptionModel.getData());
			$.extend(true, radarOptionPersonCardCopy, oRadarOptionModel.getData());
			
			aTalentInfoModel.setProperty("/dual_lineOptionPersonCard", dual_lineOptionPersonCardCopy);
			aTalentInfoModel.setProperty("/radarOptionPersonCard", radarOptionPersonCardCopy);

			oDialog.setModel(aTalentInfoModel);
			oPopup.setContent(oDialog);
			oPopup.setModal(false);
			//oPopup.setModal(true);
			oPopup.attachEventOnce("opened", function(){
				
				let oHeaderGrid = oDialog.getAggregation("items")[0].getAggregation("fixContent")[0].getAggregation("content")[1].getAggregation("content")[0];
				let oHeaderGridDom = oHeaderGrid.getDomRef();
				oHeaderGridDom.onmousedown = function(oEventElement){
					let iDistanceX = oEventElement.clientX - oPopupArray[0].getContent().getDomRef().offsetLeft;

					document.onmousemove = function(oEventElement){

						oPopupArray.forEach(function(oPopup,iPopupIndex) {
							oPopupArray[iPopupIndex].getContent().getDomRef().style.left = oEventElement.clientX - iDistanceX + iPopupIndex * 400  + 'px';
						});
						
					}.bind(this);
					document.onmouseup = function(){
						document.onmousemove = null;
						document.onmouseup = null;
					};
				};
			});
			 
			if (oPopup.isOpen()) {
				return;
			} else {
				oPopup.open(100);
			}
			
			if (oPopupArray.length > 1) {
				let iStart = 0;
				oPopupArray.forEach(function(oPopup,iPopupIndex) {
					if (iPopupIndex === 0) {
						iStart = oPopupArray[iPopupIndex].getContent().getDomRef().offsetLeft
					}
					oPopupArray[iPopupIndex].getContent().getDomRef().style.left = iStart + iPopupIndex * 400 + "px"
				});
			}
		},
		
		/**
		 * Close all Talent Cards
		 * @public
		 */
		closeAllPopup: function() {
			oPopupArray.forEach(function(oPopup,index) {
				oPopup.close();
				oPopup.destroy();
			}.bind(this));

			oPopupArray.splice(0,3);
		},
		
		/* =========================================================== */
		/* event handlers                                              */
		/* =========================================================== */

		/**
		 * Event handling for clicking 'Decline' button on Talent Card
		 * Call internal method [_closePopup]
		 * @public
		 */
		onDecline: _closePopup,
		
		onNavProfile: function() {

			let oTalentData = aControlEvent.getParameter("item").getBindingContext("").getObject();
			let sUrlTemplate = "https://performancemanager10.successfactors.com/sf/personalinfo?company=$1&selecteduser=$2";
			sUrlTemplate.replace("$1",oTalentData[talentId])
			sap.m.URLHelper.redirect(sURL, true);
		},
		/* =========================================================== */
		/* format handlers                                              */
		/* =========================================================== */

		/**
		 * Handling for format RPR Information (Line 1)
		 * Format: "<Term of Evaluation>, <Final RPR>"
		 * @public
		 */
		formatRPREvalRPR: function(aTermofEvaluationRPR, aFinalRPR) {
			return oI18nModel.getResourceBundle().getText("ZFRPREvalRPRFormat",[aTermofEvaluationRPR, aFinalRPR])
		},
		
		/**
		 * Handling for format RPR Information (Line 2)
		 * Format: "<Original Class>, <Original Rank>"
		 * @public
		 */
		formatRPRClassRank: function(aClass, aRand) {
			return oI18nModel.getResourceBundle().getText("ZFRPRClassRankFormat",[aClass, aRand])
		},
		
		/**
		 * Handling for format Certification Information (Line 1)
		 * Format: "<Certification Name>, <Certification Date>"
		 * @public
		 */
		formatCertNameDate: function(aName, aDate) {
			return oI18nModel.getResourceBundle().getText("ZFCertNameDateFormat",[aName, aDate])
		},
		
		/**
		 * Handling for format Certification Information (Line 2)
		 * Format: "Category:<Category>, Score:<Score>"
		 * @public
		 */
		formatCertCateScore: function(aCategory, aScore) {
			return oI18nModel.getResourceBundle().getText("ZFCertCateScoreFormat",[aCategory, aScore])
		},
		
		/**
		 * Handling for format Language Information (Line 1)
		 * Format: "<Language>, <Level>"
		 * @public
		 */
		formatLanguage: function(aLanguage, aLevel) {
			return oI18nModel.getResourceBundle().getText("ZFLanguageFormat",[aLanguage, aLevel])
		},
		
		/**
		 * Handling for format Language Information (Line 2)
		 * Format: "Description:<Description>"
		 * @public
		 */
		formatLanguDesc: function(aDescription) {
			return oI18nModel.getResourceBundle().getText("ZFLanguDescFormat",[aDescription])
		},
		
		/**
		 * Handling for format Assignment Preference (Line 1)
		 * Format: "Effective as of: <Entry Date>"
		 * @public
		 */
		formatAssignmentPerEntryDate: function(aEntryDate) {
			return oI18nModel.getResourceBundle().getText("ZFAssignmentPerEntryDateFormat",[aEntryDate])
		},
		
		/**
		 * Handling for format Work Limitation Information (Line 1)
		 * Format: "<Type>, <Reason>"
		 * @public
		 */
		formatWorkLimitTypeReason: function(aType, aReason) {
			return oI18nModel.getResourceBundle().getText("ZFWorkLimitTypeReasonFormat",[aType, aReason])
		},
		
		/**
		 * Handling for format Work Limitation Information (Line 2)
		 * Format: "Start Date:<Start Date>, End Date（Fixed）:<End Date（Fixed）>"
		 * @public
		 */
		formatWorkLimitStartEndDate: function(aStartDate, aEndDateFixed) {
			return oI18nModel.getResourceBundle().getText("ZFWorkLimitStartEndDateFormat",[aStartDate, aEndDateFixed])
		},
		
		/**
		 * Format Performance Motivation Chart left axis
		 * 0 -- C
		 * 1 -- B
		 * 2 -- A
		 * 3 -- L
		 * @private
		 */
		formatLabelLeft: function(value) {
			switch(value)
			{
			case 0:
				return "C";
				break;
			case 1:
				return "B";
				break;
			case 2:
				return "A";
				break;
			case 3:
				return "L";
				break;
			default:
				return value
			}
		},
		
		/**
		 * Format Performance Motivation Chart right axis
		 * 0 -- Low
		 * 1 -- Middle
		 * 2 -- High
		 * 3 -- Very High
		 * @private
		 */
		formatLabelRight: function(value) {
			switch(value)
			{
			case 0:
				return "Low";
				break;
			case 1:
				return "Middle";
				break;
			case 2:
				return "High";
				break;
			case 3:
				return "Very High";
				break;
			default:
				return value
			}
		}
		
	});
	
	/* =========================================================== */
	/* internal methods											   */
	/* =========================================================== */
	
	/**
	 * Close the popup
	 * Move the right popups of the close one to left
	 * @private
	 */
	function _closePopup(aControlEvent) {
		"use strict";
		let oIcon = aControlEvent.getSource();
		let oDialog = oIcon.getParent().getParent().getParent();
		let sDialogId = oDialog.getId();
		let iIndex;
		oPopupArray.forEach(function(oPopup,iPopupIndex) {
			if (oPopup.getContent().getId() === sDialogId) {
				iIndex = iPopupIndex;
				return;
			}
		}.bind(this));
		
		var oClose = oPopupArray.splice(iIndex,1);
		_removePopupTransition(iIndex === 0 ? oClose[0].getContent().getDomRef().offsetLeft : oPopupArray[0].getContent().getDomRef().offsetLeft);
		oClose[0].close();
		oClose[0].destroy();
	}
	
	/**
	 * Add remove popup to Transition (include the right popup move left)
	 * @private
	 */
	function _removePopupTransition(aStart) {
		"use strict";
		oPopupArray.forEach(function(oPopup,iPopupIndex) {
			_leftTransition(oPopupArray[iPopupIndex].getContent());
			oPopupArray[iPopupIndex].getContent().getDomRef().style.left = aStart + iPopupIndex * 400 + "px"
		});
	}
	
	/**
	 * Add move popup to left Transition
	 * @private
	 */
	function _leftTransition(aControl) {
		var oPopup = aControl;
		var fAfterTransition = function () {
			jQuery(this).unbind("webkitTransitionEnd transitionend");
			oPopup.removeStyleClass("ZLeftTransition");
		};
		oPopup.$().bind("webkitTransitionEnd transitionend", fAfterTransition);
		oPopup.addStyleClass("ZLeftTransition");
	}

	return oZPO_TALENTCARD;
});