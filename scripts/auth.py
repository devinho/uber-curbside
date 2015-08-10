from rauth import OAuth2Service
import requests, json

uber_api = OAuth2Service(
     client_id='jsPWb0VZ3eAy1sVET3amVDgpj0wqS1r5',
     client_secret='https://uber.com',
     name='TEST CURBSIDE APP',
     authorize_url='https://login.uber.com/oauth/authorize',
     access_token_url='https://login.uber.com/oauth/token',
     base_url='https://api.uber.com/v1/',
 )

parameters = {
    'response_type': 'code',
    'redirect_uri': 'https://uber.com',
    'scope': 'request',
}

# Redirect user here to authorize your application
login_url = uber_api.get_authorize_url(**parameters)

print login_url
