from flask import Flask

app=Flask(__name__)

@app.route('/')
def index():
    return 'Hello world!'

@app.route('/api_save')
def save():
    return 'Saved'


app.run(debug=True);
