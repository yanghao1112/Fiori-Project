sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	'sap/viz/ui5/format/ChartFormatter',
	'sap/viz/ui5/api/env/Format',
	'zco103/js/sheet',
	'zco103/js/FileSaver'],
function(Controller, JSONModel, ChartFormatter, Format, XLSX, saveAs) {
	"use strict";
	return Controller.extend("zco103.controller.ZZmain", {

		/* =========================================================== */
		/* lifecycle methods */
		/* =========================================================== */

		/**
		 * Called when the controller is instantiated. It sets up the constant
		 * and JSON Model.
		 * @public
		 */
		onInit : function(evt) {
			// Company
			var chartFormatter = ChartFormatter.getInstance();
			chartFormatter.registerCustomFormatter("formatLabeladd",this.formatLabel);
			var oVizFrame = this.getView().byId("idVizFrame");
			var oTooltip = new sap.viz.ui5.controls.VizTooltip({});
			oTooltip.connect(oVizFrame.getVizUid());
			Format.numericFormatter(chartFormatter);

			this.oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();

			this.bInitial = true;
			this.bRangeSliderAction = false;
			
			oVizFrame.attachRenderComplete(function() {

				if (this.bInitial) {
					this.bInitial = false;
					return;
				}
				var labelArray = this.getView().byId("idVizFrame")._vizFrame.__internal_reference_VizFrame__._viz._vizInstance.app._chartView._plotArea._valueAxis._scale._scale.domain()
				
				if (!this.bRangeSliderAction) {

					var oRange = this.getView().byId("rangeSlider");

		            oRange.setMax(labelArray[1]);
		            oRange.setMin(labelArray[0]);
		            oRange.setRange(labelArray);
		            
		            var cWidthUnit = 8;
		            var iTextWidth = ((labelArray[1].toString()).length
		                    + oRange.getDecimalPrecisionOfNumber(oRange.getStep()) + 1) * cWidthUnit + cWidthUnit;
		            
		            //Change Tooltip Width
		            if (oRange.getInputsAsTooltips()) {
		
		                if (oRange._mHandleTooltip.start.tooltip) {
		                	oRange._mHandleTooltip.start.tooltip.setWidth(iTextWidth + "px");
		                }
		
		                if (oRange._mHandleTooltip.end.tooltip) {
		                	oRange._mHandleTooltip.end.tooltip.setWidth(iTextWidth + "px");
		                }
		            }
	            
					this._setRangeSliderTitle(labelArray);
				}
			}.bind(this));


		},
		onLiveChange: function() {

			var oRange = this.getView().byId("rangeSlider").getRange();

			var oRangeArray = oRange[0] < oRange[1] ? oRange : [oRange[1],oRange[0]];
			var oScale = [ {
				'feed' : 'valueAxis',
				'max' : oRangeArray[1],
				'min' : oRangeArray[0]
			}]
			this.bRangeSliderAction = true;
			this.getView().byId("idVizFrame")._vizFrame.__internal_reference_VizFrame__._viz._vizInstance.app._rootElement.transition();
			this.getView().byId("idVizFrame").setVizScales(oScale);
			
			this._setRangeSliderTitle(oRangeArray);
			
		},
		_setRangeSliderTitle: function(aRange) {
			var oFormattedText = this.getView().byId("scaleTitle");
			
			var oRangeArray = aRange[0] < aRange[1] ? aRange : [aRange[1],aRange[0]];
			var sHtmlText = this.oBundle.getText("ZFRangeSliderTitle",[this.formatLabel(oRangeArray[0]),this.formatLabel(oRangeArray[1])]);
			oFormattedText.setHtmlText(sHtmlText);
		},
		onRemove : function(arr, val) {
			for (var i = 0; i < arr.length; i++) {
				delete arr[i].ID;
			}
		},

		// Set Default Selected
		onupdateFinished: function(evt){
			var oYearList = this.getView().byId("YearList");
			var oPatternList = this.getView().byId("PatternList");
			var oChangeList = this.getView().byId("ChangeList");
			var oCompareList = this.getView().byId("CompareList");
			var oCurrency = this.getView().byId("CurrencyList");
			var oWeighting = this.getView().byId("WeightingList");
			
			if(!oYearList.getSelectedItem()){
				oYearList.setSelectedItem((oYearList.getItems()[1]));
			}
			
			if(!oPatternList.getSelectedItem()){
				oPatternList.setSelectedItem((oPatternList.getItems()[0]));
			}
			
			if(!oChangeList.getSelectedItem()){
				oChangeList.setSelectedItem((oChangeList.getItems()[0]));
			}
			
			if(!oCompareList.getSelectedItem()){
				oCompareList.setSelectedItem((oCompareList.getItems()[0]));
			}
			
			if(!oCurrency.getSelectedItem()){
				oCurrency.setSelectedItem((oCurrency.getItems()[0]));
			}
			
			if(!oWeighting.getSelectedItem()){
				oWeighting.setSelectedItem((oWeighting.getItems()[1]));
			}
		},
		
		// When Press Go
		onPress: function() {
			// Get Parameter

			this.bRangeSliderAction = false;
			
			var oCompany = this.getView().byId("Company");
			if(oCompany.getSelectedItem()) {var sCompany = oCompany.getSelectedItem().getText();}
			
			var oBU = this.getView().byId("BU");
			if(oBU.getSelectedItem()) {var sBU = oBU.getSelectedItem().getText();}
			
			var oSector = this.getView().byId("Sector");
			if(oSector.getSelectedItem()) {var sSector = oSector.getSelectedItem().getText();}
			
			var oYearList = this.getView().byId("YearList");
			if(oYearList.getSelectedItem()) {var sYearList = oYearList.getSelectedItem().getTitle();}

			var oPatternList = this.getView().byId("PatternList");
			if(oPatternList.getSelectedItem()){ var sPatternList = oPatternList.getSelectedItem().getTitle();}
			
			var oChangeList = this.getView().byId("ChangeList");
			if(oChangeList.getSelectedItem()){ var sChangeList = oChangeList.getSelectedItem().getTitle();}
			
			var oCurrency = this.getView().byId("CurrencyList");
			if(oCurrency.getSelectedItem()){ var sCurrency = oCurrency.getSelectedItem().getTitle();}
			
			var oCompareList = this.getView().byId("CompareList");
			var sCompareListlength = oCompareList.getSelectedItems().length;
			
			if (sCompareListlength != 0) {
				if (sCompareListlength == 2) {
					var sCompareList = 2;
				} else if (oCompareList.getSelectedItem().getTitle() == "vs Plan") {
					var sCompareList = 0;
				} else {
					var sCompareList = 1;
				}
				;
			}

			var oWeighting = this.getView().byId("WeightingList");
			if(oWeighting.getSelectedItem()) {var sWeighting = oWeighting.getSelectedItem().getTitle();}
	
//			// Get From to 
//			var oMin = this.getView().byId("inputf").getValue();
//			var oMax = this.getView().byId("inputt").getValue();
//			
//			// Set Scale
//			if (oMin && !oMax) {oMax = "*"};
//			var oScale = [ {
//				'feed' : 'valueAxis',
//				'max' : oMax,
//				'min' : oMin
//			}, {
//				'feed' : 'valueAxis2',
//				'max' : oMax,
//				'min' : oMin
//			} ]
			
			// Weighting true: ON
			var oweighting = false;
			var oVizFrame = this.getView().byId("idVizFrame");
			var FeedItem = sap.viz.ui5.controls.common.feeds.FeedItem;
			var oModelold = this.getOwnerComponent().getModel("list");
			var olddata = oModelold.getData().Data;
			var aData = JSON.parse(JSON.stringify(olddata));

			this.onRemove(aData, "ID");

			// Data after change currency
			if(sCurrency=="Local"){
				//suppose the exchange rate global:local = 1: 7.89
				var i = aData.length;
				while(i--) {
					aData[i].Actual = aData[i].Actual*7.89;
					aData[i].Backlog = aData[i].Backlog*7.89;
					aData[i]['Forecast 20%'] = aData[i]['Forecast 20%']*7.89;
					aData[i]['Forecast 40%'] = aData[i]['Forecast 40%']*7.89;
					aData[i]['Forecast 60%'] = aData[i]['Forecast 60%']*7.89;
					aData[i]['Forecast 80%'] = aData[i]['Forecast 80%']*7.89;
					aData[i]['Forecast 100%'] = aData[i]['Forecast 100%']*7.89;
					aData[i]['Plan'] = aData[i]['Plan']*7.89;
					aData[i]['Last Year'] = aData[i]['Last Year']*7.89;
				}
			}
			
			// filter
			if (sCompany||sBU||sSector||sYearList||sWeighting||sPatternList||sChangeList) {
				
				// New Model Data
				var oModel = new sap.ui.model.json.JSONModel();
				var oModelData = {"Select" :{},"Data" :{}};				
				oModelData.Select = oModelold.Select;
				
				// Company
				if (sCompany) {var aData = aData.filter(function(item){
					return item.Company == sCompany;
				})}
				
				// Bu
				if (sBU && sBU != "*") {var aData = aData.filter(function(item){
					return item['Engagement Owner BU'] == sBU;
				})}				
				
				//Sector(Disabled for no Data)
				if (sSector && sSector != "*") {var aData = aData.filter(function(item){
					return item.Sector == sSector;
				})}				
				
				// FY
				if (sYearList) {var aData = aData.filter(function(item){
					return item.FY == sYearList;
				})}	
				
				// Change Data
				if (sChangeList) {var aData = aData.filter(function(item){
					return item.Numbers == sChangeList;
				})}	
				
				// Periodical||Accumulated
				if (sPatternList=='Accumulated') {
					for(var i = 0; i < aData.length; i++){
						if(i > 0){
						aData[i].Actual = aData[i].Actual + aData[i-1].Actual;
						aData[i].Backlog = aData[i].Backlog + aData[i-1].Backlog;
						aData[i]['Forecast 20%'] = aData[i]['Forecast 20%'] + aData[i-1]['Forecast 20%'];
						aData[i]['Forecast 40%'] = aData[i]['Forecast 40%'] + aData[i-1]['Forecast 40%'];
						aData[i]['Forecast 60%'] = aData[i]['Forecast 60%'] + aData[i-1]['Forecast 60%'];
						aData[i]['Forecast 80%'] = aData[i]['Forecast 80%'] + aData[i-1]['Forecast 80%'];
						aData[i]['Forecast 100%'] = aData[i]['Forecast 100%'] + aData[i-1]['Forecast 100%'];
						aData[i]['Plan'] = aData[i]['Plan'] + aData[i-1]['Plan'];
						aData[i]['Last Year'] = aData[i]['Last Year'] + aData[i-1]['Last Year'];
						}
					}
				}
				
				// Weighting
				if (sWeighting=="On") {
					for(var i = 0; i < aData.length; i++){
						aData[i]['Forecast 20%'] = aData[i]['Forecast 20%']*0.2;
						aData[i]['Forecast 40%'] = aData[i]['Forecast 40%']*0.4;
						aData[i]['Forecast 60%'] = aData[i]['Forecast 60%']*0.6;
						aData[i]['Forecast 80%'] = aData[i]['Forecast 80%']*0.8;
					}
				}
				
				oModelData.Data = aData;
				oModel.setData(oModelData);
				oVizFrame.setModel(oModel);

	            
			}
				
			// Data of Vizframe FlattenedDataset
			var bardata = {
				"dimensions" : [ {
					"name" : "Financial Month",
					"value" : "{Financial Month}"
				} ],
				"measures" : [ {
					"name" : "Actual",
					"value" : "{Actual}"
				}, {
					"name" : "Backlog",
					"value" : "{Backlog}"
				}, {
					"name" : "Forecast 20%",
					"value" : "{Forecast 20%}"
				}, {
					"name" : "Forecast 40%",
					"value" : "{Forecast 40%}"
				}, {
					"name" : "Forecast 60%",
					"value" : "{Forecast 60%}"
				}, {
					"name" : "Forecast 80%",
					"value" : "{Forecast 80%}"
				}, {
					"name" : "Forecast 100%",
					"value" : "{Forecast 100%}"
				} ],
				"data" : {
					"path" : "/Data"
				}
			};

			// Feed of Vizframe
			var ofeed = [
					new FeedItem(
							{
								"uid" : "valueAxis",
								"type" : "Measure",
								"values" : [
										"Forecast 100%",
										"Forecast 80%",
										"Forecast 60%",
										"Forecast 40%",
										"Forecast 20%",
										"Backlog",
										"Actual" ]
							}),
					new FeedItem(
							{
								"uid" : "categoryAxis",
								"type" : "Dimension",
								"values" : [ "Financial Month" ]
							}) ];

			// Properties
			var oProper = {
				"title" : {
					"visible" : false
				},
				"categoryAxis" : {
					"title" : {
						"visible" : false
					}
				},
				"valueAxis" : {
					"label" : {
						"formatString" : "formatLabeladd"
					},
					"title" : {
						"visible" : false
					}
				},
				"plotArea" : {
					"line" : {
						"width" : 4,
						"marker" : {
							"visible" : false
						}
					},
					"dataShape" : {
						"primaryAxis" : [
								"bar", "bar",
								"bar", "bar",
								"bar", "bar",
								"bar" ]
					},
					"isSmoothed" : false,
					"dataLabel" : {
						"visible" : false
					},
					"dataPointStyle" : {
						"rules" : [
								{
									"dataContext" : {
										"Actual" : "*"
									},
									"properties" : {
										"color" : "#FFC000",
									},
									"displayName" : "Actual",
									"dataName" : {
										"Actual" : "Actual"
									}
								},
								{
									"dataContext" : {
										"Backlog" : "*"
									},
									"properties" : {
										"color" : "#2f5597",
									},
									"displayName" : "Backlog",
									"dataName" : {
										"Backlog" : "Backlog"
									}
								},
								{
									"dataContext" : {
										"Forecast 20%" : "*"
									},
									"properties" : {
										"color" : "#8faadc",
									},
									"displayName" : "Forecast 20%",
									"dataName" : {
										"Forecast 20%" : "Forecast 20%"
									}
								},
								{
									"dataContext" : {
										"Forecast 40%" : "*"
									},
									"properties" : {
										"color" : "#5b9bd5",
									},
									"displayName" : "Forecast 40%",
									"dataName" : {
										"Forecast 40%" : "Forecast 40%"
									}
								},
								{
									"dataContext" : {
										"Forecast 60%" : "*"
									},
									"properties" : {
										"color" : "#dae3f3",
									},
									"displayName" : "Forecast 60%",
									"dataName" : {
										"Forecast 60%" : "Forecast 60%"
									}
								},
								{
									"dataContext" : {
										"Forecast 80%" : "*"
									},
									"properties" : {
										"color" : "#03A9F4",
									},
									"displayName" : "Forecast 80%",
									"dataName" : {
										"Forecast 80%" : "Forecast 80%"
									}
								},
								{
									"dataContext" : {
										"Forecast 100%" : "*"
									},
									"properties" : {
										"color" : "#03A9F4",
									},
									"displayName" : "Forecast 100%",
									"dataName" : {
										"Forecast 100%" : "Forecast 100%"
									}
								} ]
					}
				}
			}

			// Edit No. of Line
			if (sCompareList == 0) { // When Plan
				var plan = {
					"name" : "Plan",
					"value" : "{Plan}"
				};
				var planpro = {
					"dataContext" : {
						"Plan" : "*"
					},
					"properties" : {
//						color : "#92d050",
						lineColor : "#92d050",
						lineType : "solid"
					},
					"displayName" : "Plan",
					"dataName" : {
						"Plan" : "Plan"
					}
				};
				oProper.plotArea.dataPointStyle.rules
						.push(planpro);
				bardata.measures.push(plan);
				ofeed[0].mProperties.values
						.push("Plan");

			} else if (sCompareList == 1) { // When
				// Last
				// Year
				var LastYear = {
					"name" : "Last Year",
					"value" : "{Last Year}"
				}
				var LastYearpro = {
					"dataContext" : {
						"Last Year" : "*"
					},
					"properties" : {
//						"color" : "#76eec6",
						lineColor : "#76eec6",
						lineType : "solid"
					},
					"displayName" : "Last Year",
					"dataName" : {
						"Last Year" : "Last Year"
					}

				};
				oProper.plotArea.dataPointStyle.rules
						.push(LastYearpro);
				bardata.measures.push(LastYear);
				ofeed[0].mProperties.values
						.push("Last Year")

			} else if (sCompareList == 2) { // When Both
				var plan = {
					"name" : "Plan",
					"value" : "{Plan}"
				};
				var LastYear = {
					"name" : "Last Year",
					"value" : "{Last Year}"
				};
				var planpro = {
					"dataContext" : {
						"Plan" : "*"
					},
					"properties" : {
						// "color" : "#92d050",
						lineColor : "#92d050",
						lineType : "solid"
					},
					"displayName" : "Plan",
					"dataName" : {
						"Plan" : "Plan"
					}
				};
				var LastYearpro = {
					"dataContext" : {
						"Last Year" : "*"
					},
					"properties" : {
						// "color" : "#76eec6",
						lineColor : "#76eec6",
						lineType : "solid"
					},
					"displayName" : "Last Year",
					"dataName" : {
						"Last Year" : "Last Year"
					}

				};
				oProper.plotArea.dataPointStyle.rules
						.push(planpro,
								LastYearpro);
				bardata.measures.push(plan,
						LastYear);
				ofeed[0].mProperties.values
						.push("Plan",
								"Last Year")
			}
			;

			// FlattenedDataset
			var oDataSet = new sap.viz.ui5.data.FlattenedDataset(
					bardata);

			// Create Chart
			oVizFrame.setVizType('stacked_combination');
			oVizFrame.setVizScales([{
				'feed' : 'valueAxis',
				'max' : "",
				'min' : ""
			}]);
			oVizFrame.vizUpdate({
				'data' : oDataSet,
				'properties' : oProper,
				'feeds' : ofeed
			})
		},
		
		// Download
		onDownload : function(evt) {
			
			var oVizFrame = this.getView().byId("idVizFrame");
			var oModel = oVizFrame.getModel();
			var data = oModel.getData();
	
			var ws = XLSX.utils.json_to_sheet (data.Data);

			var rows = data.Data.length;
			var columns = Object.getOwnPropertyNames(data.Data[0]).length;
			
			for (var iRows = 0; iRows < rows; iRows++) {
				for (var iColumns = 0; iColumns < columns; iColumns++) {
					var oCell = ws[XLSX.utils.encode_cell({
										c : iColumns,
										r : iRows
								})];
					oCell.s = {
                    }
					if ( iRows === 0) {
						if (typeof oCell.s.border === 'undefined') {
							oCell.s.border = {
									right : { style: "thin", color: { indexed: "64" } },
									left : { style: "thin", color: { indexed: "64" } },
		                            top: { style: "thin", color: { indexed: "64" } },
		                            bottom: { style: "thin", color: { indexed: "64" } }
							};

						};

						oCell.s.fill = {
	                            patternType: "solid",
	                            fgColor: { rgb: "FFC0C0C0"}
						}
//						
//						oCell.s.font = {
//								name : 'Calibri',
//								sz : 12,
//								bold : true,
//								color: { rgb: 'e4140cFF' }
//							}
					}
				}
			}
			
			
			var wb = {
					SheetNames : [ "ABJP"],
					Sheets : {
						ABJP : ws
					}
				};
				var wbout = XLSX.write(wb, {
					bookType: "xlsx",
					type : 'binary',
					bookSST : true
				});

				var fname = 'Revenue Trend(Monthly).xlsx';
				try {
					saveAs(new Blob([ this.s2ab(wbout) ], {
						type : "application/octet-stream"
					}), fname);
				} catch (e) {
					if (typeof console != 'undefined')
						console.log(e, wbout);
				}
		},
		s2ab : function(s) {
			if (typeof ArrayBuffer !== 'undefined') {
				var buf = new ArrayBuffer(s.length);
				var view = new Uint8Array(buf);
				for (var i = 0; i != s.length; ++i)
					view[i] = s.charCodeAt(i) & 0xFF;
				return buf;
			} else {
				var buf = new Array(s.length);
				for (var i = 0; i != s.length; ++i)
					buf[i] = s.charCodeAt(i) & 0xFF;
				return buf;
			}
		},
		
		// formatLabel
		formatLabel : function(value) {
			var fixedInteger = sap.ui.core.format.NumberFormat
					.getCurrencyInstance({
						style : "short",
						maxFractionDigits : 10
					});
			return fixedInteger.format(value);
		},
		
        onResize: function() {
            var oVBox = this.getView().byId("ChartVBox");
            var iHeight = oVBox.getDomRef().offsetHeight;

            this.getView().byId("idVizFrame").setHeight(iHeight + "px")
        },

	});
});