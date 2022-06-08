import pandas as pd
import json


class CovidService:
    def __init__(self):
        covid_deaths = pd.read_csv('./data/COVID19Death_geoRegion.csv')
        covid_deaths = covid_deaths[[
            'geoRegion', 'datum', 'entries', 'sumTotal']]

        # Convert date string into actual date object...
        covid_deaths['datum'] = pd.to_datetime(
            covid_deaths['datum'], format="%Y-%m-%d")

        self.covid_deaths = covid_deaths

    def get_deaths_in_time_range(self, start_date, end_date):
        return self.covid_deaths[(
            self.covid_deaths['datum'] > start_date) & (self.covid_deaths['datum'] < end_date)]

    def filter_deaths_by_region(self, covid_deaths, region):
        return covid_deaths[(
            covid_deaths['geoRegion'] == region)]
