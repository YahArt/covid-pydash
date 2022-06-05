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

        # TODO: Perhaps filter by other regions etc.
        self.covid_deaths = covid_deaths[(covid_deaths['geoRegion'] == 'CH')]

    def get_deaths(self, start_date, end_date):
        deaths_in_time_range = self.covid_deaths[(
            self.covid_deaths['datum'] > start_date) & (self.covid_deaths['datum'] < end_date)]

        # Keep only relevant columns
        deaths_in_time_range = deaths_in_time_range[[
            'datum', 'entries', 'sumTotal']]

        result = {
            'geoRegion': 'CH',
            'data': json.loads(deaths_in_time_range.to_json(orient="records"))
        }
        return result
