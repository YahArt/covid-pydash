from flask import Flask
from flask import request
from flask_cors import CORS
from flask import jsonify

import services.covid_service

app = Flask("Covid-PyDash REST API")

# Create covid service for data handling
covid_service = services.covid_service.CovidService()

CORS(app)


@app.route('/dashboard_data', methods=['POST'])
def dashboard_data():
    body = request.get_json()

    start_date = body.get('startDate')
    end_date = body.get('endDate')

    information_about = body.get('informationAbout')
    information_about_unique = list(set(information_about))

    response = {
        'values': []
    }

    for information in information_about_unique:
        value = None
        # TODO: Handle other information types...
        if information == "covid_death":
            value = covid_service.get_deaths(start_date, end_date)

        response['values'].append(
            {
                'informationAbout': information,
                'value': value,
                'error': None
            }
        )
    return response


app.run(host='0.0.0.0', port=81)
