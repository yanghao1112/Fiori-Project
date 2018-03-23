sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	'sap/viz/ui5/format/ChartFormatter',
	'sap/viz/ui5/api/env/Format',
	'sap/ZZZ01/ZCHARTTEST/js/sheet',
	'sap/ZZZ01/ZCHARTTEST/js/FileSaver'],
function(Controller, JSONModel, ChartFormatter, Format, XLSX, saveAs) {
	"use strict";
	return Controller.extend("sap.ZZZ01.ZCHARTTEST.controller.ZZmain", {

		/* =========================================================== */
		/* lifecycle methods */
		/* =========================================================== */

		/**
		 * Called when the controller is instantiated. It sets up the constant
		 * and JSON Model.
		 * 
		 * @public
		 */
		onInit : function(evt) {
			var chartFormatter = ChartFormatter.getInstance();
			chartFormatter.registerCustomFormatter(
							"formatLabeladd",
							this.formatLabel);
			var oVizFrame = this.getView()
					.byId("idVizFrame");
			var oTooltip = new sap.viz.ui5.controls.VizTooltip({});
			oTooltip.connect(oVizFrame.getVizUid());
			Format.numericFormatter(chartFormatter)

		},
		
		onCompare : function(list ,select) {
			var i = list.length;
			while (i--) {
				if(list[i].mProperties.title == select){
					return true;
				}
			}
			return false
		},
		
		onPress: function() {
			
			var oshowchart = this.getView().byId("showchart");
			
			var oCompany = this.getView().byId("Company");
			if(oCompany.getSelectedItem()){var sCompany = oCompany.getSelectedItem().getText();}
			
			var oBU = this.getView().byId("BU");
			if(oBU.getSelectedItem()){var sBU = oBU.getSelectedItem().getText();}

			var oCompareList = this.getView().byId("CompareList");
			if(oCompareList.getSelectedItems()) {var aCompareList = oCompareList.getSelectedItems();}

//			var oWeighting = this.getView().byId("Weighting");
//			var sWeighting = oWeighting.getState();
			
			// resize
			oshowchart.setSize("28%")		
			
			// Weighting true: ON
//			var oweighting = false;
			var oVizFrame = this.getView().byId("idVizFrame");
			// Create Chart type
			oVizFrame.setVizType('horizontal_stacked_combination');
			
			var FeedItem = sap.viz.ui5.controls.common.feeds.FeedItem;
			var oModelold = this.getOwnerComponent().getModel("list");
			var olddata = oModelold.getData();
			
			// New Model Data
			var oModel = new sap.ui.model.json.JSONModel();
			var aData = JSON.parse(JSON.stringify(olddata));
			
			// Data of Vizframe FlattenedDataset
			var bardata = {
				"dimensions" : [ {
					"name" : "Week",
					"value" : "{Week}"
				} ],
				"measures" : [ {
					"name" : "w1",
					"value" : "{w1}"
				}, {
					"name" : "w2",
					"value" : "{w2}"
				}, {
					"name" : "w3",
					"value" : "{w3}"
				}, {
					"name" : "w4",
					"value" : "{w4}"
				} ],
				"data" : {
					"path" : "/"
				}
			};
			
			// Feed of Vizframe
			var ofeed = [
					new FeedItem(
							{
								"uid" : "valueAxis",
								"type" : "Measure",
								"values" : [
										"w4",
										"w3",
										"w2",
										"w1" ]
							}),
					new FeedItem(
							{
								"uid" : "categoryAxis",
								"type" : "Dimension",
								"values" : [ "Week" ]
							}) ];

			// Scale
			// var oScale =
			// oVizFrame.getVizScales()

			// Properties
			var oProper = {
				"title" : {
					"text" : "Revenue Trend"
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
				"legend":{
					"mouseDownShadow":{
						"color": "#fafafa"
					}
				},
				"plotArea" : {
					"line" : {
						"visible" : false,
						"marker" : {
							"size": 14
						}
					},
					"dataShape" : {
						"primaryAxis" : [
								"bar", "bar",
								"bar", "bar" ]
					},
					"isSmoothed" : false,
					"dataLabel" : {
						"visible" : true
					},
					"dataPointStyle" : {
						"rules" : [
								{
									"dataContext" : {
										"w1" : "*"
									},
									"properties" : {
										"color" : "#5b9bd5",
									},
									"displayName" : "w1",
									"dataName" : {
										"w1" : "*"
									}
								},
								{
									"dataContext" : {
										"w2" : "*"
									},
									"properties" : {
										"color" : "#5b9bd5",
									},
									"displayName" : "w2",
									"dataName" : {
										"w2" : "*"
									}
								},
								{
									"dataContext" : {
										"w3" : "*"
									},
									"properties" : {
										"color" : "#5b9bd5",
									},
									"displayName" : "w3",
									"dataName" : {
										"w3" : "*"
									}
								},
								{
									"dataContext" : {
										"w4" : "*"
									},
									"properties" : {
										"color" : "#5b9bd5",
									},
									"displayName" : "w4",
									"dataName" : {
										"w4" : "*"
									}
								} ]
					}
				}
			}
			
			// Control of parameter
			if (sCompany||sBU) {
				
				// Company
				if (sCompany) {var aData = aData.filter(function(item){
					return item.Company == sCompany;
				})}
				
				// Bu
				if (sBU) {var aData = aData.filter(function(item){
					return item['Engagement Owner BU'] == sBU;
				})}				
				
				// Edit DataSet
				if (sCompany && sBU){
					// When Bu level add Sector as the second dimension
					var debu = {
							"name" : "Sector",
							"value" : "{Sector}"
						};
					bardata.dimensions.push(debu);
					ofeed[1].mProperties.values.unshift("Sector");
					
				} 
				else if (sCompany && !sBU){
					// When Company level add Bu as the second dimension
					var deCo = {
							"name" : "Engagement Owner BU",
							"value" : "{Engagement Owner BU}"
						};
					bardata.dimensions.push(deCo);
					ofeed[1].mProperties.values.unshift("Engagement Owner BU");
				}
			}
			
			var WeekNo = this.getOwnerComponent().getModel("Select").getData().WeekNo;
			var thisWeek = this.getOwnerComponent().getModel("Select").getData().ThisWeek;
			
			// When this month has 5 Weeks
			if(WeekNo==5) {
				var w5 = {
					"name" : "w5",
					"value" : "{w5}"
				}
				var w5pro = {
					"dataContext" : {
						"w5" : "*"
					},
					"properties" : {
						"color" : "#5b9bd5"
					},
					"displayName" : "w5",
					"dataName" : {
						"w5" : "*"
					}	
				};
				bardata.measures.push(w5);
				ofeed[0].mProperties.values.unshift("w5");
				oProper.plotArea.dataPointStyle.rules.push(w5pro);
				oProper.plotArea.dataShape.primaryAxis.push("bar");
			}
			
			// When this month has 6 Weeks
			if(WeekNo==6) {
				var w6 = {
						"name" : "w6",
						"value" : "{w6}"	
				};	
				var w6pro = {
						"dataContext" : {
							"w6" : "*"
						},
						"properties" : {
							"color" : "#5b9bd5",
						},
						"displayName" : "w6",
						"dataName" : {
							"w6" : "*"
						}	
					};
				bardata.measures.push(w6);
				ofeed[0].mProperties.values.unshift("w6");
				oProper.plotArea.dataPointStyle.rules.push(w6pro);
				oProper.plotArea.dataShape.primaryAxis.push("bar");
			}
			
			// Set forecast color
			for(var i = 0; i < oProper.plotArea.dataPointStyle.rules.length; i++)
			{
				if ( i >= thisWeek) { 
				oProper.plotArea.dataPointStyle.rules[i].properties.color = "#dae3f3"
					}
			}
			
			// Edit Compare
			if (aCompareList) { 
				// vs Simulate
				if(this.onCompare(aCompareList,"vs Simulate")){
					var sim = {
							"name" : "Simulate",
							"value" : "{Simulate}"		
					};
					var simpro = {
						"dataContext" : {
							"Simulate" : "*"
						},
						"properties" : {
							"color" : "#4472c4",
							"lineType": "dot",
							"lineColor": "#fafafa"
						},
						"displayName" : "Simulate",
						"dataName" : {
							"Simulate" : "*"
						}					
					}
					bardata.measures.push(sim);
					ofeed[0].mProperties.values.push("Simulate");
					oProper.plotArea.dataPointStyle.rules.push(simpro);
				}
				
				// vs Plan
				if(this.onCompare(aCompareList,"vs Plan")){
					var plan = {
							"name" : "Plan",
							"value" : "{Plan}"		
					};
					var planpro = {
						"dataContext" : {
							"Plan" : "*"
						},
						"properties" : {
							"color" : "#92d050",
							"lineType": "dot",
							"lineColor": "#fafafa"
						},
						"displayName" : "Plan",
						"dataName" : {
							"Plan" : "*"
						}					
					}
					bardata.measures.push(plan);
					ofeed[0].mProperties.values.push("Plan");
					oProper.plotArea.dataPointStyle.rules.push(planpro);
				}
				
				// vs Backlog
				if(this.onCompare(aCompareList,"vs Backlog")){
					var back = {
							"name" : "Backlog",
							"value" : "{Backlog}"		
					};
					var backpro = {
						"dataContext" : {
							"Backlog" : "*"
						},
						"properties" : {
							"color" : "#ff0000",
							"lineType": "dot",
							"lineColor": "#fafafa"
						},
						"displayName" : "Backlog",
						"dataName" : {
							"Backlog" : "*"
						}					
					}
					bardata.measures.push(back);
					ofeed[0].mProperties.values.push("Backlog");
					oProper.plotArea.dataPointStyle.rules.push(backpro);
				}
				
				// vs Backlog + Forecast
				if(this.onCompare(aCompareList,"vs Backlog + Forecast")){
					for (var i = 0; i< aData.length;i++)
					{
						aData[i]["Backlog + Forecast"] = parseFloat(aData[i].Backlog) + parseFloat(aData[i].Plan)							
					}
					
					var backf = {
							"name" : "Backlog + Forecast",
							"value" : "{Backlog + Forecast}"		
					};
					
					var backfpro = {
						"dataContext" : {
							"Backlog + Forecast" : "*"
						},
						"properties" : {
							"color" : "#76eec6",
							"lineType": "dot",
							"lineColor": "#fafafa"
						},
						"displayName" : "Backlog + Forecast",
						"dataName" : {
							"Backlog + Forecast" : "*"
						}					
					}
					bardata.measures.push(backf);
					ofeed[0].mProperties.values.push("Backlog + Forecast");
					oProper.plotArea.dataPointStyle.rules.push(backfpro);
				}
				
				// vs Last Month
				if(this.onCompare(aCompareList,"vs Last Month")){
					oVizFrame.setVizType('dual_horizontal_stacked_combination');
					
					var lmonth = {
							"name" : "LastMonth",
							"value" : "{LastMonth}"		
					};
					
					var axis2 = new FeedItem(
							{
								"uid" : "valueAxis2",
								"type" : "Measure",
								"values" : [ "LastMonth" ]
							});
					
					var lmonthfpro = {
						"dataContext" : {
							"LastMonth" : "*"
						},
						"properties" : {
							"color" : "#e2f0d9",
							"lineType": "dot",
							"lineColor": "#fafafa"
						},
						"displayName" : "Last Month",
						"dataName" : {
							"LastMonth" : "*"
						}					
					}
					bardata.measures.push(lmonth);
					ofeed.push(axis2);
					oProper.plotArea.dataPointStyle.rules.push(lmonthfpro);
					
				}
			};
			
			//Set Data and model
			
			oModel.setData(aData);
			oVizFrame.setModel(oModel);
			// FlattenedDataset
			var oDataSet = new sap.viz.ui5.data.FlattenedDataset(
					bardata);

			oVizFrame.vizUpdate({
				'data' : oDataSet,
				'properties' : oProper,
				// 'scales' : oScale,
				'feeds' : ofeed
			})
		},
		
		// formatLabel
		formatLabel : function(value) {
			var fixedInteger = sap.ui.core.format.NumberFormat
					.getIntegerInstance({
						style : "short",
						maxFractionDigits : 10
					});
			return fixedInteger.format(value);
		},
	});
});