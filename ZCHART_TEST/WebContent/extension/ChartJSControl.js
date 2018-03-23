sap.ui.define([
  'sap/ui/core/Control'
], function(Control) {
  'use strict';

  var CHART_CANVAS_NAME_PREFIX = 'chartJSCanvas';

  return Control.extend('sap.ZZZ01.YY_TS_SETTING.extension.ChartJSControl', {
    metadata: {
      properties: {
        width: {
          type: 'int',
          defaultValue: 400
        },
        height: {
          type: 'int',
          defaultValue: 400
        },
        responsive: {
          type: 'string',
          defaultValue: 'false'
        },
        maintainAspectRatio: {
          type: 'string',
          defaultValue: 'true'
        },
        chartType: {
          type: 'string',
          defaultValue: 'Line'
        },
        data: {
          type: 'object'
        },
        options: {
          type: 'object'
        }
      },
      events: {
        update: {
          enablePreventDefault: true
        }
      }
    },

    init: function() {
      var _newCustomChart;
      this.slider = new sap.m.Slider({
    	  min:10,
    	  max:100,
    	  step:5,
    	  enableTickmarks: true
      });
      

      window.randomScalingFactor = function() {
  		return (Math.random() > 0.5 ? 1.0 : -1.0) * Math.round(Math.random() * 100);
  	};
  	window.chartColors = {
  			red: 'rgb(255, 99, 132)',
  			orange: 'rgb(255, 159, 64)',
  			yellow: 'rgb(255, 205, 86)',
  			green: 'rgb(75, 192, 192)',
  			blue: 'rgb(54, 162, 235)',
  			purple: 'rgb(153, 102, 255)',
  			grey: 'rgb(201, 203, 207)'
  		};
      
      this.config = {
              type: 'bar',
              data: {
                  labels: ["January", "February", "March", "April", "May", "June", "July"],
                  datasets: [{
                	  type: 'line',
                      label: "My First dataset",
                      backgroundColor: window.chartColors.red,
                      borderColor: window.chartColors.red,
                      data: [
                          randomScalingFactor(),
                          randomScalingFactor(),
                          randomScalingFactor(),
                          randomScalingFactor(),
                          randomScalingFactor(),
                          randomScalingFactor(),
                          randomScalingFactor()
                      ],
                      fill: false,
                  }, {
                      label: "My Second dataset",
                      fill: false,
                      backgroundColor: window.chartColors.blue,
                      borderColor: window.chartColors.blue,
                      data: [
                          randomScalingFactor(),
                          randomScalingFactor(),
                          randomScalingFactor(),
                          randomScalingFactor(),
                          randomScalingFactor(),
                          randomScalingFactor(),
                          randomScalingFactor()
                      ],
                  }]
              },
              options: {
                  responsive: true,
                  title:{
                      display:true,
                      text:'Chart.js Line Chart'
                  },
                  tooltips: {
                      mode: 'index',
                      intersect: false,
                  },
                  hover: {
                      mode: 'nearest',
                      intersect: true
                  },
                  scales: {
                      xAxes: [{
                          display: true,
                          scaleLabel: {
                              display: true,
                              labelString: 'Month'
                          }
                      }],
                      yAxes: [{
                          display: true,
                          scaleLabel: {
                              display: true,
                              labelString: 'Value'
                          }
                      }]
                  }
              }
          };      
      this.slider.attachChange(function(){
    	  this.config.data.datasets.forEach(function(dataset) {
              dataset.data = dataset.data.map(function() {
                  return randomScalingFactor();
              });

          });

          this._newCustomChart.update();
      }.bind(this));
    },

    onBeforeRendering: function() {
      // set global property for responsiveness
      if (this.getResponsive() === "true") {
        Chart.defaults.global.responsive = true;
      } else {
        Chart.defaults.global.responsive = false;
      }

      // set global property for aspect ratio
      if (this.getMaintainAspectRatio() === "true") {
        Chart.defaults.global.maintainAspectRatio = true;
      } else {
        Chart.defaults.global.maintainAspectRatio = false;
      }
    },

    onAfterRendering: function() {
      // Get the context of the canvas element we want to select
      var ctx = document.getElementById(CHART_CANVAS_NAME_PREFIX + this.getId()).getContext("2d");

      var chartType = this.getChartType();
      /*Modify */
      //var chartData = this.getData();      
      switch (chartType) {
	      case 'Bar':
	    	  var chartData = {
	    		    "datasets": [{
	    		    	"label": "採点",
	    				"backgroundColor": "#5B9BD5",
	    				"hoverBackgroundColor": "#5B9BD5"
	    		      }]
	    	      }

	          var importData = this.getData();
	          if(importData === undefined) {
	              return;
	           }
	          chartData["labels"] = importData["f6_labels"];
	          chartData["datasets"][0]["data"] = importData["f6_values"];
	    	  break;
	      case 'Radar':
	    	  var chartData = {
	    		    "datasets": [{
	    		    	"label": "レベル",
	    				"fill": false,
	    				"borderColor": "rgba(0, 112, 192, 0.6)",
	    				"borderWidth": 3
	    		      }]
	    	      }
	          var importData = this.getData();
	          if(importData === undefined) {
	              return;
	           }
	          chartData["labels"] = importData["f7_labels"];
	          chartData["datasets"][0]["data"] = importData["f7_values"];
	    	  break;
	      default:
	        throw new Error('Error while creating ChartJS: Undefined chartType: ' + chartType);
      }

      
      /*Modify */
      var barChartOptions = {
			  legend:{
				  display: false
			  },
    		  scales:{

                  yAxes: [{
                	  type: "category",
                	  display: true,
                	  gridLines:{
                    	  display: false
                      },
                      ticks:{
    	    			  fontColor: "#0070C0",
    	    			  fontFamily: '"Meiryo UI","Meiryo","ヒラギノ角ゴ Pro W3","Hiragino Kaku Gothic Pro","ＭＳ Ｐゴシック","Osaka",sans-serif',
    	    			  fontSize: 14,
    	    			  fontStyle: "normal"
                      }
                  }],
                  xAxes:[{
                	  type: "linear",
                      ticks: {
  				        min: 0,
  				        max: 5,
  				        fixedStepSize: 1
  		    		  }
                  }]
    		  }
      };
      var radarChartOptions = {
    		  legend:{
    			  display: false
    		  },
    		  scale:{
    			  type: "radialLinear",
	    		  pointLabels:{
	    			  fontColor: "#0070C0",
	    			  fontFamily: '"Meiryo UI","Meiryo","ヒラギノ角ゴ Pro W3","Hiragino Kaku Gothic Pro","ＭＳ Ｐゴシック","Osaka",sans-serif',
	    			  fontSize: 14,
	    			  fontStyle: "normal"
	    		  },
	    		  angleLines:{
	    			  display: false

	    		  },
	    		  ticks: {
	    			beginAtZero: true,
			        min: 0,
			        max: 5,
			        stepSize: 1
	    		  }
    		  }
	 };

      // required due to lifecycle calls > init of undefined vars
      if(chartData === undefined) {
        return;
      }


      var MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

      
      this._newCustomChart = new Chart(ctx, this.config);
      return;
      
      
      
      
      
      
      
      
      
      
      
      switch (chartType) {
        case 'Bar':
            this._newCustomChart = new Chart(ctx, {type: 'horizontalBar',
          	  data: chartData,
          	  options: barChartOptions});
          break;
        case 'Radar':
          this._newCustomChart = new Chart(ctx, {type: 'radar',
        	  data: chartData,
        	  options: radarChartOptions});
          //this._newCustomChart.Radar(chartData, chartOptions);
          break;
        default:
          throw new Error('Error while creating ChartJS: Undefined chartType: ' + chartType);
      }
    },

    exit: function() {
      this._newCustomChart.destroy();
    },

    renderer: function(oRm, oControl) {
      //var oBundle = oControl.getModel('i18n').getResourceBundle();
      var width = oControl.getWidth();
      var height = oControl.getHeight();

      //Create the control
      oRm.write('<div');
      oRm.writeControlData(oControl);
      oRm.addClass("chartJSControl");
      oRm.addClass("sapUiResponsiveMargin");
      oRm.writeClasses();
      oRm.write('>');

      oRm.write('<canvas id="' + CHART_CANVAS_NAME_PREFIX + oControl.getId() + '" width="' + width + '" height="' + height + '"></canvas>');

      oRm.renderControl(oControl.slider)
      oRm.write('</div>');
    },

    update: function() {
      this._newCustomChart.update();
    }
  });
});
