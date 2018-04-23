#Python session: http://pythonhosted.org/Flask-Session/
from flask import Flask, render_template, url_for, request, session, redirect, flash
from flask_pymongo import PyMongo
from flask_oauth import OAuth
from flask_mail import Mail, Message
import bcrypt
import json
from collections import defaultdict
from datetime import datetime
import random
import numpy as np
import re
import os
import csv
import time
import sys
import stripe

app=Flask(__name__, static_url_path='/static')
mail=Mail(app)

#For connecting to mail server
app.config['MAIL_SERVER']='smtp.gmail.com'
app.config['MAIL_PORT'] = 465
app.config['MAIL_USERNAME'] = 'kanvass.email@gmail.com'
app.config['MAIL_PASSWORD'] = 'kanvassmail'
app.config['MAIL_USE_TLS'] = False
app.config['MAIL_USE_SSL'] = True
mail = Mail(app)

#For connecting to our MongoDB
app.config['MONGO_DBNAME'] = 'kanvasslgin'
app.config['MONGO_URI'] = 'mongodb://kanvass:kanvasslogin@ds247058.mlab.com:47058/kanvasslgin'

#For Stripe login
pub_key = 'pk_test_tzIA6eTLVrrdY5wDMlhodZmt'
secret_key = 'sk_test_DDtqMcR6lYJqWETT0RQ6bZ4E'
stripe.api_key = secret_key

mongo = PyMongo(app)
# Login and Registration
# @reference: https://www.youtube.com/watch?v=vVx1737auSE
#

def kid():
    kanvasses=mongo.db.kanvasses
    count=kanvasses.count()

    return count+1

@app.route('/')
def index():
    return render_template('index.html', pub_key=pub_key)

@app.route('/login')
def admin():
    if 'id' in session:
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

    return render_template('login.html')

@app.route('/thanks')
def thanks():
    return render_template('thanks.html')

@app.route('/pricing')
def pricing():
    return render_template('pricing.html', pub_key=pub_key)

@app.route('/contact')
def contact():
    return render_template('contact.html', pub_key=pub_key)

@app.route('/contactemail', methods=['POST'])
def contactemail():
    msg = Message('A message from Kanvass', sender = 'kanvass.email@gmail.com', recipients = 'kanvass.email@gmail.com')#
    msg.body = "Your unique password reset number is "+str(random)
    mail.send(msg)

    return render_template('contact.html', pub_key=pub_key)


@app.route('/paybusiness', methods=['POST'])
def paybusiness():

    customer = stripe.Customer.create(email=request.form['stripeEmail'], source=request.form['stripeToken'])

    charge = stripe.Charge.create(
        customer=customer.id,
        amount=9900,
        currency='eur',
        description='payment'
    )

    return redirect(url_for('register'))

@app.route('/payenterprise', methods=['POST'])
def payenterprise():

    customer = stripe.Customer.create(email=request.form['stripeEmail'], source=request.form['stripeToken'])

    charge = stripe.Charge.create(
        customer=customer.id,
        amount=19900,
        currency='eur',
        description='payment'
    )

    return redirect(url_for('register'))

