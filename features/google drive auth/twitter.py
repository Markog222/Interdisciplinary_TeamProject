#!/usr/bin/python

#Consumer Key (API Key)	ReI9PmpW8vvQ0nnA6hduE3643
#Consumer Secret (API Secret)	eib5uogrnTxSmQlkwu2y2CkV9kW6Bhvn3oiE2dkZLY0ieLmV4T

#Access Token	4727754561-IyxfJzh78d0O6kDvh1Keb8yPtpR9SYMAHNbhtZk
#Access Token Secret	xcD9M8E2Td0WyLCzgYaqMhWDnvbUjac8A5WIZFrEyT7Kk

# @reference:  https://www.youtube.com/watch?v=Syiiyxo9vj0	
# @reference: https://docs.python.org/2/library/json.html

import json
import oauth2

CONSUMER_KEY = 'ReI9PmpW8vvQ0nnA6hduE3643'
CONSUMER_SECRET = 'eib5uogrnTxSmQlkwu2y2CkV9kW6Bhvn3oiE2dkZLY0ieLmV4T'

ACCESS_TOKEN = '4727754561-IyxfJzh78d0O6kDvh1Keb8yPtpR9SYMAHNbhtZk'
ACCESS_TOKEN_SECRET = 'xcD9M8E2Td0WyLCzgYaqMhWDnvbUjac8A5WIZFrEyT7Kk'

consumer = oauth2.Consumer(key=CONSUMER_KEY, secret=CONSUMER_SECRET)
access_token = oauth2.Token(key=ACCESS_TOKEN, secret=ACCESS_TOKEN_SECRET)
client = oauth2.Client(consumer,access_token)

api_endpoint='https://api.twitter.com/1.1/search/tweets.json?q='
hashtag = input("Please enter a Hashtag:\n")

response,data =client.request(api_endpoint+hashtag+'&count=5')
tweets=json.loads(data.decode(encoding="utf-8"))
print(tweets['statuses'])
for tweet in tweets:
	print(tweet)
#print(json.loads(data.decode('utf-8')))
