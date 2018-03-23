sap.ui.define([ "sap/ui/core/mvc/Controller" ], function(Controller) {
	"use strict";

	return Controller.extend("sap.ZZZ01.YY_TS_SETTING.controller.ZZmain", {
		onInit : function(evt) {
		},
		onPressOutput: function() {
			var StringType = new sap.ui.model.odata.type.String(
					//oFormatOptions
					{
					},
					//oConstraints?
					{
						isDigitSequence: true
					});
			var data = this.getView().byId("name").getValue();
			
			try {
				//DecimalType.parseValue(data, "string");
				DecimalType.validateValue(data);
			} catch(e) {
				alert(e.message);
			}
		},
		onDecimalCheck: function(oControlEvent) {
			var DecimalType = new sap.ui.model.odata.type.Decimal(
					//oFormatOptions
					{
					},
					//oConstraints?
					{
						precision: "13",
						scale   : "3"
					});
			var oInput = oControlEvent.getSource();
			var data = oInput.getValue();
			oInput.setValueState(sap.ui.core.ValueState.None);
			try {
				//DecimalType.parseValue(data, "string");
				DecimalType.validateValue(data);
			} catch(e) {
				oInput.setValueStateText(e.message);
				oInput.setValueState(sap.ui.core.ValueState.Error);
			}
		},
		onDateCheck: function(oControlEvent) {
			var DateType = new sap.ui.model.odata.type.Date(
					//oFormatOptions
					{
						pattern:"YYYY.MM.dd"
					},
					//oConstraints?
					{
					});
			var oInput = oControlEvent.getSource();
			var data = oInput.getValue();
			oInput.setValueState(sap.ui.core.ValueState.None);
			try {
				DateType.validateValue(DateType.parseValue(data, "string"))
			} catch(e) {
				oInput.setValueStateText(e.message);
				oInput.setValueState(sap.ui.core.ValueState.Error);
			}
		},
		onIntCheck: function(oControlEvent) {
			var Int16Type = new sap.ui.model.odata.type.Int16(
					//oFormatOptions
					{
					},
					//oConstraints?
					{
					});
			var oInput = oControlEvent.getSource();
			var data = oInput.getValue();
			oInput.setValueState(sap.ui.core.ValueState.None);
			try {
				Int16Type.validateValue(Int16Type.parseValue(data, "string"))
			} catch(e) {
				oInput.setValueStateText(e.message);
				oInput.setValueState(sap.ui.core.ValueState.Error);
			}
		},
		onStringCheck: function(oControlEvent) {
			var StringType = new sap.ui.model.odata.type.String(
					//oFormatOptions
					{
					},
					//oConstraints?
					{
						maxLength: 30
					});
			var oInput = oControlEvent.getSource();
			var data = oInput.getValue();
			oInput.setValueState(sap.ui.core.ValueState.None);
			try {
				StringType.validateValue(data)
			} catch(e) {
				oInput.setValueStateText(e.message);
				oInput.setValueState(sap.ui.core.ValueState.Error);
			}
		},
		onStringToInt: function(oControlEvent) {
			var oInput = oControlEvent.getSource();
			var data = oInput.getValue();
			
				oInput.setValueStateText(parseInt(data));
				oInput.setValueState(sap.ui.core.ValueState.Error);
		},
		onStringToFloat: function(oControlEvent) {
			var oInput = oControlEvent.getSource();
			var data = oInput.getValue();
			
				oInput.setValueStateText(parseFloat(data));
				oInput.setValueState(sap.ui.core.ValueState.Error);
		},
		onBooleanCheck: function(oControlEvent) {
			var BooleanType = new sap.ui.model.odata.type.Boolean(
					//oFormatOptions
					{
					},
					//oConstraints?
					{
					});
			var oInput = oControlEvent.getSource();
			var data = oInput.getValue();
			oInput.setValueState(sap.ui.core.ValueState.None);
			try {
				BooleanType.validateValue(BooleanType.parseValue(data, "String"))
			} catch(e) {
				oInput.setValueStateText(e.message);
				oInput.setValueState(sap.ui.core.ValueState.Error);
			}
		},
		onPressDownload: function() {
			var a = 10;
			function fn(x) {
				var a = 100,
					c = 300;
				b = b + 1;
				
				function bar(x) {
					var a = 1000,
						d = 4000;
				}
				
				bar(100);
				bar(200);
			}
			fn(10);
			var b = 20;
		}
	});

});