@app.route('/register', methods=['POST', 'GET'])
def register():
    if request.method == 'POST':
        users = mongo.db.users
        user_name = request.form['username']#request  username from form
        existing_user = users.find_one({'name' : request.form['username']})# Checck to see if user exists
        find = mongo.db.users.find({'name':user_name}) #Query database for the full document matching the username
        for user_name in find:
            store_id = (user_name['id'])#find the id according to username
        pass1 = request.form['pass']#requesting first password from registration form
        pass2 = request.form['pass1']#requesting second password from registration form
        email = request.form['username']
        now = datetime.now().strftime('%Y-%m-%d %H:%M:%S') #getting the time for storage for analysis data
        User_login_count = 1 # Adding 1 to user, this will be the basis for counting number of logins
        id_count = getID()# Calling id count generator

        if pass1 == pass2:#Checks the passwords are the same else return error
            if re.match(r'^[a-zA-Z0-9._-]+[@][a-zA-Z0-9._-]+[.]+[a-zA-Z]+$',email) is not None:
                if len(pass1)>=6 and re.match(r'[A-Za-z0-9!@#$%^&+=]',pass1) is not None: # password must be  6 characters,number,a letter and special chracter
                    if existing_user is None:# if no user exists
                        hashpass = bcrypt.hashpw(request.form['pass'].encode('utf-8'), bcrypt.gensalt())# request the password  from form and encrypt using bcrypt
                        users.insert({'id' : id_count, 'name' : request.form['username'],'fullname' : request.form['fullname'],'securityQ' : request.form['securityQ'],
                                      'securityA' : request.form['securityA'], 'password' : hashpass, 'Datetime' : now, 'UserLogins' : User_login_count,})#insert to database
                        users = mongo.db.users
                        user_name = request.form['username']
                        existing_user = users.find_one({'name' : request.form['username']})
                        find = mongo.db.users.find({'name':user_name})
                        for user_name in find:
                            store_id = (user_name['id'])
                        id_count =getID()
                        session['id'] = store_id
                        return redirect('/login')
                    else:
                        flash('That username already exists!','category2')#flash message if the condition is not met
                        return redirect (url_for('register'))
                else:
                    flash('Password must be six characters long, alphanumeric and must not contain characters (+ ? . * ^ $ ( ) [ ] { } | \)','category2')
                    return redirect (url_for('register'))
            else:
                flash('Your user name must be an email address','category2')
                return redirect (url_for('register'))
        else:
            flash('The passwords do not match!','category2')
            return redirect (url_for('register'))

    return render_template('register.html')

@app.route('/reset', methods=['POST', 'GET'])
def reset():
    if 'id' in session:
        if request.method == 'POST':
            users = mongo.db.users
            find_p = session['id']
            print (find_p)
            find = mongo.db.users.find({'id':find_p})
            for find_p in find:
                store_pass = (find_p['password'])
                store_user = (find_p['name'])
                store_full = (find_p['fullname'])
                store_id = (find_p['_id'])
                print (store_pass,store_user,store_full,store_id)
            pass1 = request.form['pass']#requesting first password from registration form
            pass2 = request.form['pass1']#requesting first password from registration form
            if pass1 == pass2:#Checks the passwords are the same else return error
                if len(pass1)>=6 and re.match('^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[^A-Za-z0-9_]$)',pass1):
                    if 'id' in session:
                        hashpass = bcrypt.hashpw(request.form['pass'].encode('utf-8'), bcrypt.gensalt())
                        update =  mongo.db.users.update_one({'password' : store_pass},{'$set':{'password' : hashpass}},upsert=False)
                        session.pop('id',None)

                        return redirect('/login')
                    else:
                        flash('That username does not exist!','category2')
                        return redirect (url_for('reset'))
                else:
                    flash('Password must be six characters long, alphanumeric and must not contain characters (+ ? . * ^ $ ( ) [ ] { } | \)','category2')
                    return redirect (url_for('reset'))
            else:
                flash('The passwords do not match!','category2')
                return redirect (url_for('reset'))

        return render_template('reset.html')

    else:
        return redirect('/login')

@app.route('/forgot_pass', methods=['POST', 'GET'])
def forgot_pass():
    random = getRand() #calling random number to be stored in database
    if request.method == 'POST':
        users = mongo.db.users
        randTime = datetime.now().timetuple().tm_yday#Day of year to be stored in database
        find_p = request.form['username']
        find = mongo.db.users.find({'name':find_p})
        for find_p in find:
            store_secQ = (find_p['securityQ'])#storing data to variable
            store_user = (find_p['name'])
            store_secA = (find_p['securityA'])
            store_id = (find_p['id'])
        secQ = request.form['securityQ_f']#requesting security Question from form
        user = request.form['username']#requesting username from form
        secA = request.form['securityA_f']#requesting Security Answer form
        if store_secQ == secQ and store_user == user and store_secA == secA:#Checks the passwords are the same else return error
            session['id'] = store_id
            if 'id' in session:
                randUpdate = mongo.db.users.update({'id':store_id},{'$set':{'randNum':random, 'randTime': randTime}}, upsert=False)#updaing the document and placing new variables
                msg = Message('A message from Kanvass', sender = 'kanvass.email@gmail.com', recipients = [request.form['username']])#Email message details
                msg.body = "Your unique password reset number is "+str(random)# Adding the random number to email
                mail.send(msg)# send email
            flash('Please Check your email','category2')# Flash message that will show in the insert number page
            return redirect(url_for('number'))
        else:
            flash('User details do not match!','category2')
            return redirect (url_for('forgot_pass'))

    return render_template('forgot_pass.html')

