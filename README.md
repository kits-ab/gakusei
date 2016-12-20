# gakusei

#About
Gakusei (student in Japanese) is an application for studying Japanese characters.

App introduces

- React
- Browserify
- Spring Boot
- Maven
- Docker

##Prerequisites
Install docker: https://www.docker.com/products/overview

##Instructions
Currently, it is possible to run the project locally with or without Docker.

#####Generate frontend javascript bundle with npm

1. ```npm install```
2. ```npm run compile```

####Without Docker
#####Using in-memory database (H2)

1. Run ```mvn spring-boot:run``` 

#####Using Postgres

1. Make sure to have a fairly recent installation of PostgreSQL 9
2. In Postgres, create a user with name/password *gakusei*
3. In Postgres, create a database with the name *gakusei* with the user *gakusei* as owner (or appropriate privileges)
4. Run the project with ```mvn spring-boot:run -Dspring.profiles.active=postgres```

####With Docker

1. Run ```mvn clean package docker:build```
2. Run ```docker-compose up```

This will start an image with the web application and another with PostgreSQL. To access the PostgreSQL container, connect to localhost:5555.
