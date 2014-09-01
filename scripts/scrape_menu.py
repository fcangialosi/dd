import urllib2
from bs4 import BeautifulSoup
from pprint import pprint
from pymongo import MongoClient

#client = MongoClient('localhost', 27017)
#db = client.dd
client = MongoClient("mongodb://frank:12surelyillmissyou@kahana.mongohq.com:10060/app27841021")
db = client.app27841021


response = urllib2.urlopen('http://davidanddads.com/catering%20lunch.htm')
html = response.read()

soup = BeautifulSoup(html)

platters = {}
platters['name'] = "Sandwich Platters"
platters['subhead'] = "Served with potato chips and pickles. All supplies and premium quality paper goods included."
platters['breakfast'] = False
platters['menu'] = "catering"
platters['index'] = 5
platters['items'] = []

garden_salads = {}
garden_salads['name'] = "Garden Salads"
garden_salads['subhead'] = "Accompany your platter with one or more of our many deli or garden style salads"
garden_salads['breakfast'] = False
garden_salads['menu'] = "catering"
garden_salads['index'] = 6
garden_salads['items'] = []

boxed_lunches = {}
boxed_lunches['name'] = "Boxed Lunches"
boxed_lunches['subhead'] = "Individually packed lunches in attractive black boxes. Neat and Compact. Great for working lunches. Drinks served ice cold on the side.(cups and ice upon request add $.15 per person)."
boxed_lunches['breakfast'] = False
boxed_lunches['menu'] = "catering"
boxed_lunches['index'] = 4
boxed_lunches['items'] = []

menu_items = soup.find_all('ul')
platter_items = menu_items[0:9]
garden_salad_items = menu_items[9:17]
deli_salad_items = menu_items[17:22]
boxed_lunch_items = menu_items[22:25]

for item in platter_items:
	header = [x for x in item.find('li', class_="cl-head").stripped_strings]

	obj = {}
	obj['name'] = header[0].encode('ascii','ignore').strip()
	obj['price'] = header[1].encode('ascii','ignore').split()[0].strip()
	obj['priceSuffix'] = " ".join(header[1].encode('ascii','ignore').split()[1:]).strip()
	obj['minimum'] = header[2].encode('ascii','ignore').strip()
	obj['description'] = item.find('li', class_="cl-desc").get_text().encode('ascii','ignore').replace(', ',',').replace(',',', ').replace(". ",".").replace(".",". ").replace("\t","").replace(" \n", " ").replace("\n"," ").strip()

	platters['items'].append(obj)

for item in garden_salad_items:
	header = [x for x in item.find('li', class_="cl-head").stripped_strings]

	obj = {}
	obj['name'] = header[0].encode('ascii','ignore').strip()
	obj['price'] = header[1].encode('ascii','ignore').split()[0].strip()
	if(len(header) > 2):
		obj['serves'] = header[2].encode('ascii','ignore').replace("\t","").strip()
	else:
		obj['serves'] = ""
	if(item.find('li', class_="cl-desc")):
		obj['description'] = item.find('li', class_="cl-desc").get_text().encode('ascii','ignore').replace(', ',',').replace(',',', ').replace(". ",".").replace(".",". ").replace("\t","").replace(" \n", " ").replace("\n"," ").strip()
	else:
		obj['description'] = ""
	garden_salads['items'].append(obj)

for item in boxed_lunch_items:
	header = [x for x in item.find('li', class_="cl-head").stripped_strings]

	obj = {}
	obj['name'] = header[0].encode('ascii','ignore').strip()
	obj['price'] = header[1].encode('ascii','ignore').split()[0].strip()
	obj['priceSuffix'] = " ".join(header[1].encode('ascii','ignore').split()[1:]).strip()
	if(len(header) > 2):
		obj['minimum'] = header[2].encode('ascii','ignore').strip()
	else:
		obj['minimum'] = ""
	obj['description'] = item.find('li', class_="cl-desc").get_text().encode('ascii','ignore').replace(', ',',').replace(',',', ').replace(". ",".").replace(".",". ").replace("\t","").replace(" \n", " ").replace("\n"," ").strip()

	boxed_lunches['items'].append(obj)

db.menu.insert(platters)
db.menu.insert(garden_salads)
db.menu.insert(boxed_lunches)
