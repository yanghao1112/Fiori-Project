jQuery.sap.declare("sap.ZG001.timesheet.input.weekly.util.DataManager");
jQuery.sap.require("sap.ca.ui.message.message");
jQuery.sap.require("sap.ui.base.EventProvider");
jQuery.sap.require("sap.m.MessageBox");
sap.ui.base.EventProvider
	.extend(
		"sap.ZG001.timesheet.input.weekly.DataManager", {
			constructor: function(aDataModel, aBundle) {
				this._nCounter = 0;
				this._busyDialog = new sap.m.BusyDialog();
				this.oDataModel = aDataModel;
				this.oBundle = aBundle;
			},
			processError: function(aError) {
				var oSelf = this;
				var sMessage = "";
				var sMessageDetails = "";
				if (aError.response) {
					var oBody = aError.response.body;
					try {
						oBody = JSON.parse(oBody);
						if (oBody.error.innererror && oBody.error.innererror.errordetails) {

							var oErrors = oBody.error.innererror.errordetails;
							for (var iCount = 0; iCount < oErrors.length; iCount++) {
								sMessageDetails += oErrors[iCount].code + " : " + oErrors[iCount].message + "\n";
							}
							sMessage = this.oBundle.getText("ZF_NUMBEROFERROR",oErrors.length);

						}
						if (sMessageDetails === "") {
							sMessage = oBody.error.code + " : " + oBody.error.message.value;
						}
					} catch (e) {
						jQuery.sap.log.warning("Could parse the response", ["parseError"], ["sap.ZG001.timesheet.input.weekly"]);
					}
				}

				if (sMessage === "") {
					sMessage = this.oBundle.getText("ZF_NUMBEROFERROR",1);
					sMessageDetails = this.oBundle.getText("ZF_MSG019");
				}
				var oMessage = {
					message: sMessage,
					details: sMessageDetails,
					type: sap.m.MessageBox.Icon.ERROR
				};

				try {
					setTimeout(function(){			
						sap.m.MessageBox.show(
							oMessage.message, {
								icon: oMessage.type,
								title: oSelf.oBundle.getText("ERROR"),
								actions: [sap.m.MessageBox.Action.OK],
								details: oMessage.details,
								onClose: function(oAction) {}
							}
						);
					},300);
				} catch (o) {
					oMessage.type = sap.ca.ui.message.Type.ERROR;

					setTimeout(function(){
						sap.ca.ui.message.showMessageBox({
							type: sap.ca.ui.message.Type.ERROR,
							message: oMessage.message,
							details: oMessage.details
						});
					},300);
				}

			},
			getWorkingHours: function(aPernr, aBegda, aEndda, fSuccess) {
				this.showBusy();
				var oSelf = this;
				this.oDataModel.read(
						"/WorkingHoursSet",
						null, ["$filter=Pernr eq '" + aPernr
						       + "' and StartDate eq datetime'" + this._formatDate(aBegda)
						       + "' and EndDate eq datetime'" + this._formatDate(aEndda)
						       + "'"],
						true,
						function(oData) {
							fSuccess(oData.results);
							oSelf.hideBusy(true);
						},
						function(oError) {
							oSelf.processError(oError);
							oSelf.hideBusy(true);
						});
			},
			getTimesheetData: function(aPernr, aBegda, aEndda, fSuccess) {

				this.showBusy();
				var oSelf = this;
				this.oDataModel.read(
						"/TimesheetDataSet",
						null, ["$filter=Pernr eq '" + aPernr
						       + "' and StartDate eq datetime'" + this._formatDate(aBegda)
						       + "' and EndDate eq datetime'" + this._formatDate(aEndda)
						       + "'"],
						true,
						function(oData) {
							fSuccess(oData.results);
							oSelf.hideBusy(true);
						},
						function(oError) {
							oSelf.processError(oError);
							oSelf.hideBusy(true);
						});

			},
			getDefaultTimesheet: function(aPernr, aBegda, aEndda, aSourceScreen, fSuccess) {
				this.showBusy();
				var oSelf = this;
				this.oDataModel.read(
						"/DefaultTimesheetSet",
						null, ["$filter=Pernr eq '" + aPernr
						       + "' and EndDate eq datetime'" + this._formatDate(aEndda)
						       + "' and StartDate eq datetime'" + this._formatDate(aBegda)
						       + "' and ProxyType eq '" + aSourceScreen
						       + "'"],
						true,
						function(oData) {
							fSuccess(oData.results);
							oSelf.hideBusy(true);
						},
						function(oError) {
							oSelf.processError(oError);
							oSelf.hideBusy(true);
						});

			},
			getWorkCalendar: function(aPernr, aBegda, aEndda, fSuccess) {
				this.showBusy();
				var oSelf = this;
				this.oDataModel.read(
						"/WorkCalendarSet",
						null, ["$filter=Pernr eq '" + aPernr
						       + "' and StartDate eq datetime'" + this._formatDate(aBegda)
						       + "' and EndDate eq datetime'" + this._formatDate(aEndda)
						       + "'"],
						true,
						function(oData) {
							fSuccess(oData.results);
							oSelf.hideBusy(true);
						},
						function(oError) {
							oSelf.processError(oError);
							oSelf.hideBusy(true);
						});

			},
			_formatDate: function(aDate) {
				var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-ddTHH:mm:ss"});
				return oDateFormat.format(aDate);
			},			
			getMonthDetailInfo: function(aPernr, aYear, aMonth, fSuccess) {
				this.showBusy();
				var oSelf = this;
				this.oDataModel
					.read(
						"/MonthDetailInfoSet(Pernr='" + aPernr
						+ "',Month='" + aMonth
						+ "',Year='" + aYear
						+ "')",
						null, [],
						true,
						function(oData) {
							fSuccess(oData);
							oSelf.hideBusy(true);
						},
						function(oError) {
							oSelf.hideBusy(true);
							oSelf.processError(oError);
						});
			},
			getMonthlyWorkingTime: function(aPernr, aYear, aMonth,aDate, fSuccess) {
				this.showBusy();
				var oSelf = this;
				this.oDataModel.read(
						"/MonthlyWorkingTimeSet",
						null, ["$filter=Pernr eq '" + aPernr
						       + "' and Year eq '" + aYear
						       + "' and Month eq '" + aMonth
						       + "' and WorkDate eq datetime'" + this._formatDate(aDate)
						       + "'"],
						true,
						function(oData) {
							fSuccess(oData);
							oSelf.hideBusy(true);
						},
						function(oError) {
							oSelf.processError(oError);
							oSelf.hideBusy(true);
						});
			},
			getRootPernr: function(fSuccess) {
				this.showBusy();
				var oSelf = this;
				this.oDataModel
					.read(
						"/RootPernrSet",
						null, [],
						true,
						function(oData) {
							fSuccess(oData.results);
							oSelf.hideBusy(true);
						},
						function(oError) {
							oSelf.hideBusy(true);
							oSelf.processError(oError);
						});
			},
			getSettingInfo: function(aPernr, aBegda, aEndda, aMode, aSourceScreen, fSuccess) {
				this.showBusy();
				var oSelf = this;
				this.oDataModel
					.read(
							"/SettingInfoSet",
							null, ["$filter=Pernr eq '" + aPernr
							       + "' and StartDate eq datetime'" + this._formatDate(aBegda)
							       + "' and EndDate eq datetime'" + this._formatDate(aEndda)
							       + "' and UIDisplayMode eq " + aMode
							       + " and ProxyType eq '" + aSourceScreen
							       + "'"],
							       true,
							       function(oData) {
							fSuccess(oData.results);
							oSelf.hideBusy(true);
						},
						function(oError) {
							oSelf.hideBusy(true);
							oSelf.processError(oError);
						});
			},
			
			getSubEntry: function(aPernr , aSuccess){
				this.showBusy();
				var oSelf = this;
				this.oDataModel.read(
						"/SubEntrySet",
						null, ["$filter=Pernr eq '" + aPernr 
						       + "'"],
						       true,
						function(aData) {
							aSuccess(aData);
							oSelf.hideBusy(true);
						},
						function(aError) {
							oSelf.processError(aError);
							oSelf.hideBusy(true);
						});
			},
			
			updateTimesheetData: function(aPernr, aWorkingHours, aTimesheetData,  aTimesheetDataOld,aFSuccess) {
				var sRootPath = "/RootPernrSet";
				this.showBusy();
				var oSelf = this;
				this.oDataModel.create(sRootPath,{
					"Pernr": aPernr,
					"WorkingHoursSet" : aWorkingHours,
					"TimesheetDataSet": aTimesheetData,
					"TimesheetDataOldSet": aTimesheetDataOld,
					},{
						success: function(){
							oSelf.hideBusy(true);
							aFSuccess();
						},
						error: function(oError){
							oSelf.hideBusy(true);
							oSelf.processError(oError);
						}
					});
			},

			getDateValidation: function(aPernr, aBegda, aEndda, fSuccess) {
				this.showBusy();
				var oSelf = this;
				this.oDataModel
					.read(
							"/DateValidationSet",
							null, ["$filter=Pernr eq '" + aPernr
							       + "' and StartDate eq datetime'" + this._formatDate(aBegda)
							       + "' and EndDate eq datetime'" + this._formatDate(aEndda)
							       + "'"],
							       true,
							       function(oData) {
							fSuccess(oData.results);
							oSelf.hideBusy(true);
						},
						function(oError) {
							oSelf.hideBusy(true);
							oSelf.processError(oError);
						});
			},
			
			getDeductionTScd: function(fSuccess) {
				this.showBusy();
				var oSelf = this;
				this.oDataModel
					.read(
							"/DeductionTScdSet",
							null, [],
							       true,
							       function(oData) {
							fSuccess(oData.results);
							oSelf.hideBusy(true);
						},
						function(oError) {
							oSelf.hideBusy(true);
							oSelf.processError(oError);
						});
			},
			
			getClientText: function(aClntCd,aSuccess) {
				var aSelf = this;
				this.oDataModel
					.read(
							"/ClientTextSet(ClntCd='" + aClntCd
							+ "')",
							null, [],
							true,
							function(aData) {
								aSuccess(aData);
								aSelf.hideBusy(true);
							},
							function(aError) {
								aSelf.hideBusy(true);
								aSelf.processError(aError);
							});
			},
			
			getTimesheetCodeText: function(aTsMnCd, aTsSubCd,aSuccess) {
				var aSelf = this;
				this.oDataModel
					.read(
							"/TimesheetCodeTextSet(TSCdOutput='" + aTsMnCd
							+ "',TsSbCd='" + aTsSubCd
							+ "')",
							null, [],
							true,
							function(aData) {
								aSuccess(aData);
								aSelf.hideBusy(true);
							},
							function(aError) {
								aSelf.hideBusy(true);
								aSelf.processError(aError);
							});
			},
			
			getEmployeeName: function(aPernr,aSuccess) {
				var aSelf = this;
				this.oDataModel
					.read(
							"/ApproverNameSet(Appointapp='" + aPernr
							+ "')",
							null, [],
							true,
							function(aData) {
								aSuccess(aData);
								aSelf.hideBusy(true);
							},
							function(aError) {
								aSelf.hideBusy(true);
								aSelf.processError(aError);
							});
			},
			
			showBusy: function() {
				this._nCounter++;
				if (this._nCounter === 1) {
					this._busyDialog.open();

				}
			},
			hideBusy: function(aForceHide) {
				if (this._nCounter === 0) {
					return;
				}
				this._nCounter = aForceHide ? 0 : Math.max(0,
					this._nCounter - 1);
				if (this._nCounter > 0) {
					return;
				}
				this._busyDialog.close();
			}

		});