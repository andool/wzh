(function(){
var dires = angular.module("gl.directives", []);

/*菜单栏*/
dires.directive("menu", [function(){
	return {
		restrict:"E",
		replace:true,
		trunsclude:true,
		templateUrl:"/gl/tpls/index_tpls/menu_tpl.html",
		controller:function(){
			
		},
		link:function(scope, ele, attr){
			// TODO 菜单栏的隐藏功能 , 自定义滚动条功能
		}
	};
}]);
/*菜单父指令*/
dires.directive("accordion", [function(){
	return {
		restrict:"E",
		replace:true,
		transclude:true,
		template:'<div ng-transclude></div>',
		controller:function(){
			var expanders = [];
			this.addExpander = function(expander){
				expanders.push(expander);
			};
			this.toggleAll = function(selectedExpander){
				angular.forEach(expanders, function(n){
					if(n != selectedExpander){
						n.showChild = false;
						n.choosed = false;
					}
				});
			};
			this.toggleSubs = function(selectedExpander, selectedSub){
				angular.forEach(expanders, function(n){
					if(n != selectedExpander){
						if(n.param.sub && n.param.sub.length > 0){
							angular.forEach(n.param.sub, function(li){
								li.choosed = false;
							});
						}
					} else{
						angular.forEach(selectedExpander.param.sub, function(li){
							if(selectedSub != li) li.choosed = false;
						});
					}
				});
			}
		}
	};
}]);
/*菜单*/
dires.directive("menuExpander", ["$state",function($state){
	return {
		restrict:"E",
		require:"^?accordion",
		replace:true,
		templateUrl:"/gl/tpls/index_tpls/menu_expander_tpl.html",
		scope:{
			param:"="
		},
		link:function(scope, ele, attrs, pCtrl){
			pCtrl.addExpander(scope);
			scope.showChild  = false;
			scope.toggle = function(){
				pCtrl.toggleAll(scope);
				scope.showChild = !scope.showChild;
				scope.choosed = true;
				if((!scope.param.sub || scope.param.sub.length < 1) && scope.param.url) $state.go(scope.param.url);
			};
			scope.subClick = function(sub){
				sub.choosed = true;
				pCtrl.toggleSubs(scope, sub);
				if(sub.url) $state.go(sub.url);
			};
		}
	};
}]);
/*panel 面板指令*/
dires.directive("panel", ["$document",
	function($document){
		return {
			restrict:"E",
			replace:true,
			transclude: true,
			templateUrl:"/gl/tpls/comm_tpls/panel_tpl.html",
			scope:{
				paneltitle:"@paneltitle",
				param:"=config",
				height:"@height"
			},
			compile: function(ele, attr, tranclude){
				return function(scope, ele, attr){
					scope.funsShow = false;
					scope.toggle = function(){
						scope.param.hideContent = !scope.param.hideContent;
					};
					scope.close = function(){
						scope.panelVisitable = true;
					};
					scope.funsToggle = function(){
						scope.funsShow = !scope.funsShow;
					};
					scope.callback = function(k){
						scope.funsShow = false;
						if(k && typeof k == "function"){
							k(ele);
						}
					};
//					$document.on("click", function(evt){
//						if(scope.funsShow){
//							var x = evt.screenX, 
//							y = evt.screenY,
//							con = angular.element(ele).find(".funcs_menu"),
//							positionx =con.offset().left,
//							positiony = con.offset().top,
//							sizew = con.width(), 
//							sizey = con.height();
//							if(x < positionx || x > (positionx + sizew) || y > positiony || y < (positiony + sizey)){
//								scope.$apply(function(){
//									scope.funsShow = false;
//								});
//							}
//						}
//					});
				};
			}
		};
	}
]);

/**
 * pager
 * 初始化参数
 * 必须 ： count - 总条数
 * 非必须
 * 	current - 当前页 默认1
 * 	type - 显示类型  "all", "small", "smaller", "tiny"可选, 默认all
 * 	sizeOptions - 每页条数选择项, 默认[10,20,30,40,50,60]
 *  listLength - 页码显示数量必须奇数, 默认5
 */
dires.directive("wzPager", [
	function(){
		var isInArr = function(arr, e){
			
			for(var i = 0; i < arr.length; i++){
				if(arr[i] == e){
					return i;
				}
			}
			return -1;
		}
		return {
			restrict:"E",
			replace:true,
			templateUrl:"/gl/tpls/comm_tpls/wz_pager_tpl.html",
			scope:{
				cfg:"=conf"
			},
			link:function(scope, ele, attrs){
				if(!scope.cfg.count){
					scope.cfg.count = 0;
					return;
				}
				/*初始化当前页为1*/
				scope.cfg.current = scope.cfg.current || 1;
				scope.cfg.type = scope.cfg.type || "all";
				/*初始化可选每页条数 size*/
				scope.cfg.sizeOptions = scope.cfg.sizeOptions || [5, 10,15]
				if(!scope.cfg.size){
					scope.cfg.size = 10;
				}
				if(isInArr(scope.cfg.sizeOptions, scope.cfg.size) == -1){
					scope.cfg.sizeOptions.push(scope.cfg.size);
					scope.cfg.sizeOptions.sort();
				}
				
				/*初始化总页数 , 页码等*/
				scope.cfg.listLength = scope.cfg.listLength || 5;
				if(scope.cfg.listLength%2 == 0){
					scope.cfg.listLength = scope.cfg.listLength - 1;
				}
				var listener = function(){
					
					scope.pageShow = scope.cfg.current;
					
					scope.pageList = [];
					scope.total = Math.ceil(scope.cfg.count / scope.cfg.size);
					if(scope.cfg.type == "all" || scope.cfg.listLength < 4){
						if(scope.total <= scope.listLength){
							for(var i=1; i <= scope.total; i++){
								scope.pageList.push(i);
							}
						} else{
							var offset = Math.floor(scope.cfg.listLength / 2);
							if(scope.cfg.current <= offset){
								for(var i = 1; i <= scope.cfg.listLength; i++){
									scope.pageList.push(i);
								}
							} else if(scope.cfg.current > (scope.total - offset)){
								for(var i = (scope.total - scope.cfg.listLength + 1); i <= scope.total; i++){
									scope.pageList.push(i);
								}
							} else{
								for(var i = (scope.cfg.current - offset); i <= (scope.cfg.current + offset) && i <= scope.total; i++){
									scope.pageList.push(i);
								}
							}
						}
					}
				};
				/*点击页码跳转到具体某一页*/
				scope.toPage = function(p){
					if(!isNaN(p)){
						scope.cfg.current = p;
						listener();
					}
				};
				/*跳转到具体某一页*/
				scope.changePage = function(){
					if(!isNaN(scope.pageShow)){
						if(scope.pageShow >= scope.total) scope.pageShow = scope.total;
						if(scope.pageShow < 1) scope.pageShow = 1;
						scope.cfg.current = parseInt(scope.pageShow);
						listener();
					}
				}
				/*改变每页条数*/
				scope.sizeChange = function(){
					scope.cfg.current = 1;
					listener();
				};
				/*去第一页*/
				scope.toFirst = function(){
					scope.cfg.current = 1;
					listener();
				};
				/*去最后一页*/
				scope.toLast = function(){
					scope.cfg.current = scope.total;
					listener();
				};
				/*上一页*/
				scope.pre = function(){
					if(scope.cfg.current > 1){
						scope.cfg.current = scope.cfg.current - 1;
						listener();
					}
				};
				/*下一页*/
				scope.next = function(){
					if(scope.cfg.current < scope.total){
						scope.cfg.current = scope.cfg.current + 1;
						listener();
					}
				};
				scope.$watch("cfg.count", listener);
			}
		};
	}
]);

/**
 * 表格
 */
dires.directive("wzGrid", [
	function(){
		
		return {
			restrict:"EA",
			replace:true,
			templateUrl:"/gl/tpls/comm_tpls/wz_grid_tpl.html",
			scope:{
				cfg:"=conf"
			},
			link:function(scope, ele, attrs){
				scope.cfg.height = scope.cfg.height || 450;
			}
		};
	}
]);
})();
