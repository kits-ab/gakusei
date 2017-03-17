# gakusei

## About
Gakusei, which means _student_ in Japanese, is an application for learning and practicing Japanese.
The project's primary focus is to develop a tool for learning Japanese via Swedish.
Gakusei is governed by [Daigaku Sverige](http://www.daigaku.se), and sponsored by [Kits](https://www.kits.se).

A beta version of Gakusei can be tested at [gakusei.daigaku.se](http://gakusei.daigaku.se).

### Prerequisites
To build the project, it is recommended to use npm and maven.
In the instructions below, it is assumed that the aforementioned tools are available.

### Instructions
`git clone` this project, or download as zip.

##### Start the back-end

###### 2.a. Using in-memory database (H2)

1. In terminal, ```mvn spring-boot:run```

###### 2.b. Using PostgreSQL

1. Make sure to have a fairly recent installation of PostgreSQL 9
2. In Postgres, create a user with name/password *gakusei*
3. In Postgres, create a database with the name *gakusei* with the user *gakusei* as owner (or appropriate privileges)
4. In Postgres, create a schema called *contentschema* in database *gakusei*
5. Run the project with ```mvn spring-boot:run -Drun.profiles=postgres```

1. ```npm install```
2. ```npm run compile```

##### 2.a. Using in-memory database (H2)

1. Run ```mvn spring-boot:run```

##### 2.b. Using PostgreSQL

1. Make sure to have a fairly recent installation of PostgreSQL 9
2. In Postgres, create a user with name/password *gakusei*
3. In Postgres, create a database with the name *gakusei* with the user *gakusei* as owner (or appropriate privileges)
4. In Postgres, create a schema called *contentschema* in database *gakusei*
5. Run the project with ```mvn spring-boot:run -Drun.profiles=postgres```

### System overview
The following picture gives a brief overview of the projects structure:

![Alt System Overview](./doc/img/GakuseiOverview.png)

#### Frontend
- React
- React Bootstrap
- Browserify

By using Browserify and Babel the React JSX components are used to create two javascript bundle files, main_bundle.js
and login_bundle.js which serves as the project's frontend. The frontend communicates with the backend through REST
requests.

#### Backend
- Spring Boot
- Maven

The backend is a Spring Boot application. The frontend's REST requests are received by the controllers which handles the
request. The controllers uses modules with business logic and repositories with the database connections in order to
handle the requests and returning a response.

### Options
In the project's Spring Boot configuration file (src/main/resources/application.yml) the data initialization and event
logging can be turned on and off. (If the data initialization is turned on the system will add data to the database at
each start up and will cause redundant data)

