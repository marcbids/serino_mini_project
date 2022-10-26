# Serino Mini Project

Created 2 endpoints to find treasure boxes near the given longitude and latitude within the given distance range. \
1st endpoint `/treasure` : This will return all near treasures with the given parameters \
2nd endpoint `/highest` : This will return the most nearest treasure box with the total Prize value and the total distance in KM with 2 decimal places

## Installation
### Dependecies installed
* Nodemon
* Express
* MySql

### Technologies used
* NodeJs
* ExpressJs
* MySql Workbench

## Setting up Database
1. Create a database named *kitra*
2. import tables to datase from folder `./database`


## Setting up the Application
1. git clone the project 
```
https://github.com/marcbids/serino_mini_project.git
```
2. install dependencies 
```
npm install 
npm install nodemon express mysql
```
3. Update the `./config.json` with your sql credentials
```
{
  "host": "localhost",
  "user": "root",
  "password": "password",
  "database": "kitra",
  "connectionLimit": 10,
  "port": "3306"
}
```

4. Run app with `npm start`

5. Open postman and submit a POST request with the link [localhost:3000/api/kitra/treasure](localhost:3000/api/kitra/treasure) and a sample body of 
```
#   note : Distance only accepts 1km or 10km 
         : Latitude, Longitude, and distance are required
         : Prize is optional and Prize must not have decimal value and prize range should be from $10 - $30
{
    "latitude" : 14.551036595352455,
    "longitude" : 121.01696118771324,
    "distance" : "10",
    "prize" : "$30"
}
```
