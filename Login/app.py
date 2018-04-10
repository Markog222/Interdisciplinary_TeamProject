#Python session: http://pythonhosted.org/Flask-Session/
from flask import Flask, render_template, url_for, request, session, redirect, flash
from flask_pymongo import PyMongo
from flask_oauth import OAuth
from collections import defaultdict
from datetime import datetime
import bcrypt
import numpy as np
import json
import re
import os
import csv
import time
import sys

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
    if 'id' in session:
        new_id=kid()
        return render_template('home.html',k_id=new_id)

    return render_template('index.html')

@app.route('/register', methods=['POST', 'GET'])
def register():
    if request.method == 'POST':
        users = mongo.db.users
        user_name = request.form['username']
        existing_user = users.find_one({'name' : request.form['username']})
        find = mongo.db.users.find({'name':user_name})
        print(existing_user)
        for user_name in find:
            store_id = (user_name['id'])
            print (store_id)
        pass1 = request.form['pass']#requesting first password from registration form
        pass2 = request.form['pass1']#requesting second password fromm registration form
        now = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        print now
        User_login_count = 1
        f = open('increment.txt','r')
        id_count = f.read()
        print (id_count)
        f.close()
            
        
        if pass1 == pass2:#Checks the passwords are the same else return error
            if len(pass1)>=6 and re.match('^(?=.*[0-9]$)(?=.*[a-zA-Z])',pass1): 
                if existing_user is None:
                    hashpass = bcrypt.hashpw(request.form['pass'].encode('utf-8'), bcrypt.gensalt())
                    users.insert({'id' : id_count, 'name' : request.form['username'],'fullname' : request.form['fullname'],'securityQ' : request.form['securityQ'],
                                  'securityA' : request.form['securityA'], 'password' : hashpass, 'Datetime' : now, 'UserLogins' : User_login_count,})
                    users = mongo.db.users
                    user_name = request.form['username']
                    existing_user = users.find_one({'name' : request.form['username']})
                    find = mongo.db.users.find({'name':user_name})
                    print(existing_user)
                    for user_name in find:
                        store_id = (user_name['id'])
                        print (store_id)
                    
                    print(id_count)
                    f = open('increment.txt','r+')
                    id_count =int(f.read())
                    f.seek(0)
                    f.write(str(id_count+1))
                    f.close()
                    session['id'] = store_id
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
        find_p = session['id']
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
                if 'id' in session:
                    hashpass = bcrypt.hashpw(request.form['pass'].encode('utf-8'), bcrypt.gensalt())
                    update =  mongo.db.users.update_one({'password' : store_pass},{'$set':{'password' : hashpass}},upsert=False)
                    session.pop('id',None)
    
                    return redirect(url_for('login'))
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

@app.route('/forgot_pass', methods=['POST', 'GET'])
def forgot_pass():
    if request.method == 'POST':
        users = mongo.db.users
        find_p = request.form['username']
        print (find_p)
        find = mongo.db.users.find({'name':find_p})
        for find_p in find:
            store_secQ = (find_p['securityQ'])
            store_user = (find_p['name'])
            store_secA = (find_p['securityA'])
            store_id = (find_p['id'])
            print (store_secQ,store_user,store_secA)
        secQ = request.form['securityQ_f']#requesting first password from registration form
        user = request.form['username']#requesting first password from registration form
        secA = request.form['securityA_f']#requesting first password from registration form
        if store_secQ == secQ and store_user == user and store_secA == secA:#Checks the passwords are the same else return error
            session['id'] = store_id
            return redirect(url_for('reset'))
        else:
            flash('User details do not match!','category2')
            return redirect (url_for('forgot_pass'))
                             
    return render_template('forgot_pass.html')


