uberControllers.controller('confirmationController', ['$scope', 'Geocode', '$location', function($scope, Geocode, $location){	
	$scope.uberCost = sessionStorage.getItem('uber');
	$scope.tax = sessionStorage.getItem('tax');
	$scope.total = sessionStorage.getItem('total');

	$scope.store = JSON.parse(sessionStorage.getItem('store'));
	console.log($scope.store);

	var cache = JSON.parse(sessionStorage.getItem('cache'));
	var cart = [];
	cart = JSON.parse(sessionStorage.getItem('cart'));

	$scope.completeCart = [];


	for(i in cart){
		var item = cache[i];
		item['quantity'] = cart[i];
		$scope.completeCart.push(item);
	}

	$scope.initialize = function() {

      Geocode.geocode1($scope.address + ' ' + $scope.city + ' ' + $scope.state + ' ' + $scope.zip).success(function(data){


			start_lat = (data.results[0].geometry.location.lat);
			start_lng = (data.results[0].geometry.location.lng);

			var mapOptions = {
				center: { lat: start_lat, lng: start_lng},
				zoom: 9
			};

			map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);

			var myLatlng = new google.maps.LatLng(start_lat, start_lng);
			var marker = new google.maps.Marker({
			      position: myLatlng,
			      map: map,
			      title: 'Home Address'
			 });

			var contentString =  '<div> Drop Off </div>';
			var infowindow = new google.maps.InfoWindow({
				content: contentString,
				size: new google.maps.Size(150,50)
			});
			infowindow.open(map,marker);

			var latLng = new google.maps.LatLng($scope.store.geo.lat, $scope.store.geo.lng);
			var marker = new google.maps.Marker({
			      position: latLng,
			      map: map,
			      title: 'Store'
			 });


			var contentString =  '<div> Pick Up </div>';
			var infowindow = new google.maps.InfoWindow({
				content: contentString,
				size: new google.maps.Size(150,50)
			});
			infowindow.open(map,marker);
			
		}).error(function(err){
			console.log(err);
		});
	}

	function getSize(){
		$scope.cart = (sessionStorage.getItem('cart'));
		var count = JSON.parse($scope.cart)

		var total = 0;
		for (key in count){
			total += count[key];
		}

		$scope.size = total;
	};

	if ($location.search().address){
		$scope.address = $location.search().address;
		$scope.city = $location.search().city;
		$scope.state = $location.search().state;
		$scope.zip = $location.search().zip;
	}
	else{
		$location.search('address', '300 Sheridan Ave');
		$scope.address = '300 Sheridan Ave';

		$location.search('city', 'palo alto');
		$scope.city = 'palo alto';

		$location.search('state', 'ca');
		$scope.state = 'ca';

		$location.search('zip', '94301');
		$scope.zip = '94301';
	}

	getSize();
}]);
