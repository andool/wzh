var app = angular.module("app", ['myDirective']);

var gridCrtl = app.controller("gridCrtl", ["$scope", 
	function($scope){
		
		$scope.query = {
			name:'name',
			age:13,
			gender:'女'
		};
		$scope.genders = ['男', '女'];
		
		$scope.pageNationConf = {
			currentPage:1,
			totalItems:500,
			pagesLength:8,
			rememberPerPage:'perPage',
			itemsPerPage:9
		};
		$scope.query = function(){
			$scope.pageNationConf.totalItems = parseInt(Math.random()*1000);
			listener();
		};
		var listener = function(){
			$scope.opts = [
				{name:'aa',age:Math.random()*20},
				{name:'bb',age:Math.random()*20},
				{name:'cc',age:Math.random()*20}
			];
		}
		
		$scope.$watch('pageNationConf.itemsPerPage + pageNationConf.currentPage',listener);
	}
]);