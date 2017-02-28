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
			pagesLength:21,
			rememberPerPage:'perPage',
			itemsPerPage:15
		};
		
		var listener = function(){
			console.info("====>>>>>>");
			$scope.pageNationConf.totalItems = 300;
		}
		
		$scope.$watch('pageNationConf.itemsPerPage + pageNationConf.currentPage + query.name + query.age + query.gender',
		listener);
	}
]);

