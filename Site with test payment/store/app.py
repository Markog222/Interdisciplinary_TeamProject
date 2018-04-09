from flask import Flask, render_template, request, redirect, url_for
import stripe

app = Flask(__name__)

pub_key = 'pk_test_tzIA6eTLVrrdY5wDMlhodZmt'
secret_key = 'sk_test_DDtqMcR6lYJqWETT0RQ6bZ4E'

stripe.api_key = secret_key

@app.route('/index')
def index():
    return render_template('index.html', pub_key=pub_key)

@app.route('/thanks')
def thanks():
    return render_template('thanks.html')

@app.route('/pricing')
def pricing():
    return render_template('pricing.html', pub_key=pub_key)

@app.route('/pay', methods=['POST'])
def pay():
    
    customer = stripe.Customer.create(email=request.form['stripeEmail'], source=request.form['stripeToken'])

    charge = stripe.Charge.create(
        customer=customer.id,
        amount=19900,
        currency='eur',
        description='payment'
    )

    return redirect(url_for('thanks'))

if __name__ == '__main__':
    app.run(debug=True)
