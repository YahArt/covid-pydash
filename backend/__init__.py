# Monkeypatch to fix import in flask-cache
from flask import make_response
from flask import jsonify
from flask_cors import CORS
from flask import request
from flask import Flask
from .services.covid_service import CovidService
import json
import glob
import os
import datetime
from flask_caching import Cache


app = Flask("backend")

# Initialize cache
cache = Cache(app, config={'CACHE_TYPE': 'simple'})

# Create covid service for data handling
covid_service = CovidService(app)

CORS(app)


def get_dashboard_full_path(dashboard_identifier):
    return os.path.join(app.static_folder, 'dashboards', dashboard_identifier + '.json')


def get_dashboard_template_full_path(template):
    return os.path.join(app.static_folder, 'templates', template + '.json')


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


def get_dashboards_count():
    dashboard_files = glob.glob("./dashboards/*.json")
    return len(dashboard_files)


def load_dashboard_file(full_path):
    dashboard = None
    with open(full_path) as dashboard_file:
        dashboard = json.load(dashboard_file)
    return dashboard


def delete_dashboard_file(full_path):
    os.remove(full_path)


@cache.memoize(timeout=50)
def handle_covid_death_request(start_date, end_date, regions):
    covid_death_obj = {'data': []}
    deaths_in_time_range = covid_service.get_deaths_in_time_range(
        start_date, end_date)
    no_data_per_region_list = []
    for region in regions:
        deaths_for_region = covid_service.filter_deaths_by_region(
            deaths_in_time_range, region)
        deaths = json.loads(deaths_for_region.to_json(orient="records"))

        no_data_per_region = len(deaths) == 0
        no_data_per_region_list.append(no_data_per_region)
        result = {
            'region': region,
            'deaths': deaths,
        }
        covid_death_obj['data'].append(result)

    no_data_overall = all(
        no_data == True for no_data in no_data_per_region_list)
    result = {
        'covidDeath': covid_death_obj
    }
    return (result, no_data_overall)


@cache.memoize(timeout=50)
def handle_covid_hospital_capacity_request(start_date, end_date, regions):
    covid_hospital_capacity_obj = {'data': []}
    capacity_in_time_range = covid_service.get_hospital_capacity_in_time_range(
        start_date, end_date)
    no_data_per_region_list = []
    for region in regions:
        capacity_for_region = covid_service.filter_hospital_capacity_by_region(
            capacity_in_time_range, region)
        capacities = json.loads(capacity_for_region.to_json(orient="records"))

        no_data_per_region = len(capacities) == 0
        no_data_per_region_list.append(no_data_per_region)
        result = {
            'region': region,
            'capacities': capacities,
        }
        covid_hospital_capacity_obj['data'].append(result)

    no_data_overall = all(
        no_data == True for no_data in no_data_per_region_list)
    result = {
        'covidHospitalCapacity': covid_hospital_capacity_obj
    }
    return (result, no_data_overall)


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


@app.route('/dashboard/templates/<template>', methods=['GET'])
def dashboard_by_template(template):
    dashboard = None
    error = None
    try:
        dashboard_template_full_path = get_dashboard_template_full_path(
            template)
        dashboard = load_dashboard_file(dashboard_template_full_path)
    except BaseException as exception_error:
        error = str(exception_error)
    finally:
        response_data = {'dashboard': dashboard, 'error': error}
        return make_response(jsonify(response_data), 201)


@app.route('/dashboard/<identifier>', methods=['GET', 'DELETE'])
def dashboard_by_identifier(identifier):
    dashboard = None
    error = None
    number_of_dashboards = 0
    try:

        dashboard_full_path = get_dashboard_full_path(identifier)
        if request.method == 'GET':
            dashboard = load_dashboard_file(dashboard_full_path)
        elif request.method == 'DELETE':
            dashboard = load_dashboard_file(dashboard_full_path)
            delete_dashboard_file(dashboard_full_path)
    except FileNotFoundError:
        error = 'DASHBOARD_NOT_FOUND'
    except BaseException as exception_error:
        error = str(exception_error)
    finally:
        number_of_dashboards = get_dashboards_count()
        response_data = {'dashboard': dashboard, 'error': error,
                         'numberOfDashboards': number_of_dashboards}
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

    start_date_ticks = body.get('startDateEpochTicks')
    end_date_ticks = body.get('endDateEpochTicks')
    regions = body.get('regions')

    # Convert ticks to date objects
    start_date = datetime.datetime.fromtimestamp(start_date_ticks)
    end_date = datetime.datetime.fromtimestamp(end_date_ticks)

    information_type = body.get('informationType')
    information_type_unique = list(set(information_type))
    dashboard_data = []

    for information in information_type_unique:
        try:
            value = None
            no_data = False
            error = None
            # TODO: Handle other information types...
            if information == "covid_death":
                value, no_data = handle_covid_death_request(
                    start_date, end_date, regions)

            elif information == "covid_hospital_capacity":
                value, no_data = handle_covid_hospital_capacity_request(
                    start_date, end_date, regions)
        except BaseException as exception_error:
            error = str(exception_error)
        finally:
            response_obj = {'informationType': information,
                            'value': value, 'noData': no_data, 'error': error}
            dashboard_data.append(response_obj)
    response_data = {'dashboardData': dashboard_data}
    return make_response(jsonify(response_data), 201)
