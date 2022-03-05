# Northcoders News API

## Introduction

This describes how to setup and configure a very simple backend api which illustrates 2 components (Model and Controllers) of the MVC paradigm. 

It implements a basic data-science functionality embodied withing the CRUD database principle, Create, Read, Update and Delete with endpoints for POST, GET, PATCH and DELETE respectively.

The database used for this example is PostgreSQL which will need to be installed configured and tested prior to working with the example. 


## Initial setup

0   Download and install psql.

1   fork the repo with GitHub

2   from GitHub copy the link to the forked repo

3   Create a suitably named local directory mydir i.e. use 
    cd mydir

4   clone the repo from within mydir
    git clone <link copied in item 2 above>

5   Item 4 will create a local directory, 'the-cloned-dir' go into that directory:

    cd the-cloned-dir

6   run VS-code from within that directory with

    code .

7   open up a terminal within VS code to start.

## Dependencies


### Ensure the following are installed using npm i 

- dotenv
- express
- husky
- jest-extended
- jest
- pg-format
- pg
- supertest

- you can verify what is installed with:
```bash
 npm ls
```

### Add .env files
It will be necessary to create 2 additional files within the root directory
of the project. This is because they are ignored by .gitignore. and not included.

#### Add - create the file:

.env.development

#### This should contain:

PGDATABASE=name-of-your-dev-db

#### Add - create the file:

.env.test

#### this should contain

PGDATABASE=name-of-your-test-db

## Brief details of the Directory Structure

### ./db

contains JSON source data required to populate development and test databases
these have identical structure but differ in size.

### ./db/development-data
contains test data required to seed the database.

### ./db/test-data
contains test data required to seed the database.

### ./db/seeds
contains s/w to populate each of the tables in the database (from the source data in './db/development-data' and './db/test-data'.

this will seed either of 2 databases (development or test) having the following tables:

- articles
- comments
- topics
- users

### ./  The root directory

The main calling module is conventionally called 'app'

app.js  - which receives requests to endpoints. 
listen.js   - sets up a local server to listen on localhost: port 9090

endpoints.json  - a json representation/description of each endpoint and is returned by the get request to /api

Adhering to the seperation of concerns paradigm the primary functionality is split between a set of controllers and models modules as described below.

### ./models    directory

Contains js modules that handle interactions (SQL requests and responses) with the respective PostgreSQL database tables. Follows the naming convention 'table-name.models.js', files are:

- articles.models.js
- comments.models.js
- topics.models.js
- users.models.js

### ./controllers 

Contains js middleware that implements logic to issue the requests from app to/and receive the responses back from the functions within models (models directly handles communication to/from the respective PostgreSQL tables. Follows the naming convention 'table-name.controllers.js', these are:

- articles.controllers.js
- comments.controllers.js
- topics.controllers.js
- users.controllers.js

### ./__tests__

contains jest based test modules used to drive the development of the app. 

- app.test.js
- utils.test.js

## Testing the Application

In order to test the application it will be necessary to start the PostgreSQL database using sudo as superuser. Use the following command:

```bash
sudo service postgresql start
```
The endpoints app can be tested by issuing the command:

```bash
npm test
```
This will seed the database with test data and run a set of tests designed to prove functionality of each endpoint.


## Running the application

- Ensure the database is seeded run the command
```bash
npm run seed
```
- Run the server using the command
```bash
node listen
```
- Use postman, a browser or Insomnia to send requests such as
```bash
get /api/articles
```

