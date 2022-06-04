from flask import Flask
app = Flask("Covid-PyDash REST API")


@app.route('/test', methods=['GET'])
def test():
    return 'Web App with Python Flask!'


app.run(host='0.0.0.0', port=81)
