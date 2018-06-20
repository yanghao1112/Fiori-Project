/// <reference path="../../../../../td/ui5/jQuery.d.ts" />.
/// <reference path="../../../../../td/ui5/sap.m.d.ts" />.
/// <reference path="../../../../../td/ui5/sap.ui.d.ts" />.

sap.ui.define(
	['sap/ui/core/Control',
	'sap/ab/thirdParty/d3'
	],
	function(Control, d3){
				const THIS_MODULE_NAME = 'sap.ab.graph.RadarChart';
				const THIS_LIBRARY_NAME = 'sap.ab.graph';
				const RADAR_DIV_INNER_CLASS = 'RadarInnerDiv';
				const RADAR_DIV_OUTER_CLASS = 'RadarOuterDiv';
				var RadarChart = {
						defaultConfig: {
							xOffset: 0,
							yOffset: 0,
							w: 600,
							h: 600,
							factor: 0.95,
							factorLegend: 1,
							levels: 3,
							levelText: true,
							levelTick: false,
							TickLength: 10,
							maxValue: 0,
							minValue: 0,
							radians: 2 * Math.PI,
							color: d3.schemeCategory10,
							axisLine: true,
							axisText: true,
							circles: true,
							radius: 5,
							open: false,
							backgroundColor: 'transparent',
							backgroundTooltipColor: "#555",
							backgroundTooltipOpacity: "0.7",
							tooltipColor: "white",
							axisJoin: function(d, i) {
								return d.className || i;
							},
							tooltipFormatValue: function(d) {
								return d;
							},
							tooltipFormatClass: function(d) {
								return d;
							},
							transitionDuration: 300,
							emphasis: []
						},
						chart: function() {
							// default config
							var cfg = Object.create(RadarChart.defaultConfig);
							function setTooltip(tooltip, msg){
								if(msg === false || msg == undefined){
									tooltip.classed("visible", 0);
									tooltip.select("rect").classed("visible", 0);
								}else{
									tooltip.classed("visible", 1);
					
									var container = tooltip.node().parentNode;
									var coords = d3.mouse(container);
					
									tooltip.select("text").classed('visible', 1).style("fill", cfg.tooltipColor);
									var padding=5;
									var bbox = tooltip.select("text").text(msg).node().getBBox();
					
									tooltip.select("rect")
									.classed('visible', 1).attr("x", 0)
									.attr("x", bbox.x - padding)
									.attr("y", bbox.y - padding)
									.attr("width", bbox.width + (padding*2))
									.attr("height", bbox.height + (padding*2))
									.attr("rx","5").attr("ry","5")
									.style("fill", cfg.backgroundTooltipColor).style("opacity", cfg.backgroundTooltipOpacity);
									tooltip.attr("transform", "translate(" + (coords[0]+10) + "," + (coords[1]-10) + ")")
								}
							}
							function radar(selection) {
								selection.each(function(data) {
									var container = d3.select(this);
									container.classed(RADAR_DIV_INNER_CLASS, 1);
									
									let bgLayer = container.append('rect')
										.attr('x', '0')
										.attr('y', '0')
										.attr('width', cfg.w)
										.attr('height', cfg.h)
										.attr('fill', cfg.backgroundColor);

									var tooltip = container.selectAll('g.tooltip').data([data[0]]);
					
									var tt = tooltip.enter()
									.append('g')
									.classed('tooltip', true);
					
									tt.append('rect').classed("tooltip", true);
									tt.append('text').classed("tooltip", true);

									tooltip = tt.merge(tooltip);
					
									// allow simple notation
									data = data.map(function(datum) {
										if(datum instanceof Array) {
											datum = {axes: datum};
										}
										return datum;
									});

									cfg.color = data.map(function(d, i){
										return d.classColor ? d.classColor : cfg.color(i);
									});

				
									var maxValue = Math.max(cfg.maxValue, d3.max(data, function(d) {
										return d3.max(d.axes, function(o){ return o.value; });
									}));
									maxValue -= cfg.minValue;
					
									// var allAxis = data[0].axes.map(function(i, j){ return {name: i.axis, xOffset: (i.xOffset)?i.xOffset:0, yOffset: (i.yOffset)?i.yOffset:0}; });
									let allAxis = cfg.axes.map(function(i, j){
										return {
											name: i.axisText,
											length: i.length,
											xOffset: (i.xOffset)?i.xOffset:0, 
											yOffset: (i.yOffset)?i.yOffset:0,
											emphasis: cfg.emphasis.indexOf(i.axis) >= 0
										};
									});
									var total = allAxis.length;
									var radius = cfg.factor * Math.min(cfg.w / 2, cfg.h / 2);
									var radius2 = Math.min(cfg.w / 2, cfg.h / 2);
					
									function getPosition(i, range, factor, func){
										factor = typeof factor !== 'undefined' ? factor : 1;
										return range * (1 - factor * func(i * cfg.radians / total));
									}
									function getHorizontalPosition(i, range, factor){
										return getPosition(i, range, factor, Math.sin);
									}
									function getVerticalPosition(i, range, factor){
										return getPosition(i, range, factor, Math.cos);
									}
					
									// levels && axises
									var levelFactors = d3.range(0, cfg.levels).map(function(level) {
										return radius * ((level + 1) / cfg.levels);
									});
					
									var levelGroups = container.selectAll('g.level-group').data(levelFactors);
									levelGroups.exit().remove();

									levelGroups = levelGroups.enter().append('g')
									.attr('class', function(d, i) {
										return 'level-group level-group-' + i;
									})
									.merge(levelGroups);

									if (cfg.levelText){
										levelGroups.append('text')
										.attr('y', function(levelFactor, i){
											return getVerticalPosition(0, levelFactor);
										})
										.attr('x', function(d, i){ return 0; })
//										.attr('x', function(d, i){ return getHorizontalPosition(11, d, cfg.factorLegend); })s
										.attr('dx', '0.5em')
										.attr('dy', '1em')
										.attr('class', 'legend left')
										.attr('transform', function(levelFactor) {
											return 'translate(' + (cfg.xOffset+cfg.w/2 - 25) + ', ' + (cfg.yOffset+cfg.h/2-levelFactor) + ')';
//											return 'translate(' + (cfg.xOffset+cfg.w/2-levelFactor) + ', ' + (cfg.yOffset+cfg.h/2-levelFactor) + ')';
										})
										.text(function(d, i) {
											return cfg.minValue + cfg.maxValue * (i + 1) / cfg.levels; 
										});
									}

									var levelLine = levelGroups.selectAll('.level').data(function(levelFactor) {
										return d3.range(0, total).map(function() { return levelFactor; });
									});
					
									levelLine.exit().remove();
									levelLine = levelLine.enter().append('line').merge(levelLine);
					
									if (cfg.levelTick){
										levelLine
										.attr('class', 'level')
										.attr('x1', function(levelFactor, i){
											if (radius == levelFactor) {
												return getHorizontalPosition(i, levelFactor);
											} else {
												return getHorizontalPosition(i, levelFactor) + (cfg.TickLength / 2) * Math.cos(i * cfg.radians / total);
											}
										})
										.attr('y1', function(levelFactor, i){
											if (radius == levelFactor) {
												return getVerticalPosition(i, levelFactor);
											} else {
												return getVerticalPosition(i, levelFactor) - (cfg.TickLength / 2) * Math.sin(i * cfg.radians / total);
											}
										})
										.attr('x2', function(levelFactor, i){
											if (radius == levelFactor) {
												return getHorizontalPosition(i+1, levelFactor);
											} else {
												return getHorizontalPosition(i, levelFactor) - (cfg.TickLength / 2) * Math.cos(i * cfg.radians / total);
											}
										})
										.attr('y2', function(levelFactor, i){
											if (radius == levelFactor) {
												return getVerticalPosition(i+1, levelFactor);
											} else {
												return getVerticalPosition(i, levelFactor) + (cfg.TickLength / 2) * Math.sin(i * cfg.radians / total);
											}
										})
										.attr('transform', function(levelFactor) {
											return 'translate(' + (cfg.xOffset+cfg.w/2-levelFactor) + ', ' + (cfg.yOffset+cfg.h/2-levelFactor) + ')';
										});
									}
									else{
										levelLine
										.attr('class', 'level')
										.attr('x1', function(levelFactor, i){ return getHorizontalPosition(i, levelFactor); })
										.attr('y1', function(levelFactor, i){ return getVerticalPosition(i, levelFactor); })
										.attr('x2', function(levelFactor, i){ return getHorizontalPosition(i+1, levelFactor); })
										.attr('y2', function(levelFactor, i){ return getVerticalPosition(i+1, levelFactor); })
										.attr('transform', function(levelFactor) {
											return 'translate(' + (cfg.xOffset+cfg.w/2-levelFactor) + ', ' + (cfg.yOffset+cfg.h/2-levelFactor) + ')';
										});
									}
									if(cfg.axisLine || cfg.axisText) {
										var axis = container.selectAll('.axis').data(allAxis);
					
										var newAxis = axis.enter().append('g').attr('class', 'axis');
										if(cfg.axisLine) {
											newAxis.append('line');
										}
										if(cfg.axisText) {
											newAxis.append('text');
										}
					
										axis.exit().remove();
					
										// axis.attr('class', 'axis');
										axis = newAxis.merge(axis);
					
										if(cfg.axisLine) {
											axis.select('line')
											.attr('x1', cfg.w/2)
											.attr('y1', cfg.h/2)
											.attr('x2', function(d, i) { return (cfg.w/2-radius2)+getHorizontalPosition(i, radius2, cfg.factor); })
											.attr('y2', function(d, i) { return (cfg.h/2-radius2)+getVerticalPosition(i, radius2, cfg.factor); })
											.attr('transform', function() {
												return 'translate(' + cfg.xOffset + ', ' + cfg.yOffset + ')';
											});
										}
					
										if(cfg.axisText) {
											axis.select('text')
//											.attr('class', function(d, i){
//												var p = getHorizontalPosition(i, 0.5);
//
//												return 'legend ' +
//												((p < 0.4) ? 'left' : ((p > 0.6) ? 'right' : 'middle')) + 
////												((p < 0.4) ? 'middle' : ((p > 0.6) ? 'middle' : 'middle')) + 
//												(d.emphasis ? ' emphasis' : '');
//											})
//											.attr('dy', function(d, i) {
//												var p = getVerticalPosition(i, 0);
//												return ((p < 0.1) ? '1em' : ((p > 0.9) ? '0' : '-1em'));
//											})
											.attr('class', function(d, i){
												var p = getHorizontalPosition(i, 0.5);

												return 'legend ' +
												((p < 0.4) ? 'left' : ((p > 0.6) ? 'right' : 'middle')) + 
												(d.emphasis ? ' emphasis' : '');
											})
											.attr('dy', function(d, i) {
												var p = getVerticalPosition(i, 0.5);
												return ((p < 0.1) ? '1em' : ((p > 0.9) ? '0' : '0.4em'));
											})
											.text(function(d) { return d.name; })
											.attr('x', function(d, i){ 
												var xPosition = getHorizontalPosition(i, 0.5);
												var xSet = 0;
												if (xPosition < 0.45) {
													var xSet = 0 - ( d.length ? d.length : d.name.length * ( cfg.fontwidth ? cfg.fontwidth : 10 ) )
												} else if (xPosition > 0.55) {

													var xSet = 0 + ( d.length ? d.length : d.name.length * ( cfg.fontwidth ? cfg.fontwidth : 10 ) )
												} else {
													xSet = 0;
												}
												return d.xOffset+ (cfg.w/2-radius2)+getHorizontalPosition(i, radius2, cfg.factorLegend) + xSet; 
											})
											.attr('y', function(d, i){ return d.yOffset+ (cfg.h/2-radius2)+getVerticalPosition(i, radius2, cfg.factorLegend); })
											.attr('transform', function() {
												return 'translate(' + cfg.xOffset + ', ' + cfg.yOffset + ')';
											});
										}
									}
					
									// content
									data.forEach(function(d){
										d.axes.forEach(function(axis, i) {
											let iIndex = 0;
											cfg.axes.some(function(currentAxes, index) {
												if (axis.axe === currentAxes.axe) {
													iIndex = index;
													return true;
												} else {
													return false;
												}
											});
											axis.x = (cfg.w/2-radius2)+getHorizontalPosition(iIndex, radius2, (parseFloat(Math.max(axis.value - cfg.minValue, 0))/maxValue)*cfg.factor);
											axis.y = (cfg.h/2-radius2)+getVerticalPosition(iIndex, radius2, (parseFloat(Math.max(axis.value - cfg.minValue, 0))/maxValue)*cfg.factor);
											axis.index = iIndex;
										});
									});
									var polygon = container.selectAll(".area").data(data, cfg.axisJoin);
									
									var polygonType = 'polygon';
									if (cfg.open) {
										polygonType = 'polyline';
									}

									polygon.exit()
									.classed('d3-exit', 1) // trigger css transition
									.transition().duration(cfg.transitionDuration)
									.remove();

									polygon = 
									polygon.enter().append(polygonType)
									.classed('area', 1)
									.classed('d3-enter', 1)
									.on('mouseover', function (dd){
										d3.event.stopPropagation();
										container.classed('focus', 1);
										d3.select(this).classed('focused', 1);
										setTooltip(tooltip, cfg.tooltipFormatClass(dd.classText));
									})
									.on('mouseout', function(){
										d3.event.stopPropagation();
										container.classed('focus', 0);
										d3.select(this).classed('focused', 0);
										setTooltip(tooltip, false);
									})
									.merge(polygon);
							
									
									polygon
									.each(function(d, i) {

										// var classed = {'d3-exit': 0}; // if exiting element is being reused
										// classed['radar-chart-serie' + i] = 1;
										// if(d.className) {
										//   classed[d.className] = 1;
										// }
										// d3.select(this).classed(classed);
										var lSelect = d3.select(this).classed('d3-exit', 0)
										.classed('radar-chart-serie' + i, 1);
										if(d.className) {
											lSelect.classed(d.className, 1);
										}
									})
									// styles should only be transitioned with css
									.style('stroke', function(d, i) { return cfg.color[i];; })
									.style('fill', function(d, i) { return cfg.color[i]; })
									.attr('transform', function() {
										return 'translate(' + cfg.xOffset + ', ' + cfg.yOffset + ')';
									})
									.transition().duration(cfg.transitionDuration)
									// svg attrs with js
									.attr('points',function(d) {
										d.axes.sort(function(a, b) {
											if (a.index < b.index ) {
											    return -1;
											  }
											  if (a.index > b.index ) {
											    return 1;
											  }
										})
										return d.axes.map(function(p) {
											if (p.value === -1) {
												return '';
											} else {
												return [p.x, p.y].join(',');
											}
										}).join(' ');
									})
									.on('start', function() {
										d3.select(this).classed('d3-enter', 0); // trigger css transition
									});
					
									if(cfg.circles && cfg.radius) {
					
										var circleGroups = container.selectAll('g.circle-group').data(data, cfg.axisJoin);
					
										// circleGroups.enter().append('g').classed({'circle-group': 1, 'd3-enter': 1});

										circleGroups.exit()
										.classed('d3-exit', 1) // trigger css transition
										.transition().duration(cfg.transitionDuration).remove();

										circleGroups = circleGroups.enter().append('g')
										.classed('circle-group', 1)
										.classed('d3-enter', 1)
										.merge(circleGroups);
					
										circleGroups
										.each(function(d) {
											// var classed = {'d3-exit': 0}; // if exiting element is being reused
											// if(d.className) {
											//   classed[d.className] = 1;
											// }
											// d3.select(this).classed(classed);
											var lSelect = d3.select(this).classed('d3-exit', 0);
											if(d.className) {
												lSelect.classed(d.className, 1);
											}
										})
										.transition().duration(cfg.transitionDuration)
										.on('start', function() {
											d3.select(this).classed('d3-enter', 0); // trigger css transition
										});
					
										var circle = circleGroups.selectAll('.circle').data(function(datum, i) {
											return datum.axes.map(function(d) { return [d, i]; });
										});
					
										circle.exit()
										.classed('d3-exit', 1) // trigger css transition
										.transition().duration(cfg.transitionDuration).remove();

										circle = 
										circle.enter().append('circle')
										.classed('circle', 1)
										.classed('d3-enter', 1)
										// .classed({circle: 1, 'd3-enter': 1})
										.on('mouseover', function(dd){
											d3.event.stopPropagation();
											setTooltip(tooltip, cfg.tooltipFormatValue(dd[0].value));
											//container.classed('focus', 1);
											//container.select('.area.radar-chart-serie'+dd[1]).classed('focused', 1);
										})
										.on('mouseout', function(dd){
											d3.event.stopPropagation();
											setTooltip(tooltip, false);
											container.classed('focus', 0);
											//container.select('.area.radar-chart-serie'+dd[1]).classed('focused', 0);
											//No idea why previous line breaks tooltip hovering area after hoverin point.
										})
										.merge(circle);

										circle
										.each(function(d) {
											// var classed = {'d3-exit': 0}; // if exit element reused
											// classed['radar-chart-serie'+d[1]] = 1;
											// d3.select(this).classed(classed);
											d3.select(this).classed('d3-exit', 0)
											.classed('radar-chart-serie'+d[1], 1);

										})
										// styles should only be transitioned with css
										.style('fill', function(d) { return cfg.color[d[1]]; })
//										.style('fill', 'white')
//										.style('stroke', function(d) { return cfg.color[d[1]]; })
										.transition().duration(cfg.transitionDuration)
										// svg attrs with js
										.attr('r', function(d) {
											if (d[0].value === -1) {
												return 0;
											} else {
												return cfg.radius
											}
										})
										.attr('cx', function(d) {
											return d[0].x;
										})
										.attr('cy', function(d) {
											return d[0].y;
										})
										.attr('transform', function() {
											return 'translate(' + cfg.xOffset + ', ' + cfg.yOffset + ')';
										})
										.on('start', function() {
											d3.select(this).classed('d3-enter', 0); // trigger css transition
										});
					
										//Make sure layer order is correct
										var poly_node = polygon.node();
										// var poly_node = container.selectAll(".area").node();
										poly_node.parentNode.appendChild(poly_node);
					
										var cg_node = circleGroups.node();
										// var cg_node = container.selectAll('g.circle-group').node();
										cg_node.parentNode.appendChild(cg_node);
					
										// ensure tooltip is upmost layer
										var tooltipEl = tooltip.node();
										// var tooltipEl = container.selectAll('g.tooltip').node();
										tooltipEl.parentNode.appendChild(tooltipEl);

										
										var colorScale = d3.scaleOrdinal()
										.domain(data.map(function(d, i){
											return d.classText;
										}))
										.range(cfg.color);

										let legendPos = (cfg.xOffset + cfg.w/2 + radius) + ",20";
										let legendView = container.append("g")
										.attr("class", "legendOrdinal")
										.attr("transform", "translate( " +  "300,20" + " )");


										//var legend = d3.legendColor().scale(colorScale).labelWrap(150);

										//legendView.call(legend);
										
									}
								});
							}
					
							radar.config = function(value) {
								if(!arguments.length) {
									return cfg;
								}
								if(arguments.length > 1) {
									cfg[arguments[0]] = arguments[1];
								}
								else {
									d3.entries(value || {}).forEach(function(option) {
										cfg[option.key] = option.value;
									});
								}
								return radar;
							};
					
							return radar;
						},
						draw: function(id, d, options) {
							var chart = RadarChart.chart().config(options);
							var cfg = chart.config();
					
							d3.select(id).select('svg').remove();
							d3.select(id)
							.append("svg")
							.attr("width", cfg.w)
							.attr("height", cfg.h)
							.datum(d)
							.call(chart);
						}
					};

				function renderer(oRm, oControl){

					if ( !oControl.getData() || !oControl.getOption()) {
						return;
					}

					var sLengendOptionPos = oControl.getOption().lengendOptionPos;

					var oData = oControl.getData();

					oRm.addClass(RADAR_DIV_OUTER_CLASS);
					oRm.write('<div ');
					
					if (sLengendOptionPos === 'left') {
						var class123 = "sapMFlexBox sapMFlexBoxAlignContentCenter sapMFlexBoxAlignItemsCenter sapMFlexBoxBGTransparent sapMFlexBoxJustifyStart sapMFlexBoxWrapNoWrap sapMFlexItem sapMHBox sapUiSmallMarginBegin";
						oRm.addClass(class123);
						oRm.writeClasses();
					}
						
					
					oRm.writeControlData(oControl);
					
					oRm.write('>');
					if (sLengendOptionPos === 'left') {
						renderLegend(oRm, oControl);
					}
					
					oRm.write('<div id=' + oControl.getId() + "Chart");

					oRm.writeClasses();
					oRm.addStyle('width', oControl.getOption().w + "px");
					oRm.addStyle('height', oControl.getOption().h + "px");
					oRm.writeStyles();
					oRm.write('>');
					

					if (!oData) {
						oRm.write('<div');
						oRm.addClass("ui5-viz-controls-viz-description-title");
						oRm.writeClasses();
						oRm.addStyle('width', oControl.getOption().w + "px");
						oRm.addStyle('line-height', oControl.getOption().h + "px");
						oRm.addStyle('text-align', "center");
						oRm.writeStyles();
						oRm.write('>');
						oRm.write('No Data');
						oRm.write('</div>');
					}

					oRm.write('</div>');
					if (sLengendOptionPos !== 'left') {
						renderLegend(oRm, oControl);
					}
					

					oRm.write('</div>');
				}
				function renderLegend(oRm, oControl) {

					var iLengendOptionCounts = oControl.getOption().lengendOptionCount;

					var oData = oControl.getData();
					if (typeof(oData) == "undefined" || typeof(iLengendOptionCounts) == "undefined") {
//						return;
					} else if ( iLengendOptionCounts > 0 ) {

						oDataPair = Math.ceil(oData.length / iLengendOptionCounts);
						let x = oControl.getOption().w / iLengendOptionCounts;
						let sWidth = 0;
						let sMaxHeight = 0;
						
						oRm.write('<div  id=' + oControl.getId() + 'ChartLegend');

						oRm.addClass('ChartLegendDiv');
						oRm.writeClasses();
						
						if (oControl.getOption().lengendOptionPos === 'left') {
							sWidth = '150';
							sMaxHeight = oControl.getOption().h + 'px'
						} else {
							sWidth = oControl.getOption().w;
							sMaxHeight = '60px';
							
						}
						
						oRm.addStyle('overflow-y', 'initial');
						oRm.addStyle('overflow-x', 'visible');
						oRm.addStyle('max-height', sMaxHeight);
						oRm.writeStyles();
						oRm.addClass('sapUiTinyMarginBottom');
						oRm.writeClasses();
						
						oRm.writeStyles();
						oRm.write('>');
						oRm.write('<svg ');
						oRm.writeAttribute('width', sWidth);
						oRm.writeAttribute('height', oDataPair * 17);
						oRm.writeAttribute('display', 'flex');
						oRm.addStyle('overflow', 'visible');
						oRm.writeStyles();
						oRm.write('>');
						
						//write legend
						for(var iIndex = 0; iIndex < oData.length; iIndex++) {
							var iXOffset = iIndex % iLengendOptionCounts
							var iYOffset = Math.floor(iIndex / iLengendOptionCounts) * 17
							
							var iGOffsetX = iXOffset * oControl.getOption().w / iLengendOptionCounts
							
							oRm.write('<g ');

							oRm.writeAttribute('width', sWidth / iLengendOptionCounts);
							oRm.addClass('sapUiTinyMargin chartlegend');
							oRm.writeClasses();
							oRm.writeAttribute('transform', 'translate(' + iGOffsetX + ',' + iYOffset +')');
//							oRm.writeAttribute('x', iGOffsetX);
//							oRm.writeAttribute('y', iYOffset);

							oRm.addStyle('cursor', 'pointer');
							oRm.writeStyles();
							oRm.write('>');
							oRm.write('<rect');
							oRm.writeAttribute('width', sWidth / iLengendOptionCounts);
							oRm.writeAttribute('height', 17);
							oRm.writeAttribute('fill', "none");
							oRm.writeClasses();
							oRm.write('>');
							oRm.write('</rect>');
							
							if (oData[iIndex]["classText"] === "Average") {

								//Average
								oRm.write('<line ');
								oRm.writeAttribute('x1', 0);
								oRm.writeAttribute('y1', 8);
								oRm.writeAttribute('x2', 16);
								oRm.writeAttribute('y2', 8);
								let lineStyle = "stroke:" + oData[iIndex].classColor + ";stroke-width:6"
								oRm.writeAttribute('style', lineStyle);
								oRm.write('>');
								oRm.write('</line>');
							} else {

								//Not Average
								oRm.write('<line ');
								oRm.writeAttribute('x1', 0);
								oRm.writeAttribute('y1', 8);
								oRm.writeAttribute('x2', 16);
								oRm.writeAttribute('y2', 8);
								let lineStyle = "stroke:" + oData[iIndex].classColor + ";stroke-width:2"
								oRm.writeAttribute('style', lineStyle);
								oRm.write('>');
								oRm.write('</line>');
								oRm.write('<circle ');
								oRm.writeAttribute('r', 4);
								oRm.writeAttribute('cx', 8);
								oRm.writeAttribute('cy', 8);
								oRm.addStyle('fill', oData[iIndex].classColor);
								oRm.writeStyles();
								oRm.write('>');
								oRm.write('</circle>');
							}
							
							
							oRm.write('<text');
							oRm.writeAttribute('transform', 'translate( 25, 12.5)');
							oRm.addStyle('font-size', '12px');
							oRm.addStyle('text-overflow', 'ellipsis');
							oRm.writeStyles();
							oRm.writeAttribute('inline-size', '50');
//							oRm.writeAttribute('textLength', '70');
							oRm.write('>');
//							oRm.write('<tspan');
							oRm.write(oData[iIndex].classText);
							oRm.write('</text>');

							oRm.write('</g>');
						}
						oRm.write('</svg>');
						oRm.write('</div>');
					}
				}
				function rerender(){

					
					onAfterRendering.apply(this);
				}
				function setLegendTooltip(tooltip, msg, iLengendX){
					if(msg === false || msg == undefined){
						tooltip.classed("visible", 0);
						tooltip.select("rect").classed("visible", 0);
					}else{
						tooltip.classed("visible", 1);
		
						var container = tooltip.node().parentNode;
						var coords = d3.mouse(container);
						
						tooltip.select("text").classed('visible', 1).style("fill", "white");
						var padding=5;
						var bbox = tooltip.select("text").text(msg).node().getBBox();
						

						let iTooltipX = 0;
						if (iLengendX === 0) {
							iTooltipX = 0;
						} else {
							iTooltipX = 0 - bbox.width - padding;
						}
						
						let x = bbox.x - bbox.width;
//						oRm.writeAttribute('transform', 'translate(' + x + , 12.5)');
						tooltip.select("text").attr("x", 0).attr("x", iTooltipX);
						
						tooltip.select("rect")
						.classed('visible', 1).attr("x", 0)
						.attr("x", bbox.x - padding)
						.attr("y", bbox.y - padding)
						.attr("width", bbox.width + (padding*2))
						.attr("height", bbox.height + (padding*2))
						.attr("rx","5").attr("ry","5")
						.style("fill", "#555").style("opacity", "1");
						tooltip.attr("transform", "translate(" + (coords[0]+10) + "," + (coords[1]-10) + ")")
					}
				}
				function onAfterRendering(){
					
					RadarChart.draw('#' + this.getId() + "Chart", this.getData(), this.getOption());

					
					var oChartPolygon = d3.select('#' + this.getId() + "Chart").selectAll("polygon");
					var oCircleGroup = d3.select('#' + this.getId() + "Chart").selectAll(".circle-group");
					var oChart = d3.select('#' + this.getId() + "Chart").select('svg');
					
					oCircleGroup.style("visibility",function(d){
						if (d.classText === "Average") {
						return "hidden";
						}
					});
					
					/////////////////////////////
					var oChartLegend = d3.select('#' + this.getId() + "ChartLegend").select('svg');
					var tooltip = oChartLegend.selectAll('g.tooltip').data([this.getData()[0]]);
	
					var tt = tooltip.enter()
					.append('g')
					.classed('tooltip', true);
	
					tt.append('rect').classed("tooltip", true);
					tt.append('text').classed("tooltip", true);

					tooltip = tt.merge(tooltip);
					///////////////////////////////////

//					d3.select('#' + this.getId()).selectAll(".chartlegend")
					d3.select('#' + this.getId()).selectAll(".chartlegend").data(this.getData())
					.on('mouseover', function (dd){
						d3.event.stopPropagation();
						//container.classed('focus', 1);
						oChart.classed('focus', 1);
						for (var i = 0; i<oChartPolygon._groups[0].length; i++) {

							if (oChartPolygon._groups[0][i].__data__.classId === dd.classId) {
								this.childNodes[0].classList.add('focused');
								oChartPolygon._groups[0][i].classList.add('focused');
							}
						}
//						oChartPolygon.classed('focused', 1);
						let iLengendX = d3.select(this).node().getCTM().e;
						setLegendTooltip(tooltip, dd.classText, iLengendX);
					})
					.on('mouseout', function(dd){
						d3.event.stopPropagation();
						//container.classed('focus', 0);
						oChart.classed('focus', 0);
						for (var i = 0; i<oChartPolygon._groups[0].length; i++) {
							if (oChartPolygon._groups[0][i].__data__.classId === dd.classId) {
								this.childNodes[0].classList.remove('focused');
								oChartPolygon._groups[0][i].classList.remove('focused');
							}
						}
						setLegendTooltip(tooltip, false);
					})
					.on('click', function(dd){
						d3.event.stopPropagation();
						//container.classed('focus', 0);
						oChart.classed('focus', 0);
						for (var i = 0; i<oChartPolygon._groups[0].length; i++) {

							if (oChartPolygon._groups[0][i].__data__.classId === dd.classId) {
								this.childNodes[0].classList.toggle('clickhidden');
								oChartPolygon._groups[0][i].classList.toggle('clickhidden');
								oCircleGroup._groups[0][i].classList.toggle('clickhidden');
							}
						}
						
						setLegendTooltip(tooltip, false);
					}).each(function(aData,aIndex) {
						let iRectWidth = d3.select(this).select("rect").node().getBBox().width;
						let oTextSVG = d3.select(this).select("text").node();
						let iTextWidth = oTextSVG.getBBox().width;
						let iTextProWidth = iRectWidth - 60;
						let iPrecent = iTextProWidth / iTextWidth;
						if (iPrecent <= 1) {
							let iTextNumber = parseInt(iPrecent * aData.classText.length);
							d3.select(this).select("text").text(aData.classText.substr(0,iTextNumber) + "...");
						}
						
					});
				}
				return Control.extend(THIS_MODULE_NAME, {
						metadata: {
							library: THIS_LIBRARY_NAME,
							properties: {
								data: {
									type: 'object'
								},
								option: {
									type: 'object'
								}
							},
							events: {
							}
						},
						renderer: renderer,
						onAfterRendering: onAfterRendering
				});
		}
);