def getRand():
    rand=random.randint(100000,1000000)#Generate random number between 100000 and 1000000
    return rand

def getDOY():
    doy = datetime.now().timetuple().tm_yday# getting the day of year
    return doy

@app.route('/number', methods=['POST', 'GET'])
def number():
    if request.method == 'POST':
        users = mongo.db.users
        find_d = session['id']
        find = mongo.db.users.find({'id':find_d})
        for find_d in find:
            store_randTime = (find_d['randTime'])
            store_randNum = (find_d['randNum'])
            daylimit = getDOY()- store_randTime # getting the difference between  stored day and today
        if store_randNum != request.form['reset']: # check to see if the number in the database matches the one entered by the user
            if daylimit <30:# setting the expiry of the number to less than 30 days

                return redirect (url_for('reset'))

            else:
                flash('Your reset number has expired!','category2')
                return redirect (url_for('number'))
        else:
            flash('User details do not match!','category2')
            return redirect (url_for('number'))

    return render_template('number.html')


@app.route('/loginprocess', methods=['POST'])
def login():
        users = mongo.db.users
        login_user = users.find_one({'name' : request.form['username']})#find username

        if login_user:
            find_l = request.form['username']
            cnt_user_login = mongo.db.users.find({'name':find_l})
            for find_l in cnt_user_login:
                store_cnt =(login_user['UserLogins'])
                store_id =(login_user['id'])
            if bcrypt.hashpw(request.form['pass'].encode('utf-8'), login_user['password'].encode('utf-8')) == login_user['password'].encode('utf-8'):
                #if password equals database password login
                session['id'] = store_id
                inc_login = store_cnt +1 #increment login count by 1
                update_login_usr =  mongo.db.users.update_one({'UserLogins' : store_cnt},{'$set':{'UserLogins' : inc_login}},upsert=False)
            return redirect('/login')

        flash('Invalid username/password combination','category2')
        return redirect('/login')

@app.route('/logout')
def logout():
    session.pop('id',None)
    flash('You have logged out.','category1')
    return redirect('/login')

@app.route('/export')
def export():#exort data from the database
    if 'id' in session:
        for doc in mongo.db.users.find():
            store = []
            store.append(doc)
            f =  open ('userdata.csv','a')#create a csv
            for i in range(len(store)):
                f.write(str(store))
                f.write(',')
                f.write('\n')
            f.close()
            os.chdir(sys.path[0])
            os.system('start excel.exe "%s\\userdata.csv"' % (sys.path[0], ))#start excel
        return redirect('/login')

    else:
        return redirect('/login')

#@app.route('/id')
def getID():
    users = mongo.db.users
    latest = mongo.db.users.find_one(sort=[("id", -1)])
    for k,v in latest.iteritems():
        if k == 'id':
            new_id = int(v)+1
    return new_id


@app.route('/myaccount', methods=['POST','GET'])
def myaccount():
    if 'id' in session:
        users_1 = mongo.db.users.find_one({'id' : session['id']})
        if request.method == 'POST':
            if request.form['submit']== 'changeName':
                pass
                users = mongo.db.users
                find_p = session['id']
                print (find_p)
                find = mongo.db.users.find({'id':find_p})
                max_id = mongo.db.users.find_one(sort=[("id", -1)])
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

    else:
        return redirect('/login')


