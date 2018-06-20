sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/pwaa/util/formatter",
],
function(Controller, JSONModel, Formatter) {
	"use strict";
	return Controller.extend("sap.pwaa.controller.ZZBaseController", {
		oFormatter: Formatter,  // Formatter is an object instead of function
		
		onShowHelpContent: function(aEvent) {
			"use strict";
			// create popover
			let sPos = "Right";
			let oIcon = aEvent.getSource();
			let oCustomData = oIcon.getCustomData();
			let sText = oCustomData[0].getValue();
			
			if(oCustomData.length >= 2) {
				sPos = oCustomData[1].getValue();
			}
			
			if (! this._oPopover) {
				this._oPopover = sap.ui.xmlfragment("sap.pwaa.view.ZZHelpContent", this);
			}
			this._oPopover.setModel(new JSONModel({
				helpContent: sText
			}));
			jQuery.sap.delayedCall(0, this, function () {
				this._oPopover.setPlacement(sPos);
				this._oPopover.openBy(oIcon);
			});
		},
		/**
         * @param _scaleA
         *    d3 linear scale
         *
         * @param _scaleB
         *    d3 linear scale
         */
        sync: function(_scaleA, _scaleB) {

            var domainArrayA = _scaleA.getDomain();
            var domainArrayB = _scaleB.getDomain();

            if ((domainArrayA[0] > domainArrayA[1] && domainArrayB[0] < domainArrayB[1]) ||
                (domainArrayA[0] < domainArrayA[1] && domainArrayB[0] > domainArrayB[1]) ||
                (domainArrayA[0] < 0 && domainArrayA[1] < 0) ||
                (domainArrayB[0] < 0 && domainArrayB[1] < 0) ||
                (domainArrayA[0] > 0 && domainArrayA[1] > 0) ||
                (domainArrayB[0] > 0 && domainArrayB[1] > 0)
            ) {
                //we do not need to do anythings to support this "dual"
                return;
            }

            //now make sure 
            //1. same tickNum before 0
            //2. same tickNum after 0
            var positiveTickNumA = 0;
            var negativeTickNumA = 0;

            var positiveTickNumB = 0;
            var negativeTickNumB = 0;

            var tickNumA = _scaleA.tickNum; //tickNumA >= const_minTickNum
            var tickNumB = _scaleB.tickNum; //tickNumB >= const_minTickNum

            var intervalA = (domainArrayA[1] - domainArrayA[0]) / (tickNumA - 1);
            intervalA = NumberUtils.preciseSimple(intervalA);
            var i, tickValue, moreInterNum;
            for (i = 0; i < tickNumA; i++) {
                tickValue = NumberUtils.preciseSimple(domainArrayA[0] + i * intervalA);
                if (tickValue > 0) {
                    positiveTickNumA++;
                } else if (tickValue < 0) {
                    negativeTickNumA++;
                }
            }

            var intervalB = (domainArrayB[1] - domainArrayB[0]) / (tickNumB - 1);
            intervalB = NumberUtils.preciseSimple(intervalB);

            for (i = 0; i < tickNumB; i++) {
                tickValue = NumberUtils.preciseSimple(domainArrayB[0] + i * intervalB);
                if (tickValue > 0) {
                    positiveTickNumB++;
                } else if (tickValue < 0) {
                    negativeTickNumB++;
                }
            }

            if (positiveTickNumA > positiveTickNumB) {
                moreInterNum = positiveTickNumA - positiveTickNumB;
                if (domainArrayB[0] < domainArrayB[1]) {
                    domainArrayB[1] += (moreInterNum * Math.abs(intervalB));
                    _scaleB.tickNum += moreInterNum;
                } else if (domainArrayB[0] > domainArrayB[1]) {
                    domainArrayB[0] += (moreInterNum * Math.abs(intervalB));
                    _scaleB.tickNum += moreInterNum;
                }
            } else if (positiveTickNumA < positiveTickNumB) {
                moreInterNum = positiveTickNumB - positiveTickNumA;
                if (domainArrayA[0] < domainArrayA[1]) {
                    domainArrayA[1] += (moreInterNum * Math.abs(intervalA));
                    _scaleA.tickNum += moreInterNum;
                } else if (domainArrayA[0] > domainArrayA[1]) {
                    domainArrayA[0] += (moreInterNum * Math.abs(intervalA));
                    _scaleA.tickNum += moreInterNum;
                }
            }

            //negative values
            if (negativeTickNumA > negativeTickNumB) {
                moreInterNum = negativeTickNumA - negativeTickNumB;
                if (domainArrayB[0] < domainArrayB[1]) {
                    domainArrayB[0] -= (moreInterNum * Math.abs(intervalB));
                    _scaleB.tickNum += moreInterNum;
                } else if (domainArrayB[0] > domainArrayB[1]) {
                    domainArrayB[1] -= (moreInterNum * Math.abs(intervalB));
                    _scaleB.tickNum += moreInterNum;
                }
            } else if (negativeTickNumA < negativeTickNumB) {
                moreInterNum = negativeTickNumB - negativeTickNumA;
                if (domainArrayA[0] < domainArrayA[1]) {
                    domainArrayA[0] -= (moreInterNum * Math.abs(intervalA));
                    _scaleA.tickNum += moreInterNum;
                } else if (domainArrayA[0] > domainArrayA[1]) {
                    domainArrayA[1] -= (moreInterNum * Math.abs(intervalA));
                    _scaleA.tickNum += moreInterNum;
                }
            }

            //to nice the domainArray, avoid the domain contains 0.00060000001
            domainArrayA[0] = NumberUtils.preciseSimple(domainArrayA[0]);
            domainArrayA[1] = NumberUtils.preciseSimple(domainArrayA[1]);
            domainArrayB[0] = NumberUtils.preciseSimple(domainArrayB[0]);
            domainArrayB[1] = NumberUtils.preciseSimple(domainArrayB[1]);

            _scaleA.setDomain(domainArrayA);
            _scaleB.setDomain(domainArrayB);

            _scaleA.setTickHint(_scaleA.tickNum - 1);
            _scaleB.setTickHint(_scaleB.tickNum - 1);
        }

	})
});