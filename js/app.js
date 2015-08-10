var uberApp = angular.module('uberApp', ['ngRoute', 'uberControllers', 'uberServices']);

uberApp.config(['$routeProvider', function($routeProvider){
	$routeProvider.
		when('/', {
			templateUrl: 'partials/shopping.html',
			controller: 'shoppingController',
			reloadOnSearch: false
		}).
		when('/checkout', {
			templateUrl: 'partials/checkout.html',
			controller: 'checkoutController',
			// reloadOnSearch: false
		}).
		when('/confirmation', {
			templateUrl: 'partials/confirmation.html',
			controller: 'confirmationController'
		});
}]);

uberApp.filter('ranked', function() {
	return function(obj, searchKey){
		if (!obj || !searchKey)
			return obj;
		for(var i =0; i < Object.keys(obj).length; i++){
			currentObj = obj[Object.keys(obj)[i]];
			if (currentObj.closest == searchKey){
				currentObj.rank = 1;
			}
			else{
				currentObj.rank = 0;
			}
			// var numOfName = currentObj.name.indexOf(searchKey) + 1;
			// var numOfType = currentObj.type.indexOf(searchKey) + 1;
			// var numOfColor = currentObj.color.indexOf(searchKey) + 1;

			// currentObj.rank = numOfName * 10 + numOfType * 5 + numOfColor;
		}
		return obj;
	}
});

uberApp.filter('orderByRank', function() {
  return function(items, field, reverse) {
    var filtered = [];

    angular.forEach(items, function(item, key) {
      item.key_id = key;
      filtered.push(item);
    });
    filtered.sort(function (a, b) {
      return (a[field] < b[field] ? 1 : -1);
    });
    if(reverse) filtered.reverse();
    return filtered;
  };
});