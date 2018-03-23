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

			this._initData();
			this._initOption();

			this.setModel(new JSONModel({
				radar: false,
				vizframe: true
			}), 'switch');
			
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
				let oRadarOption = {
					w: '300',
					h: '310',
					factor: 0.9,
					factorLegend: 1,
					levels: 5,
					levelText: true,
					maxValue: 5,
					minValue: 0,
					axisLine: false,
					axisText: true,
					circles: true,
					radius: 5,
					backgroundColor: 'white',
					axes: [
						{axis: "L統合的スギル" },
						{axis: "L対クライアント能力"},
						{axis: "L行動特性" },  
						{axis: "L基本的な能力" }
					]
				};
				this._oRadarData = oRadarData;
				this._oRadarOption = oRadarOption;

				let oRadarDataModel = new JSONModel([]);
				oRadarDataModel.setData(oRadarData, true);
				this.setModel(oRadarDataModel, 'radarData');
				
				let oRadarOptionModel = new JSONModel({});
				oRadarOptionModel.setData(oRadarOption, true);
				this.setModel(oRadarOptionModel, 'radarOption');
		}
	});
});
