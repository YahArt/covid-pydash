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

    def get_deaths_for_region(self, start_date, end_date, region):
        deaths_in_time_range = self.covid_deaths[(
            self.covid_deaths['datum'] > start_date) & (self.covid_deaths['datum'] < end_date)]

        # Filter by region
        deaths_in_time_range = deaths_in_time_range[(
            deaths_in_time_range['geoRegion'] == region)]

        # Keep only relevant columns
        deaths_in_time_range = deaths_in_time_range[[
            'datum', 'entries', 'sumTotal']]

        result = {
            'region': region,
            'deaths': json.loads(deaths_in_time_range.to_json(orient="records"))
        }
        return result
