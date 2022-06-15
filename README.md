# Covid Pydash
A customizable covid dashboard written with Flask and Angular Material during bachelor thesis for FHGR.

## Disclaimer
Please note that this Web Application is considered entirely non-commercial and does not pursue any monetary purpose. I created this application during my bachelor thesis with awesome libraries which are free to use as long as the project is non commercial. So for anyone forking this repository I would like encourage you to do the same :smile:. 

## Setup
In order to run this application you will need the following things installed on your computer
* [Node JS (Version >= 14.x)](https://nodejs.org/en/)
* [Python 3](https://www.python.org/)

With these dependencies installed please do the following steps next:
* Install angular cli tools: `npm install -g @angular/cli`
* Navigate to the cloned git repo so that you are in the root folder (**folder where package.json file is located**)
* Next install all necessary npm packages with the following command `npm i`
* Navigate to the backend folder
* Install all relevant python packages with the following command `python -m pip install -r requirements.txt`


## Start the Web Application
* Navigate to the **backend** directory
* Start the server with the REST API and the data processing with `python server.py`
* Navigate to the **frontend** directory
* Start the wep application with `ng serve`

## Deployment on LeNode
* Clone Repository into local virtual machine
* Do setup steps (see Setup)
* sudo apt-get install nginx
* sudo apt-get install gunicorn
* Navigate into cloned repository
* Run setup.sh script
* Create nginx config
* Reload nginx
* Start gunicorn with ``gunicorn -w 5 backend:app -b 0.0.0.0:5000``

## How does it look like?

### Home Section
Here you can get a quick overview about the different sections of the web application.
![Home Section](/documentation/images/home_section.png)

### Create a dashboard
Here you can quickly create a new dashboard from scratch or from a template.
![Create a Dashboard Section](/documentation/images/create_a_dashboard_section.png)

### Dashboard Overview
Manage your created dashboards. Here you can delete, open or share them.
![Dashboard Overview Section](/documentation/images/dashboard_overview_section.png)

### Your Dashboard
Once you open a dashboard from the dashboard overview section you can play around with the dashboard to your hearts content. Once edit mode is enabled (clicking the pen icon) you can dynamically add new corona related widgets, move them or delete them again. There is also a saving functionality.
![Personalize your Dashboard](/documentation/images/personalize_your_dashboard.png)

Of course there is also a filter functionality where you can filter all widgets by time and regions.
![Personalize your Dashboard](/documentation/images/personalize_your_dashboard_filtering.png)

### FAQ Section
Get to know a few facts about Corona. The information in this section was taken from the BAG of Switzerland and can be found [here](https://www.bag.admin.ch/bag/en/home/krankheiten/ausbrueche-epidemien-pandemien/aktuelle-ausbrueche-epidemien/novel-cov/haeufig-gestellte-fragen.html).

![FAQ Section](/documentation/images/faq_section.png)

### About Section
Some more technical information about the libraries which were used etc.
![About Section](/documentation/images/about_section.png)