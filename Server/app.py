import os

import urllib2
import json
from bottle import route, run
import pymongo

# For local development
# client = pymongo.MongoClient("localhost", 27017)

client = pymongo.MongoClient(os.environ.get('MONGOHQ_URL'))

# get a handle to the productify database
# db = client.productify
db = client.app29346808

websites = db.websites

@route('/')
def home_page():
	return 'Hello World!'

@route('/getwebsitecategory/<website_id>')
def website_id_from_url(website_id):
	db_category = get_category_from_db(website_id)
	if (db_category != 'unassigned'):
		return db_category
	else:
		new_category = get_new_category_from_api(website_id)
		insert_website_to_db(website_id, new_category)
		return new_category


def get_new_category_from_api(website_id):

	# for testing purposes
	print 'Requesting new category...'

	url = "http://api.similarweb.com/Site/" + website_id + "/v2/category?Format=JSON&UserKey=a6fd04d833f2c28ce7c30dc957bf481e"
	response = urllib2.urlopen(url)
	
	parsed = json.loads(response.read())
	full_category = parsed['Category']

	# for testing purposes
	print 'Full category is ' + full_category

	category = clean_category(full_category)

	# for testing purposes
	print 'Cleaned category is ' + category

	return category

def clean_category(full_category):

	# for testing purposes
	print 'Cleaning category...'

	short_category = full_category.split('/')[0]
	
	try:
		second_part = full_category.split('/')[1]
	except:
		second_part = ""

	# for testing purposes
	print 'First part is ' + short_category
	print 'Second part is ' + second_part

	if (short_category == 'Books_and_Literature'):
		return 'Books'
	if (short_category == 'Business_and_Industry'):
		return 'Business'
	if (short_category == 'Internet_and_Telecom'):
		if (second_part == 'Chats_and_Forums') or (second_part == 'Social_Network'):
			return 'Social'
		elif (second_part == "Search_Engine"):
			return 'Search'
		else:
			return 'Internet_and_Telecom'
	if (short_category == 'News_and_Media'):
		return 'News'
	if (short_category == 'Pets_and_Animals'):
		return 'Animals'
	return short_category



def get_category_from_db(website_id):
	query = {'_id' : website_id}

	try:
		doc = websites.find_one(query)
	except:
		return 'unassigned'

	try:	
		category = doc['category']
	except:
		return 'unassigned'

	if (category is None) or (category == ""):
		return 'unassigned'
	else:
		return category



def insert_website_to_db(website_id, category):
	data = {'_id': website_id, 'category': category}
	websites.insert(data)


# bottle.debug(True)
# bottle.run(host='localhost',port='8080')
run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))





