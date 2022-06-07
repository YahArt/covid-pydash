from flask import Flask
from flask import request
from flask_cors import CORS
from flask import jsonify
from flask import make_response

import services.covid_service
import json
import glob

app = Flask("Covid-PyDash REST API")

# Create covid service for data handling
covid_service = services.covid_service.CovidService()

CORS(app)


def get_dashboard_full_path(dashboard_identifier):

    unique_dashboard_file_name_full_path = './dashboards/' + \
        dashboard_identifier + '.json'

    return unique_dashboard_file_name_full_path


def get_dashboard_information_from_full_path(full_path):
    dashboard = None
    with open(full_path, 'r') as dashboard_file:
        dashboard = json.load(dashboard_file)

    return {
        'title': dashboard["title"],
        'identifier': dashboard["identifier"]
    }


def save_dashboard(dashboard):
    unique_dashboard_file_name_full_path = get_dashboard_full_path(
        dashboard["identifier"])

    with open(unique_dashboard_file_name_full_path, 'w') as f:
        json.dump(dashboard, f, indent=2)


def get_dashboards():
    dashboard_files = glob.glob("./dashboards/*.json")
    dashboards = []
    for dashboard_file in dashboard_files:
        dashboards.append(
            get_dashboard_information_from_full_path(dashboard_file))
    return dashboards


def load_dashboard_file(full_path):
    dashboard = None
    with open(full_path) as dashboard_file:
        dashboard = json.load(dashboard_file)
    return dashboard


@app.route('/dashboards', methods=['GET'])
def dashboards():
    response_code = 201
    dashboards = []
    error = None

    try:
        dashboards = get_dashboards()

    except BaseException as error:
        response_code = 501
        error = error
    finally:
        response_data = {'dashboards': dashboards, 'error': error}
        return make_response(jsonify(response_data), response_code)


@app.route('/dashboard/<identifier>', methods=['GET'])
def dashboard_by_identifier(identifier):
    dashboard = None
    error = None

    try:
        dashboard_full_path = get_dashboard_full_path(identifier)
        dashboard = load_dashboard_file(dashboard_full_path)
    except FileNotFoundError:
        error = 'Dashboard could not be found...'
    except BaseException as exception_error:
        error = str(exception_error)
    finally:
        response_data = {'dashboard': dashboard, 'error': error}
        return make_response(jsonify(response_data), 201)


@app.route('/dashboard', methods=['POST'])
def dashboard():
    dashboard = None
    error = None

    try:
        body = request.get_json()
        dashboard = body.get('dashboard')
        save_dashboard(dashboard)

    except BaseException as exception_error:
        error = str(exception_error)
    finally:
        response_data = {'dashboard': dashboard, 'error': error}
        return make_response(jsonify(response_data), 201)


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
        error = None
        no_data = False
        try:
            # TODO: Handle other information types...
            if information == "covid_death":
                value = covid_service.get_deaths(start_date, end_date)
                no_data = len(value['data']) == 0
        except BaseException as exception_error:
            error = str(exception_error)
        finally:
            response['values'].append(
                {
                    'informationAbout': information,
                    'value': value,
                    'error': error,
                    'noData': no_data
                }
            )

    return response


app.run(host='0.0.0.0', port=81)
