sap.ui.define([ "sap/ui/core/mvc/Controller", "sap/m/MessageToast",
		"sap/ui/model/json/JSONModel","sap/ui/core/IconPool", "sap/ui/core/Popup",
		"sap/m/Image"], function(Controller, MessageToast,
		JSONModel, IconPool, Popup, Image) {
	return Controller.extend("sap.ui.demo.wt.controller.App", {
//		sortArray: function(array, keys) {
//			var keysAry = keys.split(',');
//			array.sort(function(a,b) {
////				var aAry = keysAry.map(function(item, index) {
////					return a[item] ? a[item] : "";
////				})
////				var bAry = keysAry.map(function(item, index) {
////					return b[item] ? b[item] : "";
////				})
//				for (var i = 0; i < keysAry.length; i++) {
//					if (this.compare(a[keysAry[i]],b[keysAry[i]])) {
//						return false;
//					}
//				}
//				return true;
//			}.bind(this))
//			return array;
//		},
//		compare: function(a,b) {
//			if (a < b) {
//				return true;
//			} else if (a === b) {
//				return false;
//			}
//		},
		onInit : function() {
			var array = [1,2,3,4,5,6,7];
			
//			var array2 = [...array];
			
//			var x = new Date("2018-01-01");
//			var xx = {x:x};
//			var yy = $.extend(true,{},xx)
//			jQuery.sap.equal(yy, xx)
//			x.setFullYear(2100,0,14);
//			
//			function getFullName({ firstName, lastName }) {
//			    return '${firstName} ${lastName}';
//			}
//			var zz = getFullName({firstName:123, lastName:324});
//			console.log(zz);
			
//			var array = [{
//				x1:1,
//				x2:"abc",
//				x3:265
//			},{
//				x1:10,
//				x2:"abc",
//				x3:265
//			},{
//				x1:2,
//				x2:"abc",
//				x3:265
//			},{
//				x1:1,
//				x2:"abcd",
//				x3:265
//			}]
//			this.sortArray(array,"x1,x2")
			
//			Function.prototype.before = function( beforefn ) {
//				var __self = this;
//				return function() {
//					beforefn.apply( this, arguments );
//					return __self.apply( this, arguments );
//				}
//			}
//			Function.prototype.after = function( afterfn ) {
//				var __self = this;
//				return function() {
//					var ret = __self.apply( this, arguments );
//					afterfn.apply( this, arguments );
//					return ret;
//				}
//			}
//			var func = function(){
//				console.log(2)
//			};
//			func = func.before(function(){
//
//				console.log(1)
//			}).after(function(){
//
//				console.log(3)
//			})
//			
//			func();
			
//			var currying = function(fn) {
//				var args = [];
//				
//				return function(){
//					if (arguments.length === 0){
//						return fn.apply(this,args)
//					} else {
//						[].push.apply(args, arguments);
//						
//						return arguments.callee; //not in "use strict"; mode
//					} 
//				}
//			}
//			
//			var cost = (function(){
//				var money = 0;
//				
//				return function() {
//					for (var i = 0, l = arguments.length; i < l; i++) {
//						money += arguments[i]
//					}
//					return money;
//				}
//			})();
//			
//			var cost = currying(cost);
//			
//			cost(100);
//			cost(200);
//			cost(300);
//			
//			/*
//			 * with return arguments.callee;
//			 * it return the function itself
//			 * so we can make also cost like below
//			 * cost(100)(200)(300);
//			 */
//			
//			alert( cost() );
			
			
	/*
	 * 单例模式
	 */
//			//单例管理
//			var getSingle = function(fn) {
//				var result;
//				return function(){
//					return result || (result = fn.apply(this, arguments))
//				}
//			};
//			//业务逻辑
//			var createLoginLayer = function(){
//				var xxx = 1;
//				return xxx;
//			}
//			var createLoginLayer2 = function(){
//				var yyy = 2;
//				return yyy;
//			}
//			
//			var create1 = getSingle(createLoginLayer);
//			var create2 = getSingle(createLoginLayer2);
//			
//			var t1 = create1();
//			var t2 = create1();
//			var t3 = create2();
//			var t4 = create2();
//			var t5 = create1();
//			var t6 = create2();
			
	/*
	 * 表单校验的策略模式
	 */
			/********************策略对象********************************/
			var strategies = {
					isNonEmpty: function(value, errorMsg) {
						if(value === '') {
							return errorMsg;
						}
					},
					minLength: function(value, length, errorMsg) {
						if (value.length < length) {
							return errorMsg;
						}
					},
					isMobile: function( value, errorMsg) {
						if (!/(^1[3|5|8][0-9]{9}$)/.test(value)){ 
							return errorMsg;
						}
					}
			}
			
			/***********************Validator 类*************************************/
			var Validator = function() {
				this.cache=[];
			}
			Validator.prototype.add = function(value, rules) {
				var self = this;
				for(var i=0, rule; rule = rules[i++];) {
					(function(rule){
						var strategyAry = rule.strategy.split(':');
						var errorMsg = rule.errorMsg;
						
						self.cache.push(function(){
							var strategy = strategyAry.shift();
							strategyAry.unshift(value);
							strategyAry.push(errorMsg);
							return strategies[ strategy ].apply( value, strategyAry);
						})
					})(rule)
				}
			}
			
			Validator.prototype.start = function(){
				var errorMsgAry = []
				for(var i=0, validatorFunc; validatorFunc = this.cache[i++];){
					var errorMsg = validatorFunc();
					if (errorMsg) {
						errorMsgAry.push(errorMsg);
					}
				}

				return errorMsgAry;
			}

			/***********************客户调用代码*************************************/
			
			var validataFunc = function() {
				var validator = new Validator();   //创建一个validator对象
				
				/********************添加一些校验规则*********************/
				validator.add("UserName",[{
					strategy: "isNonEmpty",
					errorMsg: "can\'t be Empty"
				}, {
					strategy: "minLength:10",
					errorMsg: "Length should be Less than 10"
				}]);
				validator.add("PasswordValue",[{
					strategy: "minLength:16",
					errorMsg: "Length should be Less than 16"
				}]);
			
				validator.add("1306288AA89",[{
					strategy: 'isMobile',
					errorMsg: 'Wrong mobile number'
				}]);
				
				var errormsg = validator.start();
				return errormsg;
			};
			
			var x = validataFunc();
		},
		
		/*
		 * 代理模式  图片缓存
		 */
		onLoad: function(oControlEvent) {
			var Image = oControlEvent.getSource();
			var cacheImage = new window.Image;
			
			//get src by image.getObjectBinding(sModelName)
			cacheImage.src = "https://ss1.bdstatic.com/kvoZeXSm1A5BphGlnYG/newmusic/yaogun.png?v=md5";
			
			cacheImage.onload = function() {
				Image.setSrc(this.src);
			}
		}
		
		

	});
});
