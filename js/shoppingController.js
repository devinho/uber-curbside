uberControllers.controller('shoppingController', ['$rootScope', '$scope', 'Curbside', 'Geocode', 'Distance', '$location', '$route',
	function($rootScope, $scope, Curbside, Geocode, Distance, $location, $route){


	function getSize(){
		$scope.cart = (sessionStorage.getItem('cart'));
		var count = JSON.parse($scope.cart)

		var total = 0;
		for (key in count){
			total += count[key];
		}

		$scope.size = total;
	};

	$scope.getResults = function(query, lat, lon){
		$location.search('query' , query);
		
		Curbside.instore(query, lat, lon).success(function(data){
			var count = 0;

			if (Object.keys(data).length == 0){	
				$scope.message = 'The address you entered was invalid. Please enter a different address.';
				$scope.products = {};
				return;
			}

			async.forEachOf(data.products, function(obj, val, callback){
				count++;
				if (data.products[val].retailer != 'target'){
				 	delete data.products[val];
				 	return;
				}
				
				var len = data.products[val].list_price.toString().length;
				data.products[val].price = '$' + data.products[val].list_price.toString().substring(0, len-2) + '.' +  data.products[val].list_price.toString().substring(len-2, len);
				data.products[val].image = data.products[val].image_url_base + 'full/' + data.products[val].image_files[0];
				data.products[val].stores = [];
				data.products[val].full_stores = [];
				data.products[val].quantity = 0;
				data.products[val].additional = '';
				data.products[val].closest = '';

				for (i in data.instores){
					if (data.instores[i].cpin == val){
						 data.products[val].stores.push(data.instores[i].csin);
					}
				}

				var shortest = {};
					var i = 999999;
					var count2 = 0;

					async.forEachOf(data.products[val].stores, function(a, z, cb){
						count2++;
						Curbside.storeSearch(a).success(function(d){
							data.products[val].full_stores.push(d[0].name + ', ' + d[0].ext_name);

							Distance.distance(d[0].address, $scope.address + ' ' + $scope.city + ' ' + $scope.state + ' ' + $scope.zip)
							.success(function(b){
								// console.log(d[0]);
								// console.log(b.rows[0].elements[0].distance.value);
								if (Object.keys(shortest).length == 0){
									i = b.rows[0].elements[0].distance.value;
									shortest = d[0];
								}
								else{
									if (b.rows[0].elements[0].distance.value < i){
										i = b.rows[0].elements[0].distance.value;
										shortest = d[0];
									}
								}
								
								data.products[val].closest = shortest.name + ', ' + shortest.ext_name;
								data.products[val].additional = (data.products[val].stores.length-1);

							// if(--count2 == 0 && count == 0){
							// 	console.log('last');
							// 	$scope.message = '';
							// 	$scope.products = data.products;
							// 	//deleteStores();
							// }

							}).error(function(err){
								console.log(err);
							});
						}).error(function(err){

						});
					});

				count--;				

				$scope.cache = (sessionStorage.getItem('cache'));
				$scope.cart = (sessionStorage.getItem('cart'));

				var c = $.parseJSON($scope.cache);

				if (!c){
					var item = new Object;
					item[val] = data.products[val];

					sessionStorage.setItem('cache', JSON.stringify(item));
				}
				else if(!c[val]){
					c[val] = data.products[val];

					sessionStorage.setItem('cache', JSON.stringify(c));
				}

				if (JSON.parse($scope.cart) != null  && JSON.parse($scope.cart)[val]){
					data.products[val].quantity = JSON.parse($scope.cart)[val];
				}

				$scope.message = '';
				$scope.products = data.products;
				
			});
		}).error(function(){

		});
	};

	$scope.addOneToCart = function(key, value){

		
		// cartManager.addCart(key, value);
		// $scope.size = cartManager.getCartSize();

		$scope.cart = (sessionStorage.getItem('cart'));
		var c = $.parseJSON($scope.cart);


		
		

		if(!c){
			var item = new Object;
			item[key] = 1;

			$scope.products[key].quantity = 1;
			$scope.currentStore = value.closest;
			$location.search('current', $scope.currentStore);

			sessionStorage.setItem('cart', JSON.stringify(item));
		}
		else if(!c[key]){

			c[key] = 1;
			$scope.products[key].quantity = c[key];

			sessionStorage.setItem('cart', JSON.stringify(c));
		}
		else{
			c[key] = c[key] + 1;
			$scope.products[key].quantity = c[key];

			sessionStorage.setItem('cart', JSON.stringify(c));
		}
		deleteStores();
		getSize();
	}

	$scope.removeOneFromCart = function(key, value){
		$scope.cart = (sessionStorage.getItem('cart'));
		var c = $.parseJSON($scope.cart);

		if(c[key]){
			c[key] = c[key] - 1;
			sessionStorage.setItem('cart', JSON.stringify(c));
		}
		$scope.products[key].quantity = c[key];
		getSize();

	}
	

	getSize();

	if($location.search().query){
		$scope.query = $location.search().query;
	}

	if($location.search().current){
		$scope.currentStore = $location.search().current;
	}

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

	Geocode.geocode1($scope.address + ' ' + $scope.city + ' ' + $scope.state + ' ' + $scope.zip).success(function(data){
		$scope.lat = data.results[0].geometry.location.lat;
		$scope.lon = data.results[0].geometry.location.lng;
	}).error(function(err){
		console.log(err);
	});

	$scope.message = 'Type something into the search bar above to begin shopping';


	$scope.addressSubmit = function(a, b, c, d){
		$location.search('address', a);
		$scope.address = a;

		$location.search('city', b);
		$scope.city = b;

		$location.search('state', c);
		$scope.state = c;

		$location.search('zip', d);
		$scope.zip = d;

		 Geocode.geocode1($scope.address + ' ' + $scope.city + ' ' + $scope.state + ' ' + $scope.zip).success(function(data){
			$scope.lat = data.results[0].geometry.location.lat;
			$scope.lon = data.results[0].geometry.location.lng;
			$scope.getResults($scope.query, $scope.lat, $scope.lon);
		}).error(function(err){
			console.log(err);
		});
	};

	var switchToInput = function () {
	    if(window.location.href.indexOf('confirmation') != -1){
	       return;
	    }
	    
	    var $input = $("<input>", {
	        val: $(this).text(),
	        type: "text"
	    });
	    $input.attr("ID", "start");
	    $(this).replaceWith($input);
	    $input.on("blur", switchToSpan);
	    $input.select();
	};

	var switchToSpan = function () {
	    if(window.location.href.indexOf('confirmation') != -1){
	       return;
	    }

	    if(!$(this).val()){
	       $(this).val('Please enter a start address');
	    }
	   else{

	   	 $location.search('address', $(this).val());
	   	 $scope.startAddress = $(this).val();
		 Geocode.geocode1($scope.startAddress).success(function(data){
			$scope.lat = data.results[0].geometry.location.lat;
			$scope.lon = data.results[0].geometry.location.lng;
			$scope.getResults($scope.query, $scope.lat, $scope.lon);
		}).error(function(err){
			console.log(err);
		});
	   	
	   }
	  

	    var $span = $("<span>", {
	        text: $(this).val()
	    });
	    $span.attr("ID", "start");
	    $(this).replaceWith($span);
	    
	    $span.on("click", switchToInput);
	    // 
	}
	$("#start").on("click", switchToInput);
	

	$scope.login = function(){
		Curbside.login('devin.ho@shopcurbside.com', '').success(function(data, status, header){
			console.log(data);
		}).error(function(err){

		});
	};

	$scope.test = function(){
		Curbside.account().then(function(accountRes){
			console.log(accountRes);
		});
	}

	$scope.status = function(){
		Curbside.session().then(function(res){
			console.log(res.data);
		});
	}

	function deleteStores(){
		// if($scope.currentStore) {
		// 	for(var k in $scope.products){
		// 		if($scope.products[k].full_stores.indexOf($scope.currentStore) == -1){
		// 			console.log('delete');

		// 			delete $scope.products[k];
		// 		}
		// 	}
			
		// }
	}

}]);
