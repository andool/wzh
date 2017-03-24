var dct = angular.module("myDirective", []);

var pager = dct.directive("pager", [
	function(){
		return {
			restrict:"EA",
			templateUrl:"/angularS_ui/views/uiGrid/pageNation_tpl.html",
			replace:true,
			scope:{
				conf:"="
			},
			link:function(scope, element, attrs){
				//点击页码
				scope.changeCurrentPage = function(item){
					if(item == "..."){
						return;
					} else{
						scope.conf.currentPage = item;
					}
					getPagenationListener();
				};
				
				scope.conf.pagesLength = parseInt(scope.conf.pagesLength)?parseInt(scope.conf.pagesLength) : "9";
				if(scope.conf.pagesLength % 2==0){
					scope.conf.pagesLength = scope.conf.pagesLength - 1;
				}
				
				// 每页记录数选项
				if(!scope.conf.perPageOptions){
					scope.conf.perPageOptions = [10, 15, 20, 30, 50];
				}
				
				// 翻页操作
				function getPagenationListener(){
					// 当前页
					scope.conf.currentPage = parseInt(scope.conf.currentPage)?parseInt(scope.conf.currentPage) : 1;
					// 总记录数
					scope.conf.totalItems = parseInt(scope.conf.totalItems);	
					
					
					/*
					 * 如果用户配置了本地存储每页记录数的key
					 * 将每页记录数存入本地存储，从本地获取每页记录数
					 * 
					 * 如果用户没有配置本地存储每页记录数的key，则使用用户选择的
					 * 
					 */
					if(scope.conf.rememberPerPage){
						if(!parseInt(localStorage[scope.conf.remeberPerPage])){
							localStorage[scope.conf.rememberPerPage] = parseInt(scope.conf.itemsPerPage)?parseInt(scope.conf.itemsPerPage):15;
						}
						scope.conf.itemsPerPage = parseInt(localStorage[scope.conf.rememberPerPage]);
					} else{
						scope.conf.itemsPerPage = parseInt(scope.conf.itemsPerPage)?parseInt(scope.conf.itemsPerPage):15;
					}
					
					// 总页数
					scope.conf.numberOfPages = Math.ceil(scope.conf.totalItems/scope.conf.itemsPerPage);
					
					// 显示当前页码
					scope.jumpPageNum = scope.conf.currentPage;
					
					/*
					 * 每页记录数选项操作
					 * 如果默认的选项中没有用户配置的选项，将用户配置的选择添加进数组
					 */
					var perPageOptionLength = scope.conf.perPageOptions.length;
					var perPageOptionStatus;
					for(var i = 0; i < perPageOptionLength; i++){
						if(scope.conf.perPageOptions[i] == scope.conf.itemsPerPage){
							perPageOptionStatus = true;
						}
					}
					if(!perPageOptionStatus){
						scope.conf.perPageOptions.push(scope.conf.itemsPerPage);
					}
					scope.conf.perPageOptions.sort(function(a, b){return a-b;});
					
					/*
					 * 创建用来显示的页码数据
					 */
					scope.pageList = [];
					if(scope.conf.numberOfPages <= scope.conf.pagesLength){
						for(i = 1; i <= scope.conf.numberOfPages; i++){
							scope.pageList.push(i);
						}
					} else{
						var offset = (scope.conf.pagesLength - 1)/2;
						if(scope.conf.currentPage <= offset-1){
							for(var i = 1; i < offset+1; i++){
								scope.pageList.push(i);
							}
							scope.pageList.push("...");
							scope.pageList.push(scope.conf.numberOfPages);
						} else if(scope.conf.currentPage > scope.conf.numberOfPages - offset){
							scope.pageList.push(1);
							scope.pageList.push("...");
							for(var i = offset+1; i >= 1; i--){
								scope.pageList.push(scope.conf.numberOfPages - i);
							}
							scope.pageList.push(scope.conf.numberOfPages);
						} else{
							scope.pageList.push(1);
							scope.pageList.push("...");
							for(i = Math.ceil(offset/2) ; i >= 1; i--){
	                            scope.pageList.push(scope.conf.currentPage - i);
	                        }
	                        scope.pageList.push(scope.conf.currentPage);
	                        for(i = 1; i <= offset/2; i++){
	                            scope.pageList.push(scope.conf.currentPage + i);
	                        }
							scope.pageList.push("...");
							scope.pageList.push(scope.conf.numberOfPages);
						}
						
						if(scope.conf.onChange){
							scope.conf.onChange();
						}
					}
				}
				getPagenationListener();
				// 上一页
				scope.prevPage = function(){
					if(scope.conf.currentPage > 1){
						scope.conf.currentPage -= 1;
					}
					getPagenationListener();
				};
				
				// 下一页
				scope.nextPage = function(){
					if(scope.conf.currentPage < scope.conf.numberOfPages){
						scope.conf.currentPage += 1;
					}
					getPagenationListener();
				};
				
				// 直接输入页码
				scope.jumpToPage = function(){
					scope.jumpPageNum = scope.jumpPageNum.replace(/[^0-9]/g, '');
					if(scope.jumpPageNum != ''){
						if(scope.jumpPageNum > scope.conf.numberOfPages){
							scope.jumpPageNum  = scope.conf.numberOfPages
						}
						if(scope.jumpPageNum < 1){
							scope.jumpPageNum = 1;
						}
						scope.conf.currentPage = scope.jumpPageNum;
					}
					getPagenationListener();
				};
				
				// 改变每页记录数
				scope.changeItemsPerPage = function(){
					if(scope.conf.rememberPerPage){
						localStorage.removeItem(scope.conf.rememberPerPage);
					}
					getPagenationListener();
				};
				
				// 监视当前页，总页数和每页记录数的变化
//				scope.$watch(function(){
//					var newVal = scope.conf.currentPage + ' ' + scope.conf.totalItems + ' ';
//					if(scope.conf.rememberPerPage){
//						if(localStorage[scope.conf.rememberPerPage]){
//							newVal += localStorage[scope.conf.rememberPerPage];
//						} else{
//							newVal += scope.conf.itemsPerPage;
//						}
//					} else{
//						newVal += scope.conf.itemsPerPage;
//					}
//					return newVal;
//				},getPagenationListener);
				scope.$watch("conf.totalItems", getPagenationListener);
			}
		};
	}
]);