@app.route('/delete_acc', methods=['GET','POST'])
def delete_acc():
    if 'id' in session:
        users = mongo.db.users
        delete_acc = mongo.db.users.find_one({'id' : session['id']})
        print(delete_acc)
        if delete_acc:
            delete = mongo.db.users.delete_one({'id' : session['id']})
            session.pop('id',None)
        flash('You have deleted your account','category1')
        return redirect('/login')
    else:
        return redirect('/login')


@app.route('/create')
def create():
	if 'id' in session:
		return render_template('create.html')

	return redirect('/login')

@app.route('/save', methods=['GET','POST'])
def save():
    if 'id' in session:
        if request.data != '':
            widgets=json.loads(request.data)['widgets']
            result=saveKanvass(widgets,1)
            #esult=insertWidgets(widgets,widgetsDb)
            return result
        else:
            return '{"error":"You cannot use access this website like this"}'
    else:
        return redirect('/login')

@app.route('/delWidget',methods=['GET','POST'])
def delWidget():
    if 'id' in session:
        if request.data != '':
            data=json.loads(request.data)['delWidget']
            widgetsDb=mongo.db.widgets
            widgetsDb.delete_one({"kid":data[0]['kid'],"wid":data[0]['wid']})
            return 'Success'
        else:
            return 'Fail'

    else:
        return redirect('/login')

@app.route('/sharePPL', methods=['POST'])
def sharePPL():
    if 'id' in session:
        kid=request.data
        kDb=mongo.db.kanvasses
        uDb=mongo.db.users
        k=kDb.find_one({"kid":kid})
        c=uDb.find({})
        #will get the users that the kanvass is already shared with
        d={} # Object to store the user info for the autocomplete and users the kanvass has already been shared in
        users=[] # list to store the user objects in
        shared=[] # list to store the user objects in which have been shared already
        sharedAlready=k['sharedwith']
        print(1)
        for item in c:
            sharedetail={} #temp object to store one users info
            tpName=''
            tpId=0
            tp2Id=0
            check=0
            for key, val in item.iteritems():
                if key == 'id':
                    if val in sharedAlready:
                        tpId=val
                        check=1
                    else:
                        tp2Id=val
                elif key == 'fullname':
                    tpName = val
                if check == 1 and tpId > 0:
                    sharedetail['f']=tpName
                    sharedetail['id']=tpId
                    if sharedetail not in shared:
                        shared.append(sharedetail)
                elif tp2Id > 0:
                    sharedetail['f']=tpName
                    sharedetail['id']=tp2Id
                    if sharedetail not in shared:
                        if sharedetail not in users and tp2Id != session['id']:
                            users.append(sharedetail)

        d['source']=users
        d['sharedwith']=shared
        #print(d)
        return json.dumps(d)
    else:
        return redirect('/login')

@app.route('/share',methods=['POST'])
def share():
    if 'id' in session:
        if request.data != '':
            e=[]
            data=[]
            widgets={}
            kDb=mongo.db.kanvasses
            d=json.loads(request.data)['data']
            k=json.loads(request.data)['kid']
            kid=kDb.find_one({'kid':k})
            for ki,vi in kid.iteritems():
                if ki == 'sharedwith':
                    shared=vi
                else:
                    widgets[ki]=vi
            for item in d:
                if not item in e and not item in shared and item != session['id']:
                    e.append(item)

            print('new:')
            print(e)
            print('old:')
            print(shared)
            widgets['sharedwith']=shared+e
            #data['widgets']=widgets
            data.append(widgets)
            saveKanvass(data,0)
            print('sendEmails')
            #Pass in e = new shared
            sendEmails(e,k)
        else:
            print("error")
        return 'True'
    else:
        return redirect('/login')

@app.route('/unshare',methods=['POST'])
def unshare():
    if 'id' in session:
        if request.data != '':
            d=json.loads(request.data)
            kDb=mongo.db.kanvasses
            kan=kDb.find_one({'kid':d['kid']})
            arr=[x for x in kan['sharedwith'] if x != int(d['unshareid'])]
            kDb.update_one({'kid' : d['kid']},{'$set':{'sharedwith' : arr}},upsert=False)


            return 'true'
        else:
            return 'error'
    else:
        return 'false'

