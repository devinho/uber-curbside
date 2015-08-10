var services = angular.module('uberServices', []);

services.factory('Uber', function($http){
	var baseUrl = 'https://api.uber.com/v1/';
	var sandbox = 'https://sandbox-api.uber.com/v1/requests/'
	var token = 'server_token=1Lpjj5SVJT24ksIrxCH4F5zY43DVusYK6Iv7uE_8';

	return{
		timeEstimate: function(lat, long){
			long_lat = 'start_latitude='+ lat+ ' &start_longitude=' + long;
			return $http.get(baseUrl + 'estimates/time?' + long_lat + '&' + token);
		},
		
		requestEstimate: function(id, lat1, long1, lat2, long2){
			var req = {
				method: 'POST', 
				url: sandbox + 'estimate',
				headers: {
					'Authorization': 'Bearer P6kr9Kk6XwEbPiAzntekyL88DxuEAe',
					'Content-Type': 'application/json'
				},
				data: {
					'start_longitude': long1,
					'start_latitude': lat1,
					'end_longitude': long2,
					'end_latitude': lat2,
					'product_id': id
				}
			}

			return $http(req);
		}
	}

});

services.factory('Geocode', function($http){
	var baseUrl = 'https://maps.googleapis.com/maps/api/geocode/json';
	var key = 'AIzaSyCl9rZvkVlCxKfB-eeHRj65615tLtVAVH8';

	return{
		geocode: function(latlng){
			return $http.get(baseUrl + '?latlng=' +latlng+ '&key=' +key);
		},
		geocode1: function(addr){
			return $http.get(baseUrl + '?address=' + addr + '&key=' +key);
		}
	}
});

services.factory('Distance', function($http){
	var baseUrl = 'https://maps.googleapis.com/maps/api/distancematrix/json';
	var key = 'AIzaSyD6KgaXxwnhwtBGRHLZGZ4LgTDhzYCU2lU';

	return{
		distance: function(origin, destination){
			return $http.get(baseUrl + '?origins=' + origin + ' &destinations=' + destination + '&key=' +key);
		}
	}
});

services.factory('Curbside', function($http){
	var baseUrl = 'https://api-p.shopcurbside.com/';

	return{
		instore: function(q, lat, lon){
			return $http.get(baseUrl + 'api/v3/instores?q=' + q + '&loc=' + lat + ',' + lon + '&include=products&size=35');
		},
		storeSearch: function(csin){
			return $http.get(baseUrl + 'api/v3/stores?csin=' + csin);
		},
		login: function(user, pass){
			var req = {
				method: 'POST',
				url: baseUrl + 'api/v1/login',
				data: {
					username: user,
					password: pass
				}
			}
			return $http(req);
		},
		account: function(){
			return $http.get(baseUrl + 'api/v1/account');
		},
		session: function(){
			return $http.get(baseUrl + 'api/v1/session-status');
		}
	}
});

services.factory('uberRush', function($http){
	var baseUrl = 'https://sandbox-api.uber.com/v1/deliveries/';

	return{
		quote: function(add1_1, add1_2, city1, state1, zip1, add2_1, add2_2, city2, state2, zip2){
			var req = {
				method: 'POST',
				url: baseUrl + 'quote?scope=devliery_sandbox',
				headers: {
					'Authorization': 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzY29wZXMiOlsiZGVsaXZlcnlfc2FuZGJveCJdLCJzdWIiOiI1Y2M5NWNjYy0wYmIyLTQzNDAtOGQwMi00YmY4ZTMzNWZhM2YiLCJpc3MiOiJ1YmVyLXVzMSIsImp0aSI6ImM4MGEyMGQ3LTE3MmYtNDQ2Ni1hOTQwLTgzNGQwZWJmZWUxOSIsImV4cCI6MTQ0MTMwNjMwMiwiaWF0IjoxNDM4NzE0MzAyLCJ1YWN0IjoiWUVneW50T0dmbnUwQjNmdGIzTXphQkI0eHVPZ1FBIiwibmJmIjoxNDM4NzE0MjEyLCJhdWQiOiJMY1JkYU9yRl9TWFlNZGRxOGxHeGs2TnJJbnJfZVEzdSJ9.T92Vz8aqZg2ash0ywOdDRKBB_4cFrz5zhGGNtViq6I1MzWAE2A1cYPnXhiNecSaX06T4okC_TvwZPBJtVaTZovJPtK2F--hNGNbQg19qtGM2XkId6NYNZc0Yo7ah6b3YOGLzlXUfcRXj1N7E_vNIfS-f5aglQK5iKfYCoOb11eKUR8vcwNmMqFHVkeafaINL4MnBdomCZbdzjC4RIpZVJDSKhc7-GwW1K0A1OyLJipHM0b3mSWNnWq8Ib_IQTacCyt-yfbjAAaajfrH-PqSP-HuKnpiCQg-lnK8cvtxvc9_ixlS5yfdL04Ap7cHSBLYbYfe-n3b8R9qY_MjIQ-IfZg',
					'Content-Type': 'application/json'
				},
				data: {
					'pickup':{
						'location':{
							'address': add1_1,
							'address_2': add1_2,
							'city': city1,
							'country': 'USA',
							'state': state1,
							'postal_code': zip1
						}
					},
					'dropoff':{
						'location':{
							'address': add2_1,
							'address_2': add2_2,
							'city': city2,
							'country': 'USA',
							'state': state2,
							'postal_code': zip2
						}
					}
				}
			}
			return $http(req);
		}
	}
});


