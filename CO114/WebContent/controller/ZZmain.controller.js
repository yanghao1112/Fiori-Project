sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "jquery.sap.global",
  "sap/ui/table/Column",
  "sap/m/Label",
  "sap/m/Text",
  'sap/ui/model/json/JSONModel',
  'sap/ZG001/Sample/CO114/js/sheet',
  'sap/ZG001/Sample/CO114/js/FileSaver',
  "sap/ui/core/format/NumberFormat",
  "sap/viz/ui5/controls/common/feeds/FeedItem",
  "sap/viz/ui5/format/ChartFormatter",
  'sap/viz/ui5/api/env/Format'
], function(Controller, jQuery, Column, Label, Text, JSONModel, XLSX, saveAs, NumberFormat, FeedItem, ChartFormatter, Format) {
  "use strict";
  const COL_TEXT = 'COL_TEXT';
  const COL_BINDING_FIELD = 'COL_BINDING_FIELD';
  const COL_TEXTCOL = 'COL_TEXTCOL';
  const COL_SPAN = 'COL_SPAN';
  const COL_TEXT_DELIMITER = '__';
  let _oI18nBundle = undefined;

  function columnFactory(sId, oContext){
    let sColHeaderText = oContext.getProperty(COL_TEXT);
    let iLabelIdx = 0;
    let sMonth = this.currentP;
    return new Column(sId, {
      minWidth: sColHeaderText === "" ? 240 : 0,
      headerSpan: oContext.getProperty(COL_SPAN),
      multiLabels: sColHeaderText.split(COL_TEXT_DELIMITER).map(function(headerText){
        iLabelIdx = iLabelIdx + 1;
        return new Label(
          sId + '_col_lbl_' + iLabelIdx, {
              text: headerText
            }).addStyleClass(
              /* TODO: current Week logic should be determined otherside */
              headerText <= sMonth && headerText && headerText >= "01" && headerText <= "12" ? 'col_header_current_week_f': ''
          );
      }),
      template: new Label(sId + '_text_0', {
        // text: '{Rows>' + oContext.getProperty('value') + '}'
      }).bindProperty("text", {
        parts: [ 
          {path: "table>" + oContext.getProperty(COL_BINDING_FIELD) + '/value'},
          {path: "table>" + oContext.getProperty(COL_BINDING_FIELD) + '/fldName'},
          {path: "table>" + oContext.getProperty(COL_BINDING_FIELD) + '/record'}
        ],
        formatter: formatCell(sColHeaderText, sMonth)
      })
    })
  }

  function formatColHeaderText(record){
    return [
      record.zyear + " /  Currency:(" + record.zstwae + ")",
      record.zmonth
    ].join(COL_TEXT_DELIMITER);
  }
  function convertData(oData){
    /* generate cols */

        let oNumberFormat = NumberFormat.getFloatInstance();
        let oPercentFormat = NumberFormat.getPercentInstance();
    let oReverseData = oData.slice().reverse();
    let iSpan1 = 1, iSpan2 = 1, iSpan3 = 1;
    let iTotal = oData.length - 1;
    let oLastRecord = undefined;
    let cols = oReverseData.map(function(record, idx){
      if (oLastRecord && oLastRecord.zyear === record.zyear){
        iSpan1 = iSpan1 + 1;
        if (oLastRecord.zmonth === record.zmonth){
          iSpan2 = iSpan2 + 1;
//          if (oLastRecord.FLD07 === record.FLD07){
//            iSpan3 = iSpan3 + 1;
//          }else{
//            iSpan3 = 1;
//          }
        }else{
          iSpan2 = 1;
          iSpan3 = 1;
        }
      }else{
        iSpan1 = 1;
        iSpan2 = 1;
        iSpan3 = 1;
      }
      oLastRecord = record;
      return {
        COL_TEXT: formatColHeaderText(record),
        COL_BINDING_FIELD: COL_BINDING_FIELD + COL_TEXT_DELIMITER + (iTotal - idx).toString(),
        COL_SPAN: [iSpan1, iSpan2, iSpan3]
      }
    });
    cols.push({
      COL_TEXT: '',
      COL_BINDING_FIELD: COL_TEXTCOL,
      COL_SPAN: [1, 1, 1]
    })
    cols = cols.reverse();

    /* generate rows */
    let rows = ["zearnings_a","zearnings_diff","zvar_cost_a","zvar_mau_a","zvar_exp_a",
          "zvar_logi_a","zvar_purch_a","zvar_cost_diff","zfixed_cost_a","zfixed_person_a",
          "zfixed_welfare_a","zfixed_insur_a","zfixed_rent_a","zfixed_rd_a",
          "zfixed_deprec_a","zfixed_cost_diff","ztotal_cost","zvar_rate","zbreak_even_point"].map(function(fldName){
      let oRowRecord = {
        COL_TEXTCOL: {
          "value" : _oI18nBundle.getText(fldName),
          "fldName" : fldName
        }
      };

      oData.forEach(function(record, idx){
        if (["zvar_rate"].indexOf(fldName) >= 0) {

          oRowRecord[COL_BINDING_FIELD + COL_TEXT_DELIMITER + idx.toString()] = {
            "record" : record,
            "fldName" : fldName,
            "value" : oPercentFormat.format(Number(record[fldName]))

          }
        } else {

          oRowRecord[COL_BINDING_FIELD + COL_TEXT_DELIMITER + idx.toString()] = {
            "record" : record,
            "fldName" : fldName,
            "value" : oNumberFormat.format(Number(record[fldName]).toFixed(0))
          }
        }
      });
      return oRowRecord;
    });

    return {cols: cols, rows: rows};

  }

  function rowsUpdated(){
    /* label->div->td */
    ['col_header_current_week', 'cell_no_data', 'cell_actual']
      .forEach(function(aCssClass){
        $('.'.concat(aCssClass)).removeClass(aCssClass);
        $('.'.concat(aCssClass, '_f')).parent().parent().addClass(aCssClass);
    });

    /* label->div->td->tr */
    ['row_level1', 'row_level2',
      'row_center', 'row_right']
      .forEach(function(aCssClass){
        $('.'.concat(aCssClass)).removeClass(aCssClass);
        $('.'.concat(aCssClass, '_f')).parent().parent().parent().addClass(aCssClass);
    });
  }

  function formatCell(aCol, sMonth){
    let oFunc = function(aCellValue, aFldName, aRecord){

      let sDisplayValue = undefined;
      var oHeader = aCol.split(COL_TEXT_DELIMITER);

      /* 1st column */
      if (aCol === ''){
        ['row_right_f'].forEach(
          function(aCssName) {
        	  this.removeStyleClass(aCssName) 
          }.bind(this)
        );

        /* text-align */
        if (["zearnings_a","zearnings_diff","zvar_cost_a","zvar_mau_a","zvar_exp_a",
        "zvar_logi_a","zvar_purch_a","zvar_cost_diff","zfixed_cost_a","zfixed_person_a",
        "zfixed_welfare_a","zfixed_insur_a","zfixed_rent_a","zfixed_rd_a",
        "zfixed_deprec_a","zfixed_cost_diff","ztotal_cost","zvar_rate","zbreak_even_point"].indexOf(aFldName) >= 0){
          this.addStyleClass('row_right_f');
        }

      }else{

        ['cell_no_data_f', 'cell_minus', 'cell_plus', "cell_cell_actual"].forEach(
          function(aCssName){
        	  this.removeStyleClass(aCssName) 
          }.bind(this)
        );

        if (oHeader.length >= 2 && oHeader[1] <= sMonth) {
          this.addStyleClass("cell_actual_f")
        }
        /* gray out nodata cells */
        if(typeof aCellValue === 'undefined' || aCellValue === ""){
          this.addStyleClass('cell_no_data_f');
        }

        /* format vsPlan cells */
        if (["zearnings_diff","zvar_cost_diff","zfixed_cost_diff"].indexOf(aFldName) >= 0){
          if(parseFloat(aCellValue) < 0){
            this.addStyleClass('cell_minus');
            sDisplayValue = aCellValue ? aCellValue.replace('-', _oI18nBundle.getText("zminus")) : '';
          } else {
            this.addStyleClass('cell_plus');
            sDisplayValue = aCellValue ? _oI18nBundle.getText("zplus") + aCellValue : '';
          }
        }
      }
      return sDisplayValue ? sDisplayValue : aCellValue;
    }
    return oFunc;
  }

  // Get A~Z
  function encode_col(col) {
    let s = "";
    for (++col; col; col = Math.floor((col - 1) / 26)) s = String.fromCharCode(((col - 1) % 26) + 65) + s;
    return s;
  }

  function s2ab(s) {
    if (typeof ArrayBuffer !== 'undefined') {
      let buf = new ArrayBuffer(s.length);
      let view = new Uint8Array(buf);
      for (let i = 0; i != s.length; ++i)
        view[i] = s.charCodeAt(i) & 0xFF;
      return buf;
    } else {
      let buf = new Array(s.length);
      for (let i = 0; i != s.length; ++i)
        buf[i] = s.charCodeAt(i) & 0xFF;
      return buf;
    }
  }
  return Controller.extend("sap.ZG001.Sample.CO114.controller.ZZmain", {
    initialSelectOption: function() {
      this._oDataManager.getCVPCompanyBU().then(
        this.initOrganization.bind(this)
      )
      this._oDataManager.getCVPYear().then(
        this.initYear.bind(this)
      )
    },
    initYear: function(aYearData) {
      let oYearData = aYearData.results.map(function(aYear, aIndex) {
        if (aYear.zcurrent_year === aYear.CVPYear) {
          return {
            CVPYear:aYear.CVPYear,
            bSelected: true
          }
        } else {

          return {
            CVPYear:aYear.CVPYear,
            bSelected: false
          }
        }  
      })
      this.getView().setModel(new JSONModel(aYearData.results), 'Year');

      this.getView().byId("YearList").setSelectedKey(aYearData.results[0].zcurrent_year)
    },
    initOrganization: function(aCompanyBUData) {
      var oCompanyArray = [];
      var oBUArray = [];
      this.oCompanyBUMapping = {};
      aCompanyBUData.results.forEach(function(aData,aIndex,aArray){
        if (oCompanyArray.indexOf(aData.Company) < 0 ) {
          oCompanyArray.push(aData.Company);
          this.oCompanyBUMapping[aData.Company] = [];
        }
        if (oCompanyArray[0] === aData.Company ) {
          oBUArray.push(aData.BU);
        }

        this.oCompanyBUMapping[aData.Company].push(aData.BU);
      }.bind(this));


      this.getView().setModel(new JSONModel({
        Company: oCompanyArray,
        BU: oBUArray
      }), 'Organization');

      this.getView().byId("Company").setSelectedKey(oCompanyArray[0])
      this.getView().byId("BU").setSelectedKey(oBUArray[0])
    },
    onCompanyChange: function(aControlEvent) {
      let sCompany = aControlEvent.getParameters().selectedItem.getText();
      let oModel = this.getView().getModel("Organization");
      let oData = oModel.getData();
      let oBUArray = this.oCompanyBUMapping[sCompany];
      this.getView().byId("BU").setSelectedKey(oBUArray[0])
      oData.BU = oBUArray;
      this.getView().setModel(new JSONModel(oData), 'Organization');
    },
    onInit: function(){

      let oComponent = this.getOwnerComponent();
      this._oDataManager = oComponent.oDataManager;
      _oI18nBundle = oComponent.getModel('i18n').getResourceBundle();

      this.initialSelectOption();

      this.updateChart(null);

      var oChartFormatter = ChartFormatter.getInstance();
      oChartFormatter.registerCustomFormatter("formatLabeladd",this.formatLabel);
      Format.numericFormatter(oChartFormatter);



      this.getView().byId('t0').attachEvent('_rowsUpdated', rowsUpdated)
        .attachEvent('toggleOpenState', rowsUpdated);

      var oVizFrame = this.getView().byId("idVizFrame");

      this.bRangeSliderAction = false;

      oVizFrame.attachRenderComplete(function() {

        if (!this.data) {
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

    _setRangeSliderTitle: function(aRange) {
      var oFormattedText = this.getView().byId("scaleTitle");

      var oRangeArray = aRange[0] < aRange[1] ? aRange : [aRange[1],aRange[0]];
      var sHtmlText = _oI18nBundle.getText("ZFRangeSliderTitle",[this.formatLabel(oRangeArray[0]),this.formatLabel(oRangeArray[1])]);
      oFormattedText.setHtmlText(sHtmlText);
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

    // formatLabel
    formatLabel : function(value) {
      var fixedInteger = sap.ui.core.format.NumberFormat
          .getCurrencyInstance({
            style : "short",
            maxFractionDigits : 10
          });
      return fixedInteger.format(value);
    },

    columnFactory: columnFactory,

    onShowTable: function() {
      if (!this.getView().byId("showTableButton").getPressed()) {
        this.getView().byId("showTableButton").setPressed(true);
        return;
      } else {
        this.getView().byId("showTableButton").setPressed(true);
        this.getView().byId("rangeSlider").setVisible(false);
        this.getView().byId("scaleTitle").setVisible(false);
        this.getView().byId("showChartButton").setPressed(false);
        this.getView().byId("showTableButton").setPressed(true);

        //Animation
        this._transition(this.getView().byId("ChartVBox"),this.getView().byId("idVizFrame"),this.getView().byId("t0"))

      }
        
    },
    onShowChart: function() {
      if (!this.getView().byId("showChartButton").getPressed()) {
        this.getView().byId("showChartButton").setPressed(true);
        return;
      } else {
		this.getView().byId("showTableButton").setPressed(false);
		this.getView().byId("rangeSlider").setVisible(true);
		this.getView().byId("scaleTitle").setVisible(true);
		this.getView().byId("showTableButton").setPressed(false);
		this.getView().byId("showChartButton").setPressed(true);
		
		//Animation
        this._transition(this.getView().byId("ChartVBox"),this.getView().byId("t0"),this.getView().byId("idVizFrame"))

      }

    },
    onPress: function(){

      let oComponent = this.getOwnerComponent();

      let sCompany = this.getView().byId('Company').getSelectedItem().getText();
      let sBU = this.getView().byId('BU').getSelectedItem().getText();
      let sYear = this.getView().byId('YearList').getSelectedItem().getText();


      this._oDataManager.getCVPData(sCompany, sBU, sYear).then(
        function(aData) {
          if (aData.results[0].zyear === aData.results[0].zcurrent_year) {

            this.currentP = aData.results ? aData.results[0].zcurrent_month : "NULL"
          } else if (aData.results[0].zyear < aData.results[0].zcurrent_year) {
            this.currentP = "NULL";
          } else {
            this.currentP = "00";
          }
          this.data = aData;
          var oData = convertData(aData.results);


                var oVBox = this.getView().byId("ChartVBox");
                var iHeight = oVBox.getDomRef().offsetHeight;
          this.getView().setModel(new JSONModel(oData), 'table');
                this.getView().byId("idVizFrame").setHeight(iHeight + "px")
                if (this.getView().getModel('table')) {

                  let iRowCount = iHeight > 100 ? Math.floor((iHeight - 71) / 24) : 1;
                  this.getView().byId('t0').setVisibleRowCount(iRowCount > 19 ? 19 : iRowCount);
                } else {
                  this.getView().byId('t0').setVisibleRowCount(iHeight > 100 ? Math.floor((iHeight - 33) / 24) : 1);
                    
                }

          this.updateChart(aData);
        }.bind(this)
      ).then(
      );
    },
    updateChart: function(aData) {

      this.bRangeSliderAction = false;
      // Data of Vizframe FlattenedDataset
      var oVizFrame = this.getView().byId("idVizFrame");

      var oModel = new sap.ui.model.json.JSONModel();
      oModel.setData(aData);
      this.getView().setModel(oModel,"chartData");
      let sTextEarnings = _oI18nBundle.getText("zearnings_a");
      let sTextFixedCost = _oI18nBundle.getText("zfixed_cost_a");
      let sTextVarRate = _oI18nBundle.getText("zvar_rate");
      let sTextBreakEvenPoint = _oI18nBundle.getText("zbreak_even_point");
      let sTextEstimation = _oI18nBundle.getText("zestimation");
      
      var bardata = {
        "dimensions" : [ {
          "name" : "zmonth",
          "value" : "{chartData>zmonth}"
        } ],
        "measures" : [ {
          "name" : "sTextEarnings",
          "value" : "{chartData>zearnings_a}"
        }, {
          "name" : "sTextFixedCost",
          "value" : "{chartData>zfixed_cost_a}"
        }, {
          "name" : "sTextVarRate",
          "value" : "{chartData>zvar_cost_a}"
        }, {
          "name" : "sTextBreakEvenPoint",
          "value" : "{chartData>zbreak_even_point}"
        } ],
        "data" : {
          "path" : "chartData>/results"
        }
      };

      // Feed of Vizframe
      var ofeed = [
          new FeedItem(
              {
                "uid" : "valueAxis",
                "type" : "Measure",
                "values" : [
                	"sTextEarnings",
                	"sTextFixedCost",
                	"sTextVarRate",
                	"sTextBreakEvenPoint" ]
              }),
          new FeedItem(
              {
                "uid" : "categoryAxis",
                "type" : "Dimension",
                "values" : [ "zmonth" ]
              }) ];
      // Properties
      var oProper = {
        "title" : {
          "visible" : false
        },
        "categoryAxis" : {
//          labelRenderer: this.renderChartLabel.bind(this),
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

//            "lineRenderer": this.renderLine.bind(this),
            "width" : 4,
            "marker" : {
              "visible" : false,
//              "shape": "square"
            }
          },
//          "markerRenderer": this.renderLine.bind(this),
          "dataShape" : {
            "primaryAxis" : [
                "line", "bar",
                "bar", "line"]
          },
          "isSmoothed" : false,
          "dataLabel" : {
            "visible" : false
          },
          "dataPointStyle" : {
            "rules" : [
                {
                  "dataContext" : {
                	  "sTextEarnings" : "*"
                  },
                  "properties" : {
                    "lineColor" : "#FFC000",
                    "lineType" : "solid"
                  },
                  "displayName" : sTextEarnings,
                  "dataName" : {
                	  sTextEarnings : sTextEarnings
                  }
                },
                {
                  "dataContext" : {
                    "sTextFixedCost" : "*"
                  },
                  "properties" : {
                    "color" : "#2f5597",
                  },
                  "displayName" : sTextFixedCost,
                  "dataName" : {
                    "sTextFixedCost" : sTextFixedCost
                  }
                },
                {
                  "dataContext" : {
                    "sTextVarRate" : "*"
                  },
                  "properties" : {
                    "color" : "#8faadc",
                  },
                  "displayName" : sTextVarRate,
                  "dataName" : {
                    "sTextVarRate" : sTextVarRate
                  }
                },
                {
                  "dataContext" : {
                    "sTextBreakEvenPoint" : "*"
                  },
                  "properties" : {
                    "lineColor" : "#5b9bd5",
                    "lineType" : "solid"
                  },
                  "displayName" : sTextBreakEvenPoint,
                  "dataName" : {
                    "sTextBreakEvenPoint" : sTextBreakEvenPoint
                  }
                },
                {
                  "callback" : this.determainEstimation.bind(this),
                  "dataContext" : {
                    "zmonth": { "min":this.currentP }
                  },
                  "properties" : {
                    "pattern": "diagonalLightStripe",
                    "lineType": "dot"
                  },
                  "displayName" : sTextEstimation,
                                 
                           }]
          }
        }
      }
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

      oVizFrame.setDataset(oDataSet);
      oVizFrame.setVizProperties(oProper);
      oVizFrame.removeAllFeeds();
      ofeed.forEach(function(aCurrent,aIndex) {
        oVizFrame.insertFeed(aCurrent, aIndex);
      })


    },
    onDownload : function(evt) {

      let oMockData = this.getView().getModel('table').getData();
      let columns = oMockData.cols.length;
      let rows = oMockData.rows.length + 2;

          let oNumberFormat = NumberFormat.getFloatInstance();
          let oPercentFormat = NumberFormat.getPercentInstance();
          
      // Output data
      let exceldata = [];
      let excelob = {};

      for (let erow = 0; erow < rows ; erow++ ) {
        for ( let ecol = 0; ecol < columns ; ecol++ ) {
          // Header Line Count === 2
          if (erow < 2) {
            if(oMockData.cols[ecol-1] && oMockData.cols[ecol-1].COL_SPAN[erow]<= 1 ){
              excelob[oMockData.rows[ecol].COL_TEXTCOL.fldName] = 
                (oMockData.cols[ecol].COL_TEXT.split('__')[erow]=="") ? "" :
                  oMockData.cols[ecol].COL_TEXT.split('__')[erow];
              }else{
                excelob[oMockData.rows[ecol].COL_TEXTCOL.fldName] = "";
              }
            }
          else {
            if (ecol === 0) {
              excelob[oMockData.rows[ecol].COL_TEXTCOL.fldName] = oMockData.rows[erow-2].COL_TEXTCOL.value;
            } else {
              let oCurrentData = oMockData.rows[erow-2]['COL_BINDING_FIELD__' + [ecol-1].toString()];
              excelob[oMockData.rows[ecol].COL_TEXTCOL.fldName] = 
                ['not number'].indexOf(oCurrentData.fldName) >= 0
                ?
                oCurrentData.value
                :
                (oCurrentData.value === "" ? "": oNumberFormat.parse(oCurrentData.value))
              ;
            }
          }
        }
        exceldata.push(excelob);
        excelob = {};
      };

      let ws = XLSX.utils.json_to_sheet(exceldata);

      // Delete Header Line (Json key)
      for (let l = 1;l <= rows + 1 ; l++){
        for (let C = 0; C < columns; ++C){
          ws[encode_col(C) + [l]] = ws[encode_col(C) + [l+1]]
        }
      }

      // Edit sheet
      let currentMonthColumn = 0;
      for (let iRows = 0; iRows <= rows; iRows++) {
        for (let iColumns = 0; iColumns < columns; iColumns++) {
          let oCell = ws[XLSX.utils.encode_cell({c : iColumns,r : iRows})];

          if(oCell){
            oCell.s = {};

            // Header of table
            if ( iRows < 2) {
              if (iColumns) {
                oCell.s.border = {
                    top : { style: "thin", color: { indexed: "64" } },
                    bottom : { style: "thin", color: { indexed: "64" } }
                };
              }
              if (oCell.v != "") {
                oCell.s.border.left = {
                  style: "thin", 
                  color: { indexed: "64" }
                };

              };

              if (iColumns === columns-1){
                oCell.s.border.right = { style: "thin", color: { indexed: "64" } };
              }

              oCell.s.fill = {
                patternType: "solid",
                fgColor: { rgb: "FFE8E8E8"}
              };

              //Current Month
              if ( iRows === 1) {
                if (oCell.v <= this.currentP && oCell.v) {
                  currentMonthColumn = iColumns;
                  oCell.s.fill = {
                      patternType: "lightDown",
                      fgColor: { theme: "0", tint : "-0.14996795556505021"},
                      bgColor: { rgb: "FFFFFF00"}
                    }

                };
              }
            }



            // Item of Table
            else {

              if ( iColumns > 0 ) {
                oCell.s.alignment = {
                                horizontal: "right",
                                vertical: "center"
                }
              }
              if (typeof oCell.s.border === 'undefined') {
                oCell.s.border = {
                  right : { style: "thin", color: { indexed: "64" } },
                  left : { style: "thin", color: { indexed: "64" } },
                    top: { style: "thin", color: { indexed: "64" } },
                    bottom: { style: "thin", color: { indexed: "64" }
                  }
                };
              }

              if (iColumns === 0) {
                oCell.s.fill = {
                  patternType: "solid",
                  fgColor: { rgb: "FFDCE0F2"}
                }
              }

              if (iColumns > 0 && (iColumns <= currentMonthColumn || this.currentP === "NULL")) {

                oCell.s.fill = {
                  patternType: "lightDown",
                  fgColor: { theme: "0", tint : "-0.14996795556505021"},
                  bgColor: { rgb: "FFFFFF00"}
                }
              }

              if ( [4,10,18].indexOf(iRows + 1) >= 0 && iColumns > 0) {
                if (oCell.v < 0) {
                  oCell.s.font = {
                      color: { rgb: "FFFF0000" }
                  }

                } else {
                  oCell.s.font = {
                      color: { rgb: "FF0000FF" }
                              }
                }
              }

              if (iRows === 19 && iColumns > 0) {
                oCell.s.numFmt = "0.00%";
              }

            }
          }
        }
      }

      var wscols = [
                { wch: 18,
                  min: "1",
                  max: "1"}
             ];
      var wsmerges = [{s: {c: 1, r: 0}, e: {c: 12, r: 0}}];
      ws['!merges'] = wsmerges;
      ws['!cols'] = wscols;

      let wb = {
          SheetNames : [ "sheet1"],
          Sheets : {
            sheet1 : ws
          }
        };
      let wbout = XLSX.write(wb, {
        bookType: "xlsx",
        type : 'binary',
        bookSST : true
      });

      let fname = 'Cost-Volume-Profit Analysis.xlsx';
      try {
        saveAs(new Blob([ s2ab(wbout) ], {
          type : "application/octet-stream"
        }), fname);
      } catch (e) {
        if (typeof console != 'undefined'){
          console.log(e, wbout);
        }
      }
    },
    determainEstimation: function(aData) {
      if (aData && aData.zmonth && aData.zmonth > this.currentP) {

        return true;
      } else {
        return false;
      }
    },
    renderChartLabel: function(aData) {

      if (aData && aData.ctx && aData.ctx.zmonth && aData.ctx.zmonth === this.currentP) {

        aData.styles.color = "red";
        aData.styles["fontWeight"] = "900";
      }
    },
    renderLine: function(aData) {
      var x = 1;
//      if (aData && aData.ctx && aData.ctx.zmonth && aData.ctx.zmonth > this.currentP) {
//
//        aData.graphic.shape = "diamond";
//      } else {
//
//        aData.graphic.shape = "square";
//      }
    },
    onResize: function() {
        var oVBox = this.getView().byId("ChartVBox");
        var iHeight = oVBox.getDomRef().offsetHeight;

        this.getView().byId("idVizFrame").setHeight(iHeight + "px")
        if (this.getView().getModel('table')) {

          let iRowCount = iHeight > 100 ? Math.floor((iHeight - 71) / 24) : 1;
          this.getView().byId('t0').setVisibleRowCount(iRowCount > 19 ? 19 : iRowCount);
        } else {
          this.getView().byId('t0').setVisibleRowCount(iHeight > 100 ? Math.floor((iHeight - 33) / 24) : 1);
            
        }
    },
    _transition: function(aParent,aFromPage,aToPage) {
		aParent.addStyleClass("sapMNavFlip");
	
		// set the style classes that represent the initial state
		aToPage.addStyleClass("sapMNavItemFlipNext");     // the page to navigate back to should be placed just left of the visible area
		aToPage.removeStyleClass("sapMNavItemHidden"); // remove the "hidden" class now which has been added by the NavContainer before the animation was called
	
		// iPhone needs some time... there is no animation without waiting
		window.setTimeout(function () {
	
			var bOneTransitionFinished = false;
			var bTransitionEndPending = true;
			var fAfterTransition = null; // make Eclipse aware that this variable is defined
			fAfterTransition = function () {
				jQuery(this).unbind("webkitTransitionEnd transitionend");
				if (!bOneTransitionFinished) {
					// the first one of both transitions finished
					bOneTransitionFinished = true;
				} else {
					// the second transition now also finished => clean up the style classes
					bTransitionEndPending = false;
					aToPage.removeStyleClass("sapMNavItemFlipping");
					aFromPage.removeStyleClass("sapMNavItemFlipping").addStyleClass("sapMNavItemHidden").removeStyleClass("sapMNavItemFlipPrevious");
					aParent.removeStyleClass("sapMNavFlip");
	
					return;
				}
			};
	
			aFromPage.$().bind("webkitTransitionEnd transitionend", fAfterTransition);
			aToPage.$().bind("webkitTransitionEnd transitionend", fAfterTransition);
	
			// set the new style classes that represent the end state (and thus start the transition)
			aToPage.addStyleClass("sapMNavItemFlipping").removeStyleClass("sapMNavItemFlipNext"); // transition from left position to normal/center position starts now
			aFromPage.addStyleClass("sapMNavItemFlipping").addStyleClass("sapMNavItemFlipPrevious"); // transition from normal position to right position starts now
	
			window.setTimeout(function () { // in case rerendering prevented the fAfterTransition call
				if (bTransitionEndPending) {
					bOneTransitionFinished = true;
					fAfterTransition.apply(aFromPage.$().add(aToPage.$()));
				}
			}, 600);
	
		}, 60); 
    }
  });

});