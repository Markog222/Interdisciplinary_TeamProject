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
        kans=getAllKans()
        shared=allSharedKans()
        d={}
        d['k_id']=new_id
        kan_list=[]
        shared_list=[]
        for kan in kans:
            kan_list.append(kan['kid'])
        d['kans']=kan_list
        for share in shared:
            shared_list.append(share['kid'])
        d['shared']=shared_list
        dJson=json.dumps(d)
        return render_template('home.html',data=dJson)

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
    widgetsDb=mongo.db.widgets
    widgetsDb.delete_one({"kid":wid[0]['kid'],"kid":wid[0]['wid']})

    return True

@app.route('/view')
def view():

    if 'username' in session:
        k_id=request.args.get('k')
        kDb=mongo.db.kanvasses
        wDb=mongo.db.widgets
        kanvass=kDb.find_one({'kid':k_id})
        widgets=wDb.find({'kid':k_id})
        d={}
        kanvass.pop('_id',None)
        d['kan']=kanvass
        widget_list=[]
        for item in widgets:
            item.pop('_id',None)
            widget_list.append(item)

        d['widgets']=widget_list
        d=json.dumps(d)

        return render_template('view.html',data=d)

    return render_template('index.html')

@app.route('/edit')
def edit():

    if 'username' in session:
        k_id=request.args.get('k')
        kDb=mongo.db.kanvasses
        wDb=mongo.db.widgets
        kanvass=kDb.find_one({'kid':k_id})
        widgets=wDb.find({'kid':k_id})
        d={}
        kanvass.pop('_id',None)
        d['kan']=kanvass
        widget_list=[]
        for item in widgets:
            item.pop('_id',None)
            widget_list.append(item)

        d['widgets']=widget_list
        d=json.dumps(d)

        return render_template('edit.html',data=d)

    return render_template('index.html')

# Update writing to DB with bulk_write for better performance later
def saveKanvass(data):
    kanDB=mongo.db.kanvasses
    check=kanDB.count({"kid":data[0]['kid']})
    if check==0:
        print(data)
        kanDB.insert({
            "kid":data[0]['kid'],
            "owner":session['username'],
            "heading":data[0]['heading'],
            "shared":0,
            "shareid":0,
            "sharedwith":[],
            "viewSize": data[0]['viewSize']
        })
    else:
        kanDB.find_one_and_replace({"kid":data[0]['kid']},{
            "kid":data[0]['kid'],
            "owner":session['username'],
            "heading":data[0]['heading'],
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
                "kid":widget['kid'],
                "wid":widget['wid'],
                "type":widget['type'],
                "style":widget['style'],
                "pos":widget['pos'],
                "height":widget['height'],
                "width":widget['width'],
                "link":widget['link']
            })
    return 'true'

def getAllKans():
    kDb=mongo.db.kanvasses
    kans=kDb.find({"owner":session['username']})
    return kans

def allSharedKans():
    kDB=mongo.db.kanvasses
    shared=kDB.find({"sharedwith": session['username']})
    return shared

app.secret_key = 'mysecret'
app.run(debug=True)
