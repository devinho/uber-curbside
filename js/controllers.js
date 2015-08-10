var uberControllers = angular.module('uberControllers', []);

uberControllers.controller('mainController', ['$scope', 'Curbside', '$location', '$route', function($scope, Curbside, $location, $route){

	function getSize(){


		$scope.cart = (sessionStorage.getItem('cart'));
		var count = JSON.parse($scope.cart)

		var total = 0;
		for (key in count){
			total += count[key];
		}

		$scope.size = total;
	};
}]);