@app.route('/view')
def view():
    if 'id' in session:
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

    return redirect('/login')

@app.route('/delKanvass',methods=['POST'])
def deleteKanvass():
    if 'id' in session:
        kanDb=mongo.db.kanvasses
        widDb=mongo.db.widgets
        k=widDb.delete_many({'kid':request.data})
        w=kanDb.delete_one({'kid':request.data})
        c=w.deleted_count + k.deleted_count
        return str(c)

    else:
         return redirect('/login')

@app.route('/edit')
def edit():
    if 'id' in session:
        k_id=request.args.get('k')
        kDb=mongo.db.kanvasses
        wDb=mongo.db.widgets
        kanvass=kDb.find_one({'kid':k_id})
        widgets=wDb.find({'kid':k_id})
        cnt=wDb.count({'kid':k_id})
        print('num widgets: '+str(cnt))
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

    return redirect('/login')

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):
    #return 'You want path: %s' % path
    return redirect('/login')


# Update writing to DB with bulk_write for better performance later
def saveKanvass(data,widgets):
    kanDB=mongo.db.kanvasses
    check=kanDB.count({"kid":data[0]['kid']})
    print(data[0])
    sharedwith=data[0]['sharedwith'] if len(data[0]['sharedwith']) > 0 else []
    #check=kanDB.count({"kid":data[0]['kid']})
    if check==0:
        print(data)
        kanDB.insert({
            "kid":data[0]['kid'],
            "owner":session['id'],
            "heading":data[0]['heading'],
            "shared":0,
            "shareid":0,
            "sharedwith":sharedwith,
            "viewSize": data[0]['viewSize']
        })
    else:
        kanDB.find_one_and_replace({"kid":data[0]['kid']},{
            "kid":data[0]['kid'],
            "owner":session['id'],
            "heading":data[0]['heading'],
            "shared":0,
            "shareid":0,
            "sharedwith":sharedwith,
            "viewSize": data[0]['viewSize']
        })
    if widgets != 0:
        result=insertWidgets(data)
    else:
        result='true'
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
                "link":widget['link'],
                "textstyle":widget['textstyle'],
                "chart_data":widget['chart_data'],
                "twitter_data":widget['twitter_data']
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
                "link":widget['link'],
                "textstyle":widget['textstyle'],
                "chart_data":widget['chart_data'],
                "twitter_data":widget['twitter_data']
            })
    return 'true'

@app.route('/emails')
def emails():
    li = [6,8,10]
    sendEmails(li,"3")

    return 'true'

def sendEmails(ids,k):
    uDb=mongo.db.users
    kDb=mongo.db.kanvasses
    users=uDb.find({'id':{'$in':ids}})
    kan=kDb.find_one({'kid':k})
    owner=uDb.find_one({'id':kan['owner']})
    heading=kan['heading'] if kan['heading'] != '' else 'Untitled Kanvass'
    owns=owner['fullname']

    for item in users:

        email=item['name']
        fullname=item['fullname']
        link="http://localhost:5000/view?k="+k
        msg = Message('A Kanvass has been shared with you', sender = 'noreply@kanvass.com', recipients = [email])
        msg.html = "<html><head><title></title></head><body>Hi "+fullname+", <br /><br />"+owns+ " has shared Kanvass titled '"+heading+"' with you."
        msg.html = msg.html + "<br /><br />To access it please click <a href='"+link+"'>here</a>."
        msg.html = msg.html + "<br /><br />Your Kanvass Team</body></html>"
        mail.send(msg)
    return 'true'

def getAllKans():
    kDb=mongo.db.kanvasses
    kans=kDb.find({"owner":session['id']})
    return kans

def allSharedKans():
    kDB=mongo.db.kanvasses
    shared=kDB.find({"sharedwith": session['id']})
    return shared

app.secret_key = 'mysecret'
app.run(debug=True)
