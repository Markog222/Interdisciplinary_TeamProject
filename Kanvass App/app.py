#Python session: http://pythonhosted.org/Flask-Session/
from flask import Flask, render_template, url_for, request, session, redirect, flash
from flask_pymongo import PyMongo
import bcrypt
import json

app=Flask(__name__, static_url_path='/static')

app.config['MONGO_DBNAME'] = 'kanvasslgin'
app.config['MONGO_URI'] = 'mongodb://kanvass:kanvasslogin@ds247058.mlab.com:47058/kanvasslgin'

mongo = PyMongo(app)

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

        if existing_user is None:
            hashpass = bcrypt.hashpw(request.form['pass'].encode('utf-8'), bcrypt.gensalt())
            users.insert({'name' : request.form['username'], 'password' : hashpass})
            session['username'] = request.form['username']
            return redirect(url_for('index'))

        return 'That username already exists!'

    return render_template('register.html')

@app.route('/login', methods=['POST'])
def login():
    users = mongo.db.users
    login_user = users.find_one({'name' : request.form['username']})

    if login_user:
        if bcrypt.hashpw(request.form['pass'].encode('utf-8'), login_user['password'].encode('utf-8')) == login_user['password'].encode('utf-8'):
            session['username'] = request.form['username']
            return redirect(url_for('index'))

    return 'Invalid username/password combination'

@app.route('/logout')
def logout():
    session.pop('username',None)
    flash('You have logged out.')
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
