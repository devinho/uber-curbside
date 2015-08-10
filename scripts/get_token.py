import requests

# Once your user has signed in using the previous step you should redirect
# them here

parameters = {
    'redirect_uri': 'https://uber.com',
    'code': 'iwMx1J0n215e4PtVncKTaeSC0MpsXD',   # insert code
    'grant_type': 'authorization_code',
}

response = requests.post(
    'https://login.uber.com/oauth/token',
    auth=(
        'jsPWb0VZ3eAy1sVET3amVDgpj0wqS1r5',
        '5uSvq0V-Oto-dmaVCO45WrQ1q6HcwphPyeuSR1LG',
    ),
    data=parameters,
)

# This access_token is what we'll use to make requests in the following
# steps
access_token = response.json().get('access_token')

print access_token

#  P6kr9Kk6XwEbPiAzntekyL88DxuEAe