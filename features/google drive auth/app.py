from flask import Flask, session, render_template
from flask.ext.session import Session

#Python session: http://pythonhosted.org/Flask-Session/



app=Flask(__name__)
# Check Configuration section for more details
SESSION_TYPE = 'redis'
app.config.from_object(__name__)
Session(app)

@app.route('/')
def index():
	return render_template('index.html')

@app.route('/gslides')
def gslides():
	return render_template('gslides.html')


app.run(debug=True)