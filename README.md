# gakusei

## About
Gakusei, which means _student_ in Japanese, is an application for learning and practicing Japanese.
The project's primary focus is to develop a tool for learning Japanese via Swedish.
Gakusei is governed by [Daigaku Sverige](http://www.daigaku.se), and sponsored by [Kits](https://www.kits.se).

A beta version of Gakusei can be tested at [gakusei.daigaku.se](http://gakusei.daigaku.se).

The app introduces

- React
- React-Bootstrap
- Browserify
- Spring Boot
- Maven

### Prerequisites
To build the project, it is recommended to use npm and maven.
In the instructions below, it is assumed that the aforementioned tools are available. 

### Instructions
Start with cloning the project.
In the project root directory, perform step 1 followed either step 2.a or 2.b.

##### 1. Generate frontend JavaScript bundle with npm

1. ```npm install```
2. ```npm run compile```

##### 2.a. Using in-memory database (H2)

1. Run ```mvn spring-boot:run``` 

##### 2.b. Using PostgreSQL

1. Make sure to have a fairly recent installation of PostgreSQL 9
2. In Postgres, create a user with name/password *gakusei*
3. In Postgres, create a database with the name *gakusei* with the user *gakusei* as owner (or appropriate privileges)
4. Run the project with ```mvn spring-boot:run -Dspring.profiles.active=postgres```

### System overview

![Alt System Overview](https://github.com/kits-ab/gakusei/doc/img/GakuseiOverview.png)