/// <reference path="../../../../../td/ui5/jQuery.d.ts" />.
/// <reference path="../../../../../td/ui5/sap.m.d.ts" />.
/// <reference path="../../../../../td/ui5/sap.ui.d.ts" />.

sap.ui.define(
    ['sap/ui/core/Control',
     'sap/ab/thirdParty/d3'
    ],
    function(Control, d3){
        const THIS_MODULE_NAME = 'sap.ab.graph.GaugeChart';
        const THIS_LIBRARY_NAME = 'sap.ab.graph';
        let oGauge;
        let gauge = function(container, configuration) {
            var that = {};
            var config = {
                size						: 200,
                clipWidth					: 200,
                clipHeight					: 110,
                ringInset					: 20,
                ringWidth					: 20,
                pointerWidth				: 10,
                pointerTailLength			: 2,
                pointerHeadLengthPercent	: 0.7,
                minValue					: 0,
                maxValue					: 2,
                
                minAngle					: -90,
                maxAngle					: 90,
                
                transitionMs				: 1000,
                
                labelFormat					: d3.format('.0%'),
                labelInset					: 10,
                backgroundColor             : 'transparent',
                arcColorFn					: d3.interpolateHsl(d3.rgb('#e8e2ca'), d3.rgb('#3e6c0a'))
            };
            var range = undefined;
            var r = undefined;
            var pointerHeadLength = undefined;
            var value = 0;
            
            var svg = undefined;
            var arc = undefined;
            var scale = undefined;
            var ticks = [];
            var tickData = [];
            let colors = [];
            let colorScale = undefined;
            var pointer = undefined;
        
            var donut = d3.pie();
            
            function deg2rad(deg) {
                return deg * Math.PI / 180;
            }
            
            function newAngle(d) {
                var ratio = scale(d);
                var newAngle = config.minAngle + (ratio * range);
                return newAngle;
            }
            
            function configure(configuration) {
                var prop = undefined;
                for ( prop in configuration ) {
                    config[prop] = configuration[prop];
                }
                
                range = config.maxAngle - config.minAngle;
                r = config.size / 2;
                pointerHeadLength = Math.round(r * config.pointerHeadLengthPercent);
                

                
                // a linear scale that maps domain values to a percent from 0..1
                scale = d3.scaleLinear()
                    .range([0,1])
                    .domain([config.minValue, config.maxValue]);

                let latestTick = config.minValue;
                let tickText = [];
                ticks.push(config.minValue);
                config.thresholds.forEach(function(d){
                    ticks.push(d.value);
                    tickData.push({
                        from: scale(latestTick),
                        to: scale(d.value)
                    });
                    tickText.push(d.text);
                    colors.push(d.color);
                    latestTick = d.value;
                });
                // ticks = scale.ticks(config.majorTicks);
                // tickData = d3.range(config.majorTicks).map(function() {return 1/config.majorTicks;});

                colorScale = d3.scaleOrdinal()
                .domain(tickText)
                .range(colors);

                arc = d3.arc()
                    .innerRadius(r - config.ringWidth - config.ringInset)
                    .outerRadius(r - config.ringInset)
                    .startAngle(function(d, i) {
                        // var ratio = d * i;
                        // return deg2rad(config.minAngle + (ratio * range));
                        return deg2rad(config.minAngle + d.from * range);
                    })
                    .endAngle(function(d, i) {
                        // var ratio = d * (i+1);
                        // return deg2rad(config.minAngle + (ratio * range));
                        return deg2rad(config.minAngle + d.to * range);
                    });
            }
            that.configure = configure;
            
            function centerTranslation() {
                return 'translate('+r +','+ r +')';
            }
            
            function isRendered() {
                return (svg !== undefined);
            }
            that.isRendered = isRendered;
            
            function render(newValue) {
                let clipHeight = config.clipHeight / 2;
                svg = d3.select(container)
                    .append('svg:svg')
                        .attr('class', 'gauge')
                        .attr('width', config.clipWidth)
                        .attr('height', clipHeight);

                var bgLayer = svg.append('rect')
                            .attr('x', '0')
                            .attr('y', '0')
                            .attr('width', config.clipWidth)
                            .attr('height', clipHeight)
                            .attr('fill', config.backgroundColor);
                
                var centerTx = centerTranslation();
                
                var arcs = svg.append('g')
                        .attr('class', 'arc')
                        .attr('transform', centerTx);
                
                arcs.selectAll('path')
                        .data(tickData)
                        .enter().append('path')
                        .attr('fill', function(d, i) {
                            return colors[i];
                            // return config.arcColorFn(d * i);
                        })
                        .attr('d', arc);
                
                var lg = svg.append('g')
                        .attr('class', 'label')
                        .attr('transform', centerTx);
                lg.selectAll('text')
                        .data(ticks)
                    .enter().append('text')
                        .attr('transform', function(d) {
                            var ratio = scale(d);
                            var newAngle = config.minAngle + (ratio * range);
                            return 'rotate(' +newAngle +') translate(0,' +(config.labelInset - r) +')';
                        })
                        .text(config.labelFormat);
        
                var lineData = [ [config.pointerWidth / 2, 0], 
                                [0, -pointerHeadLength],
                                [-(config.pointerWidth / 2), 0],
                                [0, config.pointerTailLength],
                                [config.pointerWidth / 2, 0] ];
                // var pointerLine = d3.line().curve('monotone');
                var pointerLine = d3.line().curve(d3.curveMonotoneX);
                var pg = svg.append('g').data([lineData])
                        .attr('class', 'pointer')
                        .attr('transform', centerTx);
                        
                pointer = pg.append('path')
                    .attr('d', pointerLine/*function(d) { return pointerLine(d) +'Z';}*/ )
                    .attr('transform', 'rotate(' +config.minAngle +')');

                let legendPos = (config.size + 10) + ",20";
                let legendView = svg.append("g")
                .attr("class", "legendOrdinal")
                .attr("transform", "translate( "+  legendPos + " )");

                var legend = d3.legendColor().scale(colorScale).labelWrap(30);
                legendView.call(legend);

                update(newValue === undefined ? 0 : newValue);
            }
            that.render = render;
            
            function update(newValue, newConfiguration) {
                if ( newConfiguration  !== undefined) {
                    configure(newConfiguration);
                }
                var ratio = scale(newValue.value);
                var newAngle = config.minAngle + (ratio * range);
                pointer.transition()
                    .duration(config.transitionMs)
                    .ease(d3.easeElastic)
                    .attr('transform', 'rotate(' +newAngle +')');
            }
            that.update = update;
        
            configure(configuration);
            
            return that;
        };
        function onAfterRendering(){
            oGauge = gauge('#' + this.getId(), this.getOption());
            oGauge.render(this.getData()[0]);
        }
        function renderer(oRm, oControl){
            oRm.addClass("GaugeDiv");
            oRm.write('<div ');
            oRm.writeControlData(oControl);
            oRm.writeClasses();
            oRm.write('>');
            oRm.write('</div>');
        }
        function rerender(){
            oGauge.update(this.getData()[0]);
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