@app.route('/login', methods=['POST'])
def login():
        users = mongo.db.users
        login_user = users.find_one({'name' : request.form['username']})#find username
        
        if login_user:
            find_l = request.form['username']
            print (find_l)
            cnt_user_login = mongo.db.users.find({'name':find_l})
            for find_l in cnt_user_login:
                store_cnt =(login_user['UserLogins'])
                store_id =(login_user['id'])
            print(store_cnt)
            if bcrypt.hashpw(request.form['pass'].encode('utf-8'), login_user['password'].encode('utf-8')) == login_user['password'].encode('utf-8'):
                #if password equals database password login
                session['id'] = store_id
                inc_login = store_cnt +1
                update_login_usr =  mongo.db.users.update_one({'UserLogins' : store_cnt},{'$set':{'UserLogins' : inc_login}},upsert=False)
            return redirect(url_for('index'))

        flash('Invalid username/password combination','category2')
        return redirect(url_for('index'))   

@app.route('/logout')
def logout():
    session.pop('id',None)
    flash('You have logged out.','category1')
    return redirect('/')

@app.route('/export')
def export():
    for doc in mongo.db.users.find():
        print(doc)
        #header = ('Password','Username','Security Question','Date','UserLogins','User','Id','Security Ans')
        store = []
        store.append(doc)
        print store
        f =  open ('userdata.csv','a')
        #f.write(str(header))
        #f.write(',')
        #f.write('\n')
        for i in range(len(store)):
            f.write(str(store))
            f.write(',')
            f.write('\n')
        f.close()
        os.chdir(sys.path[0])
        os.system('start excel.exe "%s\\userdata.csv"' % (sys.path[0], ))
    return redirect(url_for('index'))

@app.route('/myaccount', methods=['POST','GET'])
def myaccount():
    users_1 = mongo.db.users.find_one({'id' : session['id']})
    if request.method == 'POST':
        if request.form['submit']== 'changeName':
            pass
            users = mongo.db.users
            find_p = session['id']
            print (find_p)
            find = mongo.db.users.find({'id':find_p})
            max_id = mongo.db.users.find_one(sort[("id" ,pymongo.DESCENDING)])
            print(max_id)
            for find_p in find:
                store_pass = (find_p['password'])
                store_user = (find_p['name'])
                store_full = (find_p['fullname'])
                store_id = (find_p['_id'])
                update_full = request.form['fullname']
                print update_full
                print (store_pass,store_user,store_full,store_id)
                update =  mongo.db.users.update_one({'fullname' : store_full},{'$set':{'fullname' : request.form['fullname']}},upsert=False)
                print(update)
    
        elif request.form['submit']== 'changeuser':
            pass
            users = mongo.db.users
            find_p = session['id']
            print (find_p)
            find = mongo.db.users.find({'id':find_p})
            for find_p in find:
                store_pass = (find_p['password'])
                store_user = (find_p['name'])
                store_full = (find_p['fullname'])
                store_id = (find_p['_id'])
                update_full = request.form['fullname']
                print update_full
                print (store_pass,store_user,store_full,store_id)
                update =  mongo.db.users.update_one({'name' : store_user},{'$set':{'name' : request.form['username']}},upsert=False)
                print(update)    
        
        flash('Your details have been updated!','category2')
        return redirect(url_for('myaccount'))

    return render_template('myaccount.html', user=users_1)

@app.route('/delete_acc', methods=['GET','POST'])
def delete_acc():
    users = mongo.db.users
    delete_acc = mongo.db.users.find_one({'id' : session['id']})
    print(delete_acc)
    if delete_acc:
        delete = mongo.db.users.delete_one({'id' : session['id']})
        session.pop('id',None)
    flash('You have deleted your account','category1')
    return redirect(url_for('index'))

@app.route('/create')
def create():
	if 'id' in session:
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
            "owner":session['id'],
            "shared":0,
            "shareid":0,
            "sharedwith":[],
            "viewSize": data[0]['viewSize']
        })
    else:
        kanDB.find_one_and_replace({"kid":data[0]['kid']},{
            "owner":session['id'],
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
