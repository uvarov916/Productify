var productifyApp = angular.module('productifyApp', []);

productifyApp.controller('AppCtrl', function ($scope) {
	$scope.numberOfWebsitesVisited = 25;
	$scope.numberOfHoursLogged = 11;
});
