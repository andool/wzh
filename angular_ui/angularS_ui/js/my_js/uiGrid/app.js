var app = angular.module("app", ["ngGrid"]);

var gridCrtl = app.controller("gridCrtl", ["$scope", 
	function($scope){
		$scope.myData = [
			{name:'andoo', age: 12},
			{name:'baby', age: 35},
			{name:'cendy', age: 18},
			{name:'dtage', age: 19},
			{name:'eggy', age: 25},
			{name:'france', age: 34},
			{name:'gred', age: 23}
		];
		
		$scope.gridOptions = {
			data:'myData',
			columnDefs:[
				{
					field:'name',
					displayName:'Name'
				},
				{
					field:'age', 
					displayName:'Age'
				}
			]
		};
	}
]);

