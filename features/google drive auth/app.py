from flask import Flask, session, render_template
from flask.ext.session import Session

#Python session: http://pythonhosted.org/Flask-Session/



app=Flask(__name__, static_url_path='/static')
# Check Configuration section for more details
#SESSION_TYPE = 'redis'
#app.config.from_object(__name__)
#Session(app)

@app.route('/')
def index():
	return render_template('index.html')

@app.route('/gimages')
def gimages():
	return render_template('includes/gimages.html')
	
@app.route('/gslides')
def gslides():
	return render_template('includes/gslides.html')

@app.route('/twitter')
def twitter():
	return render_template('includes/twitter.html')

app.run(debug=True)