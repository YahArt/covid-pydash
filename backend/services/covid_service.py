import pandas as pd
import json


class CovidService:
    def __init__(self):
        self.covid_deaths = self.initialize_covid_deaths_data()
        self.covid_hospital_capacity = self.initialize_covid_hospital_capacity_data()

    def initialize_covid_deaths_data(self):
        covid_deaths = pd.read_csv('./data/COVID19Death_geoRegion.csv')
        covid_deaths = covid_deaths[[
            'geoRegion', 'datum', 'entries', 'sumTotal']]

        # Rename columns to a more meaningful name
        covid_deaths = covid_deaths.rename(
            columns={"geoRegion": "region", "datum": "date", "entries": "current"})

        # Convert date string into actual date object...
        covid_deaths['date'] = pd.to_datetime(
            covid_deaths['date'], format="%Y-%m-%d")

        return covid_deaths

    def initialize_covid_hospital_capacity_data(self):
        covid_hospital_capacity = pd.read_csv(
            './data/COVID19HospCapacity_geoRegion.csv')
        covid_hospital_capacity = covid_hospital_capacity[[
            'geoRegion', 'date', 'TotalPercent_AllPatients']]

        # Rename columns to a more meaningful name
        covid_hospital_capacity = covid_hospital_capacity.rename(
            columns={"geoRegion": "region", "TotalPercent_AllPatients": "totalUsedCapacity"})

        # Convert date string into actual date object...
        covid_hospital_capacity['date'] = pd.to_datetime(
            covid_hospital_capacity['date'], format="%Y-%m-%d")

        return covid_hospital_capacity

    def get_deaths_in_time_range(self, start_date, end_date):
        return self.covid_deaths[(
            self.covid_deaths['date'] > start_date) & (self.covid_deaths['date'] < end_date)]

    def filter_deaths_by_region(self, covid_deaths, region):
        return covid_deaths[(
            covid_deaths['region'] == region)]

    def get_hospital_capacity_in_time_range(self, start_date, end_date):
        return self.covid_hospital_capacity[(
            self.covid_hospital_capacity['date'] > start_date) & (self.covid_hospital_capacity['date'] < end_date)]

    def filter_hospital_capacity_by_region(self, hospital_capacity, region):
        return hospital_capacity[(
            hospital_capacity['region'] == region)]
