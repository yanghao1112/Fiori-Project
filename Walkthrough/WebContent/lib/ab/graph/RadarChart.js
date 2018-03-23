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
											name: i.axis, 
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
										.attr('x', function(d, i){ return getHorizontalPosition(4, d, cfg.factorLegend); })
										.attr('dx', '0.5em')
										.attr('dy', '1em')
										.attr('class', 'legend left')
										.attr('transform', function(levelFactor) {
											return 'translate(' + (cfg.xOffset+cfg.w/2-levelFactor) + ', ' + (cfg.yOffset+cfg.h/2-levelFactor) + ')';
										})
										.text(function(d, i) {
											return cfg.minValue + maxValue * (i + 1) / cfg.levels; 
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
											.attr('class', function(d, i){
												var p = getHorizontalPosition(i, 0.5);

												return 'legend ' +
												((p < 0.4) ? 'left' : ((p > 0.6) ? 'right' : 'middle')) + 
//												((p < 0.4) ? 'middle' : ((p > 0.6) ? 'middle' : 'middle')) + 
												(d.emphasis ? ' emphasis' : '');
											})
											.attr('dy', function(d, i) {
												var p = getVerticalPosition(i, 0.5);
												return ((p < 0.1) ? '1em' : ((p > 0.9) ? '0' : '-1em'));
											})
											.text(function(d) { return d.name; })
											.attr('x', function(d, i){ return d.xOffset+ (cfg.w/2-radius2)+getHorizontalPosition(i, radius2, cfg.factorLegend); })
											.attr('y', function(d, i){ return d.yOffset+ (cfg.h/2-radius2)+getVerticalPosition(i, radius2, cfg.factorLegend); })
											.attr('transform', function() {
												return 'translate(' + cfg.xOffset + ', ' + cfg.yOffset + ')';
											});
										}
									}
					
									// content
									data.forEach(function(d){
										d.axes.forEach(function(axis, i) {
											axis.x = (cfg.w/2-radius2)+getHorizontalPosition(i, radius2, (parseFloat(Math.max(axis.value - cfg.minValue, 0))/maxValue)*cfg.factor);
											axis.y = (cfg.h/2-radius2)+getVerticalPosition(i, radius2, (parseFloat(Math.max(axis.value - cfg.minValue, 0))/maxValue)*cfg.factor);
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
										return d.axes.map(function(p) {
											return [p.x, p.y].join(',');
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
										.transition().duration(cfg.transitionDuration)
										// svg attrs with js
										.attr('r', cfg.radius)
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
										.attr("class", "legendOrdinal");
//										.attr("transform", "translate( " +  "300,20" + " )");


										var legend = d3.legendColor().scale(colorScale).labelWrap(30);

										legendView.call(legend);
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
						oRm.addClass(RADAR_DIV_OUTER_CLASS);
						oRm.write('<div ');
						oRm.writeControlData(oControl);
						oRm.writeClasses();
						oRm.addStyle('width', oControl.getOption().w);
						oRm.addStyle('height', oControl.getOption().h);
						oRm.writeStyles();
						oRm.write('>');
						oRm.write('</div>');
				}
				function rerender(){
						onAfterRendering.apply(this);
				}
				function onAfterRendering(){
						RadarChart.draw('#' + this.getId(), this.getData(), this.getOption());
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
						rerender: rerender,
						onAfterRendering: onAfterRendering
				});
		}
);
