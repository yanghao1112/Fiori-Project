sap.ui.define(
	[ 'sap/ui/core/Control' ],
	function(Control) {
		'use strict';

		var CHART_CANVAS_NAME_PREFIX = 'chartJSCanvas';

		return Control.extend('sap.ZZZ01.YY_TS_SETTING.extension.PlotlyJSChart',
			{
				metadata : {
					properties : {
						width : {
							type : 'string',
							defaultValue : '500px'
						},
						height : {
							type : 'string',
							defaultValue : '400px'
						},
						responsive : {
							type : 'string',
							defaultValue : 'false'
						},
						maintainAspectRatio : {
							type : 'string',
							defaultValue : 'true'
						},
						chartType : {
							type : 'string',
							defaultValue : 'Line'
						},
						data : {
							type : 'object'
						},
						options : {
							type : 'object'
						}
					},
					events : {
						update : {
							enablePreventDefault : true
						}
					}
				},

				init : function() {
					var _newCustomChart;
					
					this.sliderValue = [];
					this.steps = [];
					for (var iCount = 0; iCount<=200; iCount++) {
						var sNumber = 70 + iCount
						this.sliderValue.push(sNumber)
						var step = {
							"label": sNumber,
				            "method": "animate",
				            "args": [[sNumber], {
				                "mode": "immediate",
				                "transition": {"duration": 300},
				                "frame": {"duration": 300, "redraw": false}
				              }
				            ]
						}
						this.steps.push(step);
					}
					

					this.data = [
				        {
				            type: 'scatter',  // all "scatter" attributes:
												// https://plot.ly/javascript/reference/#scatter
				            x: ['P01', 'P02', 'P03', 'P04', 'P05', 'P06', 'P07', 'P08', 'P09', 'P10', 'P11', 'P12', 'P09', 'P10', 'P11', 'P12'],     // more
																															// about
																															// "x":
																															// #scatter-x
				            y: [60, 65, 80, 90, 70, 65, 80, 90, 70, 65, 80, 90, 65, 80, 90],     // #scatter-y
				            customdata: ['asf\nsdfasf','dd','ee'],
				            marker: {         // marker is an object,
												// valid marker keys:
												// #scatter-marker
				                color: 'rgb(16, 32, 77)' // more about
															// "marker.color":
															// #scatter-marker-color
				            },
				            // mode: 'markers',
			            	name: 'line chart example', // #bar-name
						    //showlegend: false,
						    //hoverinfo:"text",
						    hovertext:["asf sdfas<br />sdaffffffffffffffffffffffsdafasfasfdaedcscaea asfdaeafffffffffffff",'dd','fasf']
				            // <br /> new line
				        },
				        {
				            type: 'bar',      // all "bar" chart
												// attributes: #bar
				            x: ['P01', 'P02', 'P03', 'P04', 'P05', 'P06', 'P07', 'P08', 'P09', 'P10', 'P11', 'P12', 'P13', 'P14', 'P15', 'P16'],     // more
																															// about
				           // yaxis: 'y2',																							// "x":
																															// #bar-x
				            y: [63, 64, 70, 80, 90, 80, 75, 70, 80, 85, 60, 80, 65, 80, 90],     // #bar-y
				            name: 'bar chart example' // #bar-name
				        }
				    ]
				},

				onBeforeRendering : function() {
					// set global property for
					// responsiveness
//					if (this.getResponsive() === "true") {
//						Chart.defaults.global.responsive = true;
//					} else {
//						Chart.defaults.global.responsive = false;
//					}
//
//					// set global property for aspect
//					// ratio
//					if (this.getMaintainAspectRatio() === "true") {
//						Chart.defaults.global.maintainAspectRatio = true;
//					} else {
//						Chart.defaults.global.maintainAspectRatio = false;
//					}
				},

				onAfterRendering : function() {
					// Get the context of the canvas
					// element we want to select
					var ctx = document.getElementById(
							CHART_CANVAS_NAME_PREFIX
									+ this.getId());

					var layout = {                     // all "layout"
														// attributes: #layout
						    title: 'simple example',  // more about
														// "layout.title":
														// #layout-title
						    xaxis: {                  // all "layout.xaxis"
														// attributes:
														// #layout-xaxis
						        title: 'xtime'         // more about
														// "layout.xaxis.title":
														// #layout-xaxis-title
						    },
						    yaxis: {                  // all "layout.xaxis"
														// attributes:
														// #layout-xaxis
						        //title: 'ytime' ,         // more about
															// "layout.xaxis.title":
															// #layout-xaxis-title
						        	type: 'log'
						    },
						    yaxis2: {
						        title: 'yaxis2 title',
						        titlefont: {color: 'rgb(148, 103, 189)'},
						        tickfont: {color: 'rgb(148, 103, 189)'},
						        overlaying: 'y',
						        side: 'right'
						     },
						    annotations: [            // all "annotation"
														// attributes:
														// #layout-annotations
						        {
// text: 'simple annotation', // #layout-annotations-text
// x: 0, // #layout-annotations-x
// xref: 'paper', // #layout-annotations-xref
// y: 0, // #layout-annotations-y
// yref: 'paper' // #layout-annotations-yref
						        }
						    ],
						    width: this.getWidth().replace("px",""),
						    height: this.getHeight().replace("px",""),
						    
						    showlegend: true,
						    hovermode:'closest',
						    "slider":{
						        "visible":true,
						        "plotlycommand":"animate",
						        "args":[
						          "slider.value",
						          {
						            "duration":400,
						            "ease":"cubic-in-out"
						          }
						        ],
						        "initialValue":'75.00',
						        "values":this.sliderValue
						      },
						    "sliders": [{
						          "active": 20,
						          "steps": this.steps,
						          "pad": {"t": 50, "b": 10},
						          "currentvalue": {
						              "visible": true,
						              "prefix": "Year:",
						              "xanchor": "left",
						              "font": {
						                "size": 20,
						                "color": "#666"
						              }
						            }
						      }],
						      legend: {
						    	    x: 0,
						    	    y: 1.2,
						    	    bgcolor: 'rgba(255, 255, 255, 0)',
						    	    bordercolor: 'rgba(255, 255, 255, 0)'
						    	  },
						    margin: {
						    	l:40,
						    	r:80,
						    	t:100,
						    	b:80
						    }
						};
					
/*
 * var that = this; require(['Plotly'],function(Plotly) { that._newCustomChart =
 * Plotly.plot( ctx, data, layout,{ //displayModeBar: false, displaylogo: false
 * //,showLink: true }); });
 */
					Plotly.plot( ctx, this.data, layout,{ 
				    	// displayModeBar: false,
				    	displaylogo: false
				    	// ,showLink: true
				    	});
					// this._newCustomChart =
					ctx.on('plotly_click', function(aEventControl){
					    alert('x:' + aEventControl.points[0].x + ',  y:' + aEventControl.points[0].y);
					});
					
					ctx.on('plotly_sliderchange',function(aEventControl) {
						var value = aEventControl.step.args[0][0];
						
						Plotly.animate(document.getElementById("chartJSCanvas" + this.getId()), [{
						    data: [{y: [60, 65, 80 , 90 , 
						    			70 , 65, 80, 90, 
						    			70, 65, 80 * value / 80 * Math.random(), 0]}
						    		],
							traces:[0]
						  }]
						, {
						    transition: {
						      duration: 500,
						      easing: 'cubic-in-out'
						    }
						,"frame": { "redraw": true}
						  }
						)
						  
					}.bind(this));


				},

				exit : function() {
					this._newCustomChart.destroy();
				},

				renderer : function(oRm, oControl) {
					// var oBundle =
					// oControl.getModel('i18n').getResourceBundle();
					var width = oControl.getWidth();
					var height = oControl.getHeight();

					// Create the control
					oRm.write('<div');
					oRm.writeControlData(oControl);
					oRm.addClass("chartJSControl");
					oRm
							.addClass("sapUiResponsiveMargin");
					oRm.writeClasses();
					oRm.write('>');

					oRm.write('<div id="'
							+ CHART_CANVAS_NAME_PREFIX
							+ oControl.getId()
						//	+ '" width="' + width
						//	+ '" height="' + height
							+ '"></div>');

					oRm.write('</div>');
				},

				update : function() {
					this._newCustomChart.update();
				}
			});
});
