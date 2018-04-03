#Python session: http://pythonhosted.org/Flask-Session/
from flask import Flask, render_template, url_for, request, session, redirect, flash
from flask_pymongo import PyMongo
from flask_oauth import OAuth
import bcrypt
import json
import re

app=Flask(__name__, static_url_path='/static')
#app.debug = DEBUG
app.config['MONGO_DBNAME'] = 'kanvasslgin'
app.config['MONGO_URI'] = 'mongodb://kanvass:kanvasslogin@ds247058.mlab.com:47058/kanvasslgin'
#GOOGLE_CLIENT_ID = '799140526216-ba5ib3ejqkq0k02fa9nk2debtijt72t4.apps.googleusercontent.com'
#GOOGLE_CLIENT_SECRET = 'snO9Vfar1RqqR6FBZkzC386q'
#REDIRECT_URI = '/oauth2callback'

#SECRET_KEY = 'development key'
#DEBUG = True

mongo = PyMongo(app)
#oauth = OAuth()

#google = oauth.remote_app('google',
#                          base_url='https://www.google.com/accounts/',
#                          authorize_url='https://accounts.google.com/o/oauth2/auth',
#                          request_token_url=None,
#                          request_token_params={'scope': 'https://www.googleapis.com/auth/userinfo.email',
#                                                'response_type': 'code'},
#                          access_token_url='https://accounts.google.com/o/oauth2/token',
#                          access_token_method='POST',
#                          access_token_params={'grant_type': 'authorization_code'},
#                          consumer_key=GOOGLE_CLIENT_ID,
#                          consumer_secret=GOOGLE_CLIENT_SECRET)
#
# Login and Registration
# @reference: https://www.youtube.com/watch?v=vVx1737auSE
#

def kid():
    kanvasses=mongo.db.kanvasses
    count=kanvasses.count()

    return count+1

@app.route('/')
def index():
    if 'username' in session:
        new_id=kid()
        return render_template('home.html',k_id=new_id)

    return render_template('index.html')

@app.route('/register', methods=['POST', 'GET'])
def register():
    if request.method == 'POST':
        users = mongo.db.users
        existing_user = users.find_one({'name' : request.form['username']})
        pass1 = request.form['pass']#requesting first password from registration form
        pass2 = request.form['pass1']#requesting second password fromm registration form
        
        if pass1 == pass2:#Checks the passwords are the same else return error
            if len(pass1)>=6 and re.match('^(?=.*[0-9]$)(?=.*[a-zA-Z])',pass1): 
                if existing_user is None:
                    hashpass = bcrypt.hashpw(request.form['pass'].encode('utf-8'), bcrypt.gensalt())
                    users.insert({'name' : request.form['username'],'fullname' : request.form['fullname'], 'password' : hashpass})
                    #adding to database
                    session['username'] = request.form['username']
                    return redirect(url_for('index'))
                else:
                    flash('That username already exists!','category2')
                    return redirect (url_for('register'))
            else:
                flash('Password must be six characters long and alphanumeric','category2')
                return redirect (url_for('register'))            
        else:
            flash('The passwords do not match!','category2')
            return redirect (url_for('register'))

    return render_template('register.html')

@app.route('/reset', methods=['POST', 'GET'])
def reset():
    if request.method == 'POST':
        users = mongo.db.users
        find_p = session['username']
        print (find_p)
        find = mongo.db.users.find({'name':find_p})
        for find_p in find:
            store_pass = (find_p['password'])
            store_user = (find_p['name'])
            store_full = (find_p['fullname'])
            store_id = (find_p['_id'])
            print (store_pass,store_user,store_full,store_id)
        pass1 = request.form['pass']#requesting first password from registration form
        pass2 = request.form['pass1']#requesting first password from registration form
        if pass1 == pass2:#Checks the passwords are the same else return error
            if len(pass1)>=6 and re.match('^(?=.*[0-9]$)(?=.*[a-zA-Z])',pass1): 
                if 'username' in session:
                    hashpass = bcrypt.hashpw(request.form['pass'].encode('utf-8'), bcrypt.gensalt())
                    update =  mongo.db.users.update_one({'password' : store_pass},{'$set':{'password' : hashpass}},upsert=False)
                    #replace = mongo.db.users.replace_one({'password' : store_pass},{'_id' : store_id},{'fullname' : store_full},{'password' : hashpass},{'name' : store_full})
    
                    return redirect(url_for('index'))
                else:
                    flash('That username does not exist!','category2')
                    return redirect (url_for('reset'))
            else:
                flash('Password must be six characters long and alphanumeric','category2')
                return redirect (url_for('reset'))            
        else:
            flash('The passwords do not match!','category2')
            return redirect (url_for('reset'))

    return render_template('reset.html')

@app.route('/login', methods=['POST'])
def login():
        users = mongo.db.users
        login_user = users.find_one({'name' : request.form['username']})#find username

        if login_user:
            if bcrypt.hashpw(request.form['pass'].encode('utf-8'), login_user['password'].encode('utf-8')) == login_user['password'].encode('utf-8'):
                #if password equals database password login
                session['username'] = request.form['username']
                return redirect(url_for('index'))

        flash('Invalid username/password combination','category2')
        return redirect(url_for('index'))   

@app.route('/logout')
def logout():
    session.pop('username',None)
    flash('You have logged out.','category1')
    return redirect('/')

@app.route('/create')
def create():
	if 'username' in session:
		return render_template('create.html')

	return render_template('index.html')

@app.route('/save', methods=['POST'])
def save():
    widgets=json.loads(request.data)['widgets']
    result=saveKanvass(widgets)
    #esult=insertWidgets(widgets,widgetsDb)
    return result

@app.route('/delWidget',methods=['POST'])
def delWidget():
    data=json.loads(request.data)['delWidget']
    print(wid)
    widgetsDb=mongo.db.widgets
    widgetsDb.delete_one({"kid":wid[0]['kid'],"kid":wid[0]['wid']})

    return True

# Update writing to DB with bulk_write for better performance later
def saveKanvass(data):
    kanDB=mongo.db.kanvasses
    check=kanDB.count({"kid":data[0]['kid']})
    if check==0:
        kanDB.insert({
            "kid":data[0]['kid'],
            "owner":session['username'],
            "shared":0,
            "shareid":0,
            "sharedwith":[],
            "viewSize": data[0]['viewSize']
        })
    else:
        kanDB.find_one_and_replace({"kid":data[0]['kid']},{
            "owner":session['username'],
            "shared":0,
            "shareid":0,
            "sharedwith":[],
            "viewSize": data[0]['viewSize']
        })

    result=insertWidgets(data)
    return result

def insertWidgets(data):
    widDb=mongo.db.widgets
    for widget in data:
        check=widDb.count({"kid":data[0]['kid'],"wid":widget['wid']})
        if check==0:
            widDb.insert({
                "kid":widget['kid'],
                "wid":widget['wid'],
                "type":widget['type'],
                "style":widget['style'],
                "pos":widget['pos'],
                "height":widget['height'],
                "width":widget['width'],
                "link":widget['link']
            })
        else:
            widDb.find_one_and_replace({"kid":widget['kid'],
            "wid":widget['wid']},{
                "type":widget['type'],
                "style":widget['style'],
                "pos":widget['pos'],
                "height":widget['height'],
                "width":widget['width'],
                "link":widget['link']
            })
    return 'true'

app.secret_key = 'mysecret'
app.run(debug=True)
