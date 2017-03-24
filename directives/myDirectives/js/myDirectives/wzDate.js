angular.module("wz.date",[]).
directive("wzDate", ["$document",function($document){
	/*日期转换成字符串*/
	var formart = function(d, f){
		if(!d || !f){
			return "";
		}
		var o = { "M+": d.getMonth()+1, "d+": d.getDate(),
			"h+": d.getHours()%12 == 0 ? 12 : d.getHours()%12, "H+": d.getHours(),
			"m+": d.getMinutes(), "s+": d.getSeconds(), "S+": d.getMilliseconds()
		};
		var week = {"0":"\u65e5", "1":"\u4e00","2":"\u4e8c","3":"\u4e09","4":"\u56db","5":"\u4e94","6":"\u516d"};
		if(/(y+)/.test(f)){
			f = f.replace(RegExp.$1, (d.getFullYear()+"")).substring(4-RegExp.$1.length);
		}
		if(/(E+)/.test(f)){
			f = f.replace(RegExp.$1,((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "\u661f\u671f" : "\u5468"):"")) + week[d.getDay()+""];
		}
		for(var i in o){
			if(new RegExp("("+i+")").test(f)){
				f = f.replace(RegExp.$1,(RegExp.$1.length==1) ? (o[i]) : (("00"+ o[i]).substr((""+ o[i]).length)));
			}
		}
		return f;
	};
	/*字符创转换成日期*/
	var parse_ = function(s, f){
		if(!s || !f){
			return undefined;
		}
		var now = new Date();
		/*主要获取年月日时分秒*/
		var y,mm,d,h,m,ss,yN,mmN,dN,hN,mN,sN;
		if(/(y+)/.test(f)){
			var yIndex = f.indexOf(RegExp.$1);
			var ylength = RegExp.$1.length;
			y = s.substr(yIndex, ylength);
			if(ylength < 4){
				y = (now.getFullYear()+"").substr(0, (4-ylength)) + y;
			}
			if(isNaN(y)){
				throw new Error("年份有误");
			}
			yN = parseInt(y);
		}
		if(/(M+)/.test(f)){
			var mmIndex = f.indexOf(RegExp.$1);
			var mmlength = RegExp.$1.length;
			if(mmlength > 2){
				throw new Error("月份格式有误，最多两位，如：MM -> 03, M -> 3");
			}
			mm = s.substr(mmIndex, mmlength);
			if(isNaN(mm)){
				throw new Error("月份有误，最多两位，如：MM -> 03, M -> 3");
			}
			mmN = parseInt(mm);
			if(mmN > 12 || mmN < 1){
				throw new Error("月份有误");
			}
		}
		if(/(d+)/.test(f)){
			var dIndex = f.indexOf(RegExp.$1);
			var dlength = RegExp.$1.length;
			if(dlength > 2){
				throw new Error("日期格式有误,最多两位,如：dd->09, d->9");
			}
			d = s.substr(dIndex, dlength);
			if(isNaN(d)){
				throw new Error("日期有误,最多两位,如：dd->09, d->9");
			}
			dN = parseInt(d);
			var odd = [1,3,5,7,8,10,12];
			var even = [4,6,8,11];
			if((mmN == 2 && dN > 29)||(odd.indexOf(mmN) != -1 && dN > 31)||(even.indexOf(mmN) != -1 && dN > 30)){
				throw new Error("日期有误");
			}
		}
		if(/(H+)|(h+)/.test(f)){
			if(RegExp.$1 && RegExp.$2){
				throw new Error("小时有误格式,HH或hh, Hh错误");
			}
			var reg,add;
			if(RegExp.$1){
				reg = RegExp.$1;
			} else if(RegExp.$2){
				reg = RegExp.$2;
			}
			h = s.substr(f.indexOf(reg), reg.length);
			if(isNaN(h)){
				throw new Error("小时有误格式,HH->09, H->9");
			}
			hN = parseInt(h);
			if(hN > 23 || hN < 0){
				throw new Error("小时格式");
			}
		}
		if(/(m+)/.test(f)){
			var mIndex = f.indexOf(RegExp.$1);
			var mlength = RegExp.$1.length;
			if(mlength > 2){
				throw new Error("分钟格式有误");
			}
			m = s.substr(mIndex, mlength);
			if(isNaN(m)){
				throw new Error("分钟有误");
			}
			mN = parseInt(m);
			if(mN > 59 || mN < 0){
				throw new Error("分钟错误");
			}
		}
		if(/(s+)/.test(f)){
			var sIndex = f.indexOf(RegExp.$1);
			var slength = RegExp.$1.length;
			if(slength > 2){
				throw new Error("秒钟格式有误");
			}
			ss = s.substr(sIndex, slength);
			if(isNaN(ss)){
				throw new Error("秒钟有误");
			}
			sN = parseInt(ss);
			if(sN > 59 || sN < 0){
				throw new Error("秒钟错误");
			}
		}
		if(yN) now.setFullYear(yN);
		if(mmN) now.setMonth(mmN-1);
		if(dN) now.setDate(dN);
		if(hN || hN == 0) now.setHours(hN);
		if(mN || mN == 0) now.setMinutes(mN);
		if(sN || sN == 0) now.setSeconds(sN);
		return now;
	};
	/*初始化参数*/
	var buildParam = function(scope, param){
		scope.isShowTime = param.isShowTime || true;
		scope.pattern =  param.pattern || scope.isShowTime?"yyyy-MM-dd HH:mm:ss":"yyyy-MM-dd";
//		scope.defaultDate = parse_(param.defalutVal, scope.pattern) || undefined; 	// 日期格式的值
		scope.maxyear = param.maxyear || 2035;
		scope.minyear = param.minyear || 1970;
		scope.inputCls = param.inputCls || "input comm",
		scope.timeUsePicker = param.timeUsePicker || true;
		scope.mthOptions = [1,2,3,4,5,6,7,8,9,10,11,12];
		scope.yearOptions = [];
		for(var i = scope.minyear; i <= scope.maxyear; i++){
			scope.yearOptions.push(i);
		}
		scope.weekOptions = ["日", "一", "二", "三", "四", "五", "六"];
		
		scope.showAll = false;
		scope.yOptionsShow = false;
		scope.mthOptionsShow = false;
		scope.scrollTime = 0;
	};
	var setShowDate = function(showDate){
		return setDate(showDate.y, showDate.mth-1, showDate.d, showDate.h, showDate.m, showDate.s)
	}
	var setDate = function(y, mth, d, h, m, s){
		var date1 = new Date();
		if(y) date1.setFullYear(y);
		if(mth || mth == 0) date1.setMonth(mth);
		if(d) date1.setDate(d);
		if(h || h == 0) date1.setHours(h);
		if(m || m == 0) date1.setMinutes(m);
		if(s || s == 0) date1.setSeconds(s);
		return date1;
	}
	/*初始化日期元素，备选日期和已选日期*/
	var buildDateEle = function(scope, el){
		var y = scope.curr.getFullYear(), mth = scope.curr.getMonth(),d = scope.curr.getDate(),
			h = scope.curr.getHours(), m = scope.curr.getMinutes(), s = scope.curr.getSeconds();
		scope.showPart = {
			y : y,
			mth : mth+1,
			d : d,
			h : h,
			m : m,
			s : s
		}
		/*获取日期option，根据月份，根据周几添加空位*/
		scope.dateOptions = [];
		var date1 = setDate(y, mth, 1); // 获取当月的第一天
		if(date1.getDay() > 0){
			for(var i = 0; i < date1.getDay(); i++){
				scope.dateOptions.push({
					show:" ",
					chooseable:false
				});
			}
		}
		var totalDays;
		if(mth+1 == 2){
			 totalDays = y%4 == 0 ? 29 : 28;
		}  else{
			totalDays = [4, 6, 9, 11].indexOf(mth+1) != -1? 30 : 31;
		}
		for(var i = 1; i <= totalDays; i++){
			scope.dateOptions.push({
				show:i+"",
				chooseable:true,
				val: i,
				choosed :  i == d
			});
		}
		
		if(scope.isShowTime && scope.timeUsePicker){
			scope.timePickers = [];
			for(var i = 0; i < 24; i++){
				for(var j = 0; j < 60; j++){
					if(j%5 == 0){
						var pickerItem = (i < 10 ? "0"+i : i) + ":" + (j < 10 ? "0"+j : j) ;
						scope.timePickers.push({
							show:pickerItem,
							h:i,
							m:j,
							choosed : h == i && m == j
						});
					}
				}
			}
			if(el){
				if(m%5 != 0) m += 5-m%5;
				scope.scrollTime = Math.floor(function(){
					for(var i = 0; i < scope.timePickers.length; i++){
						if(scope.timePickers[i].show == ((h < 10?"0"+h:h)+":"+(m < 10?"0"+m:m))){
							return i;
						}
					}
					return 0;
				}()/7);
				if(scope.scrollTime > -1){
					timeScroll(el, scope.scrollTime);
				}
			}
		}
	};
	var moveAttrs = function(el, attrs){
		var name = el.attr("name"), required = el.attr("required"), focused = el.attr("ng-focus");
		if(name && required){
			el.removeAttr("name").removeAttr("required").find("input.inputscope").attr("name", name).attr("required", required);
			if(focused) el.removeAttr("ng-focus").find("input.inputscope").attr("ng-focus", "");
		}
	};
	var timeScroll = function(el, scrollTimes){
		el.find(".wz_picker_con .wz_timePicker .wz_tiemItems").animate({
			scrollLeft: el.find(".wz_picker_con").width()*0.9*scrollTimes
		}, 200);
	}
	return {
		restrict:"E",
		require:"ngModel",
		scope:{
			param:"="
		},
		compile: function(ele, attr, transeClude){
			/*主要将校验的属性移到input中*/
			moveAttrs(angular.element(ele), attr);
			return function(scope, elem, attrs, pctrl){
				
				var el = angular.element(elem);
				/*初始化参数*/
				buildParam(scope, scope.param);
				/*初始化显示值*/
				pctrl.$render = function(){
					scope.dateShow = pctrl.$viewValue;
				};
				/*输入框获取焦点，展开选择界面*/
				scope.focusInput = function(){
					if(scope.dateShow){
						scope.curr = parse_(scope.dateShow, scope.pattern);
					} else{
						scope.curr = new Date();
					}
					buildDateEle(scope, el);
					scope.showAll = true;
				};
				/*展开年份选择界面*/
				scope.showyOptions = function(){
					el.find(".yOptions").height(el.find(".wz_picker_con").height()-40);
					scope.yOptionsShow = !scope.yOptionsShow;
					scope.mthOptionsShow = false;
				};
				/*展开月份选择界面*/
				scope.showmthOptions = function(){
					el.find(".mthOptions").height(el.find(".wz_picker_con").height()-40);
					scope.mthOptionsShow = !scope.mthOptionsShow;
					scope.yOptionsShow = false;
				};
				/*选择年份*/
				scope.chooseY = function(y){
					scope.curr.setFullYear(y);
					buildDateEle(scope);
					scope.dateShow=formart(scope.curr, scope.pattern);
					scope.yOptionsShow = false;
					pctrl.$setViewValue(scope.dateShow);
				};
				/*选择月份*/
				scope.chooseMth = function(mth){
					scope.curr.setMonth(mth-1);
					buildDateEle(scope);
					scope.dateShow=formart(scope.curr, scope.pattern);
					scope.mthOptionsShow = false;
					pctrl.$setViewValue(scope.dateShow);
				};
				/*选择日期*/
				scope.chooseD = function(d){
					if(!d.chooseable) return;
					scope.curr.setDate(d.val);
					buildDateEle(scope);
					scope.dateShow=formart(scope.curr, scope.pattern);
					pctrl.$setViewValue(scope.dateShow);
					if(!scope.isShowTime){
						scope.showAll = false;
					}
				}
				/*选择时间*/
				scope.chooseHM = function(h, m){
					scope.curr.setHours(h);
					scope.curr.setMinutes(m);
					scope.curr.setSeconds(new Date().getSeconds());
					buildDateEle(scope);scope.dateShow=formart(scope.curr, scope.pattern);
					pctrl.$setViewValue(scope.dateShow);
					scope.showAll = false;
				}
				/*清空*/
				scope.clearAll = function(){
					scope.dateShow="";
					pctrl.$setViewValue("");
				}
				/*选择现在*/
				scope.toNow = function(){
					scope.curr = new Date();
					buildDateEle(scope);
					scope.dateShow=formart(scope.curr, scope.pattern);
					pctrl.$setViewValue(scope.dateShow);
					scope.showAll = false;
				}
				/*上月*/
				scope.premth = function(){
					scope.curr.setMonth(scope.curr.getMonth()-1);
					buildDateEle(scope);
					scope.dateShow=formart(scope.curr, scope.pattern);
					pctrl.$setViewValue(scope.dateShow);
				}
				/*下月*/
				scope.nextmth = function(){
					scope.curr.setMonth(scope.curr.getMonth()+1);
					buildDateEle(scope);
					scope.dateShow=formart(scope.curr, scope.pattern);
					pctrl.$setViewValue(scope.dateShow);
				}
				/*显示上一组时间*/
				scope.showPreTimeGroup = function(){
					timeScroll(el, scope.scrollTime = scope.scrollTime - 1);
				};
				/*显示下一组时间*/
				scope.showNextTimeGroup = function(){
					timeScroll(el, scope.scrollTime = scope.scrollTime + 1);
				};
				/*选择界面失去焦点，关闭全部界面*/
				$document.bind("click", function(evt){
					var x = evt.screenX, 
					y = evt.screenY,
					con = el.find(".wz_picker_con"),
					positionx =con.offset().left,
					positiony = con.offset().top,
					sizew = con.width(), 
					sizey = con.height();
					if(x < positionx || x > (positionx + sizew)){
						scope.$apply(function(){
							scope.showAll = false;
							scope.yOptionsShow = false;
							scope.mthOptionsShow = false;
						});
					}
				});
			}
		},
		template:'<div class="wz_date">'+
					'<input type="text" class="inputscope {{inputCls}}" ng-focus="focusInput();" ng-model="dateShow" readonly />'+
					'<div id="wz_picker_con" class="wz_picker_con" ng-show="showAll">'+
						'<div class="wz_title">'+
							'<div class="wz_premth" ng-click="premth();">'+
								'<b>&lt;</b>'+
							'</div>'+
							'<div class="wz_year">'+
								'<b title="点击选择年份" ng-bind="showPart.y" ng-click="showyOptions();"></b>'+
								'<div class="yOptions" ng-show="yOptionsShow">'+
									'<ul>'+
										'<li ng-repeat="yOption in yearOptions" ng-bind="yOption" ng-click="chooseY(yOption);"></li>'+
									'</ul>'+
								'</div>'+
							'</div>'+
							'<div class="wz_month">'+
								'<b title="点击选择月份" ng-bind="showPart.mth" ng-click="showmthOptions();"></b>'+
								'<div class="mthOptions"  ng-show="mthOptionsShow">'+
									'<ul>'+
										'<li ng-repeat="mOption in mthOptions" ng-bind="mOption" ng-click="chooseMth(mOption);"></li>'+
									'</ul>'+
								'</div>'+
							'</div>'+
							'<div class="wz_nextmth" ng-click="nextmth();">'+
								'<b>&gt;</b>'+
							'</div>'+
						'</div>'+
						'<div class="wz_con">'+
							'<div class="wz_week">'+
								'<ul>'+
									'<li ng-repeat="w in weekOptions" ng-bind="w"></li>'+
								'</ul>'+
							'</div>'+
							'<div class="wz_days">'+
								'<ul>'+
									'<li ng-repeat="d in dateOptions" ng-bind="d.show" ng-class="{choosed:d.choosed, mouseon:d.chooseable}" '+
									'ng-click="chooseD(d);"></li>'+
								'</ul>'+
							'</div>'+
							'<div ng-if="isShowTime" class="wz_time">'+
								'<div ng-if="timeUsePicker" class="wz_timePicker">'+
									'<div class="wz_timeactionBar" ng-click="showPreTimeGroup();"><b>&lt;</b></div>'+
									'<div class="wz_tiemItems">'+
										'<ul>'+
											'<li ng-repeat="picker in timePickers" ng-bind="picker.show" '+
												'ng-class="{choosed: picker.choosed}" ng-click="chooseHM(picker.h, picker.m)"></li>'+
										'</ul>'+
									'</div>'+
									'<div class="wz_timeactionBar" ng-click="showNextTimeGroup();"><b>&gt;</b></div>'+
								'</div>'+
								'<!--<div ng-if="!timeUsePicker" class="wz_timeSetter">'+
								'</div>-->'+
							'</div>'+
							'<div class="wz_foot">'+
								'<a href="javascript:;" ng-click="toNow();" title="设置为现在">现在</a>'+
								'<a href="javascript:;" ng-click="clearAll();" title="清空当前选择">清空</a>'+
							'</div>'+
						'</div>'+
					'</div>'+
				'</div>'
	};
}]);
