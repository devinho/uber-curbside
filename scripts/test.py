import requests, json

headers = {
	'Authorization': 'Bearer P6kr9Kk6XwEbPiAzntekyL88DxuEAe',
	'Content-Type': 'application/json'
}

data = json.dumps({
	'start_latitude': 37.3175,
	'start_longitude': -122.0419,
	'end_latitude': 37.7833,
	'end_longitude': -122.4167,
	'product_id': 'a1111c8c-c720-46c3-8534-2fcdd730040d'
})

url = 'https://sandbox-api.uber.com/v1/requests/estimate'

r = requests.post(url, headers=headers, data=data)

print r.text