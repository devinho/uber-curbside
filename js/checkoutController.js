uberControllers.controller('checkoutController', ['$scope', 'Curbside', 'Geocode', 'uberRush', '$location', '$rootScope', '$location',
function($scope, Curbside, Geocode, uberRush, $location, $rootScope, $location){	

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

	$scope.temp = JSON.parse(sessionStorage.getItem('cart'));
	var cache = JSON.parse(sessionStorage.getItem('cache'));
	var map, start_lat, start_lng;
	$scope.cart = new Object;
	$scope.completeCart = {};

	for(i in $scope.temp){

		var item = cache[i];
		item['quantity'] = $scope.temp[i];
		$scope.completeCart[i] = item;
	}

	getStores();

	$scope.selectedAddress = null;
	$scope.select = function(store){
		$scope.selectedTitle = store.name;
		$scope.selectedAddress = store.address;
		$scope.store = store;

		var i = ($scope.store.address).indexOf(',');	

		uberRush.quote(($scope.store.address).substring(0, i), '', $scope.store.address.substring(i+2, ($scope.store.address).length), 'CA', $scope.store.zipcode,
		$scope.address, '', $scope.city, $scope.state, $scope.zip).success(function(data){
			$scope.uberCost = data.quotes[0].fee;
			sessionStorage.setItem('uber', $scope.uberCost);
			getTotal(store);
		});

		
		//uber(store.geo.lat, store.geo.lng, start_lat, start_lng, store); // start is home (store is start)

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
			
		}).error(function(err){
			console.log(err);
		});
	}

	$scope.removeOne = function(item){
		for (i in $scope.completeCart){
			if($scope.completeCart[i] == item){
				if($scope.completeCart[i].quantity > 0){
					$scope.completeCart[i].quantity = $scope.completeCart[i].quantity - 1;
					$scope.temp[i] = $scope.temp[i] - 1;
				}
				if($scope.completeCart[i].quantity == 0){
					delete $scope.temp[i];
					delete $scope.completeCart[i];

					getStores();
					$scope.initialize();
					$scope.selectedTitle = '';
					$scope.selectedAddress = '';
					//$scope.message = 'Your cart is empty';
					
				}
				// if($scope.store){
				// 	getTotal($scope.store);
				// }
				
				sessionStorage.setItem('cart', JSON.stringify($scope.temp));
				getSize();

			}
		}
		
	}
	$scope.addOne = function(item){
		for (i in $scope.completeCart){
			if($scope.completeCart[i] == item){
				if($scope.completeCart[i].quantity < 99){
					$scope.completeCart[i].quantity = $scope.completeCart[i].quantity+1;
					$scope.temp[i] = $scope.temp[i] + 1;
					sessionStorage.setItem('cart', JSON.stringify($scope.temp));
					getSize();
					// if($scope.store){
					// 	getTotal($scope.store);
					// }
				}
			}
		}
	}

	function getStores(){

		$scope.message = '';
		var lists = [];
		if(!$scope.temp){
			$scope.message = 'Your cart is empty.'
			return;
		}
		if(Object.keys($scope.temp).length > 0){
			for (item in $scope.temp){
				$scope.cart[item] = cache[item];
				$scope.cart[item].count = $scope.temp[item];
				lists.push($scope.cart[item].stores);
			}
		}
		else{
			lists.push([]);
		}
		

		var temp = intersect_all(lists);

		if(Object.keys($scope.temp).length == 0){
			$scope.message = 'Your cart is empty.'
		}
		else if (temp.length == 0){
			$scope.message = 'No store has all of the requested items in stock.';
		}
		else{
			$scope.message = "Choose a store for pickup";
		}

		$scope.stores = [];
		$scope.initialize;

		async.forEach(temp, function(store, callback){
			Curbside.storeSearch(store).success(function(data){
				var date_1 = new Date(Date.now());
				var date_2 = new Date(data[0].est_pickup_time)

				var i = (data[0].address).indexOf(',');

				// NO DATE DEFAULT TO CALIFORNIA *****
				// CHECK ADDRESS 2

				data[0].est_minutes = ((date_2.getHours() - date_1.getHours()) * 60);


				
				uberRush.quote((data[0].address).substring(0, i), '', data[0].address.substring(i+2, (data[0].address).length), 'CA', data[0].zipcode,
				$scope.address, '', $scope.city, $scope.state, $scope.zip).success(function(d){
					data[0].delivery = d.quotes[0].dropoff_eta;
					data[0].display = d.quotes[0].fee;
				}).error(function(err){
					console.log(err);
				});
				
				$scope.stores.push(data[0]); 

				// console.log($scope.stores);

				// POSSIBLE RACE CONDITION WHERE MAP IS UNDEFINED
				// how to fix this...

				if (map == undefined){
					console.log('ugg');
				}
				
				var loc = new google.maps.LatLng(data[0].geo.lat, data[0].geo.lng);
				var marker = new google.maps.Marker({
					position: loc,
					map: map,

					icon: '../assets/images/marker.png'
				});

				var contentString =  '<div>' + data[0].address + '</div>';
				var infowindow = new google.maps.InfoWindow({
					content: contentString,
					size: new google.maps.Size(150,50)
				});

				infowindow.open(map,marker);
				google.maps.event.addListener(marker, 'click', function() {
					infowindow.open(map,marker);
				});

			}).error(function(err){
				console.log(err);
			});
		});
	}
	

	function intersect(a, b) {
	    var t;
	    if (b.length > a.length) t = b, b = a, a = t; // indexOf to loop over shorter
	    return a.filter(function (e) {
	        if (b.indexOf(e) !== -1) return true;
	    });
	}

	function intersect_all(lists)
	{
	    if (lists.length == 0) return [];
	    else if (lists.length == 1) return lists[0];

	    var partialInt = lists[0];
	    for (var i = 1; i < lists.length; i++)
	    {
	        partialInt = intersect(partialInt, lists[i]);
	    }
	    return partialInt;
	}


	function getTotal(store){

		var beforeTax = 0;
		for (i in $scope.completeCart){
			beforeTax += ($scope.completeCart[i].list_price / 100) * $scope.completeCart[i].quantity;
		}
		$scope.tax = Number(beforeTax * store.tax_rate).toFixed(2);
		$scope.total = Number((beforeTax + Number($scope.tax) + $scope.uberCost)).toFixed(2);

		sessionStorage.setItem('tax', $scope.tax);
		sessionStorage.setItem('total', $scope.total);
	}

	$scope.goConfirm = function(){
		sessionStorage.setItem('store' ,JSON.stringify($scope.store));
		console.log($scope.address);
		//$location.search('address', $scope.address);
		$location.path('/confirmation');
	}

}]);
