var dct = angular.module("myDirective", []);

var pageNation = dct.directive("pager", [
	function(){
		return {
			restrict:"EA",
			templateUrl:"/angularS_ui/views/uiGrid/pageNation_tpl.html",
			replace:true,
			scope:{
				conf:"="
			},
			link:function(scope, element, attrs){
				
				scope.changeCurrentPage = function(item){
					if(item == "..."){
						return;
					} else{
						scope.conf.currentPage = item;
					}
				};
				
				scope.conf.pagesLength = parseInt(scope.conf.pagesLength)?parseInt(scope.conf.pagesLength) : "9";
				if(scope.conf.pagesLength % 2==0){
					scope.conf.pagesLength = scope.cong.pagesLength - 1;
				}
				
				if(!scope.conf.perPageOptions){
					scope.conf.perPageOptions = [10, 15, 20, 30, 50];
				}
				
				function getPagenationListener(){
					scope.conf.currentPage = parseInt(scope.conf.currentPage)?parseInt(scope.conf.currentPage) : 1;
					scope.conf.totalItems = parseInt(scope.conf.totalItems);	
					
					
					
					if(scope.conf.rememberPerPage){
						if(!parseInt(localStorage[scope.conf.remeberPerPage])){
							localStorage[scope.conf.rememberPerPage] = parseInt(scope.conf.itemsPerPage)?parseInt(scope.conf.itemsPerPage):15;
						}
						scope.conf.itemsPerPage = parseInt(localStorage[scope.conf.rememberPerPage]);
					} else{
						scope.conf.itemsPerPage = parseInt(scope.conf.itemsPerPage)?parseInt(scope.conf.itemsPerPage):15;
					}
					
					scope.conf.numberOfPages = Math.ceil(scope.conf.totalItems/scope.conf.itemsPerPage);
					
					scope.jumpPageNum = scope.conf.currentPage;
					
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
					
					scope.pageList = [];
					if(scope.conf.numberOfPages <= scope.conf.pagesLength){
						for(i = 1; i <= scope.conf.numberOfPages; i++){
							scope.pageList.push(i);
						}
					} else{
						var offset = (scope.conf.pagesLength - 1)/2;
						if(scope.conf.currentPage <= offset){
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
				scope.prevPage = function(){
					if(scope.conf.currentPage > 1){
						scope.conf.currentPage -= 1;
					}
				};
				
				scope.nextPage = function(){
					if(scope.conf.currentPage < scope.conf.numberOfPages){
						scope.conf.currentPage += 1;
					}
				};
				
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
				};
				
				scope.changeItemsPerPage = function(){
					if(scope.conf.rememberPerPage){
						localStorage.removeItem(scope.conf.rememberPerPage);
					}
				};
				
				scope.$watch(function(){
					var newVal = scope.conf.currentPage + ' ' + scope.conf.totalItems + ' ';
					if(scope.conf.rememberPerPage){
						if(localStorage[scope.conf.rememberPerPage]){
							newVal += localStorage[scope.conf.rememberPerPage];
						} else{
							newVal += scope.conf.itemsPerPage;
						}
					} else{
						newVal += scope.conf.itemsPerPage;
					}
					return newVal;
				},getPagenationListener);
			}
		};
	}
]);
