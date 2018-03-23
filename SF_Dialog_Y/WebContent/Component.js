sap.ui.define([ "sap/ui/core/UIComponent", "sap/ui/model/json/JSONModel",
		"sap/ui/model/resource/ResourceModel" ], function(UIComponent,
		JSONModel, ResourceModel) {
	"use strict";
	return UIComponent.extend("sap.ui.demo.wt.Component", {
		metadata : {
			manifest : "json"
		},
		init : function() {
			// call the init function of the parent
			UIComponent.prototype.init.apply(this, arguments);

			let oCore = sap.ui.getCore();
			oCore.loadLibrary('sap/ab/thirdParty', {url:'lib/ab/thirdParty', async:true});
			oCore.loadLibrary('sap/ab/graph', {url:'lib/ab/graph', async:true});
			oCore.loadLibrary('sap/ab/projectCard', {url:'lib/ab/projectCard', async:true});
			this._initData();
			this._initOption();

			this.setModel(new JSONModel({
				radar: false,
				vizframe: true
			}), 'switch');
			
			this.getRouter().initialize();
			// oCore.loadLibrary('sap/ab/personCard', {url:'lib/ab/personCard',
			// async:true});
		},
		_initOption : function(){
//	  		let optionData = {
//				bgColor : {
//					options : [
//						{
//							key : 'transparent',
//							text : 'None'
//						},
//						{
//							key : 'white',
//							text : 'White'
//						}
//					],
//					selected : 'transparent'
//				},
//				division : {
//					options : [
//						{
//							key : 'P08',
//							text : 'FY17 P08'
//						},
//						{
//							key : 'P09',
//							text : 'FY17 P09'
//						}
//					],
//					selected : 'P08'
//				},
//				emphasis : {
//					options : [
//						{
//							key : 'none',
//							text : 'None'
//						},
//						{
//							key : 'Contract',
//							text : 'Contract'
//						}
//					],
//					selected : 'none'
//				},
//			};
//			this.setModel(new JSONModel(optionData), 'option');
		},
		_initData : function(){
			let oRadarData = 
					[
						{
							classText: "アビーム 太郎 Gr.",
							classColor: 'orange',
							axes: [
								{axis: "L統合的スギル", value: 4},
								{axis: "QRMリスク評価", value: 3},	
								{axis: "アサインバランス", value: 4},	
								{axis: "L対クライアント能力", value: 2},
								{axis: "L行動特性", value: 3},
								{axis: "L基本的な能力", value: 3}

							]
						},
						{
							classText: "アビーム 次郎 Gr.",
							classColor: 'purple',
							axes: [
								{axis: "L統合的スギル", value: 3},
								{axis: "QRMリスク評価", value: 4},	
								{axis: "アサインバランス", value: 3},
								{axis: "L対クライアント能力", value: 2},
								{axis: "L行動特性", value: 2},
								{axis: "L基本的な能力", value: 4}

							]
						},
						{
							classText: "AB Jeff Gr.",
							classColor: 'pink',
							axes: [
								{axis: "L統合的スギル", value: 2},
								{axis: "QRMリスク評価", value: 4},	
								{axis: "アサインバランス", value: 4},
								{axis: "L対クライアント能力", value: 4},
								{axis: "L行動特性", value: 2},
								{axis: "L基本的な能力", value: 1}

							]
						},
						{
							classText: "AB Mike Gr.",
							classColor: 'red',
							axes: [
								{axis: "L統合的スギル", value: 2},
								{axis: "QRMリスク評価", value: 3},	
								{axis: "アサインバランス", value: 4},
								{axis: "L対クライアント能力", value: 3},
								{axis: "L行動特性", value: 2},
								{axis: "L基本的な能力", value: 4}

							]
						}
					]
				;
				let oRadarOption = {
					w: '550',
					h: '310',
					factor: 0.8,
					factorLegend: 0.9,
					levels: 5,
					levelText: true,
					maxValue: 5,
					minValue: 0,
					axisLine: false,
					axisText: true,
					circles: true,
					radius: 5,
					backgroundColor: 'transparent',
					lengendOptionCount: 4,
					axes: [
						{axis: "L統合的スギル" },
						{axis: "QRMリスク評価"},	
						{axis: "アサインバランス"},
						{axis: "L対クライアント能力"},
						{axis: "L行動特性" },  
						{axis: "L基本的な能力" }
					]
				};
				
				let oRadarData2 = 
					[{
						classText: "Taro",
						classColor: "orange",
						axes: [
							{axis: "L統合的スギル", value: 4},
							{axis: "L対クライアント能力", value: 2},
							{axis: "L行動特性", value: 3},
							{axis: "L基本的な能力", value: 3}

						]
					},
					{
						classText: "Jiro",
						classColor: "Purple",
						axes: [
							{axis: "L統合的スギル", value: 3},
							{axis: "L対クライアント能力", value: 2},
							{axis: "L行動特性", value: 2},
							{axis: "L基本的な能力", value: 4}

						]
					},
					{
						classText: "Jeff",
						classColor: "Pink",
						axes: [
							{axis: "L統合的スギル", value: 2},
							{axis: "L対クライアント能力", value: 4},
							{axis: "L行動特性", value: 2},
							{axis: "L基本的な能力", value: 1}

						]
					},{
						classText: "Mike",
						classColor: "Red",
						axes: [
							{axis: "L統合的スギル", value: 2},
							{axis: "L対クライアント能力", value: 3},
							{axis: "L行動特性", value: 2},
							{axis: "L基本的な能力", value: 4}

						]
					}
					];
				
				let oRadarOption2 = {
						w: '500',
						h: '350',
						factor: 0.7,
						factorLegend: 0.8,
						levels: 5,
						levelText: true,
						maxValue: 5,
						minValue: 0,
						axisLine: false,
						axisText: true,
						circles: true,
						radius: 5,
						backgroundColor: 'transparent',
						lengendOptionCount: 4,
						axes: [
							{axis: "L統合的スギル" },
							{axis: "L対クライアント能力"},
							{axis: "L行動特性" },  
							{axis: "L基本的な能力" }							
						]
					};
				
				let oRadarData3 = 
					[{
						classText: "QRM プロジェクトリスク",
						classColor: "rgb(0, 80, 180)",
						axes: [
							{axis: "顧客", value: 1},
							{axis: "契約/請求", value: 1 },
							{axis: "環境", value: 1 },
							{axis: "要員", value: 1},
							{axis: "工数見積/予算", value: 1},
							{axis: "スケジュール", value: 1},
							{axis: "品質要求", value: 1},
							{axis: "スコープ", value: 2}

						]
					}];
				
				let oRadarOption3 = {
						w: '250',
						h: '250',
						factor: 0.6,
						factorLegend: 0.8,
						levels: 5,
						levelText: true,
						maxValue: 5,
						minValue: 0,
						axisLine: true,
						axisText: true,
						circles: true,
						radius: 3,
						backgroundColor: 'transparent',
						lengendOptionCount: 1,
						axes: [
							{axis: "顧客" },
							{axis: "契約/請求" },
							{axis: "環境" },
							{axis: "要員"},
							{axis: "工数見積/予算" },  
							{axis: "スケジュール" },  
							{axis: "品質要求" },  
							{axis: "スコープ" }							
						]
					};
				
				let oPieChartData = {
						"milk": [
							{
								"Store Name": "24-Seven",
								"Revenue": 428214.13,
								"Cost": 94383.52,
								"Consumption": 76855.15368
							},
							{
								"Store Name": "A&A",
								"Revenue": 1722148.36,
								"Cost": 274735.17,
								"Consumption": 310292.22
							},
							{
								"Store Name": "Alexei",
								"Revenue": 1331176.706884,
								"Cost": 233160.58,
								"Consumption": 143432.18
							},
							{
								"Store Name": "BC Market",
								"Revenue": 1878466.82,
								"Cost": 235072.19,
								"Consumption": 487910.26
							}
						]
				};
				let oRadarData4 = 
					[
						{
							classText: "Project1",
							classColor: 'rgb(0, 80, 180)',
							axes: [
								{axis: "L統合的スギル", value: 3},
								{axis: "L対クライアント能力", value: 4},
								{axis: "L行動特性", value: 2},
								{axis: "L基本的な能力", value: 4}

							]
						},

						{
							classText: "Project2",
							classColor: 'rgb(100, 60, 160)',
							axes: [
								{axis: "L統合的スギル", value: 4},
								{axis: "L対クライアント能力", value: 3},
								{axis: "L行動特性", value: 2},
								{axis: "L基本的な能力", value: 1}

							]
						}
					]
				;
				let oRadarOption4 = {
					w: '300',
					h: '210',
					factor: 0.7,
					factorLegend: 0.9,
					levels: 5,
					levelText: true,
					maxValue: 5,
					minValue: 0,
					axisLine: false,
					axisText: true,
					circles: true,
					radius: 5,
					backgroundColor: 'white',
					lengendOptionCount: 2,
					axes: [
						{axis: "L統合的スギル" },
						{axis: "L対クライアント能力"},
						{axis: "L行動特性" },  
						{axis: "L基本的な能力" }
					]
				};
				
				
				this._oRadarData = oRadarData;
				this._oRadarOption = oRadarOption;
				this._oRadarData2 = oRadarData2;
				this._oRadarOption2 = oRadarOption2;
				this._oRadarData3 = oRadarData3;
				this._oRadarOption3 = oRadarOption3;
				this._oPieChartData = oPieChartData;
				this._oRadarData4 = oRadarData4;
				this._oRadarOption4 = oRadarOption4;

				let oRadarDataModel = new JSONModel([]);
				oRadarDataModel.setData(oRadarData, true);
				this.setModel(oRadarDataModel, 'radarData');
				
				let oRadarOptionModel = new JSONModel({});
				oRadarOptionModel.setData(oRadarOption, true);
				this.setModel(oRadarOptionModel, 'radarOption');
				
				let oRadarDataModel2 = new JSONModel([]);
				oRadarDataModel2.setData(oRadarData2, true);
				this.setModel(oRadarDataModel2, 'radarData2');
				
				let oRadarOptionModel2 = new JSONModel({});
				oRadarOptionModel2.setData(oRadarOption2, true);
				this.setModel(oRadarOptionModel2, 'radarOption2');
				
				let oRadarDataModel3 = new JSONModel([]);
				oRadarDataModel3.setData(oRadarData3, true);
				this.setModel(oRadarDataModel3, 'radarData3');
				
				let oRadarOptionModel3 = new JSONModel({});
				oRadarOptionModel3.setData(oRadarOption3, true);
				this.setModel(oRadarOptionModel3, 'radarOption3');
				
				let oPieChartDataModel = new JSONModel({});
				oPieChartDataModel.setData(oPieChartData, true);
				this.setModel(oPieChartDataModel, 'pieChartData');
				
				let oRadarDataModel4 = new JSONModel([]);
				oRadarDataModel4.setData(oRadarData4, true);
				this.setModel(oRadarDataModel4, 'radarData4');
				
				let oRadarOptionModel4 = new JSONModel({});
				oRadarOptionModel4.setData(oRadarOption4, true);
				this.setModel(oRadarOptionModel4, 'radarOption4');
				
		}
	});
});
