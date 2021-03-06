# THIS PROJECT HAS BEEN ARCHIVED, DEVELOPMENT CONTINUES AT THIS FORK: https://github.com/psandboge/gakusei
# gakusei
Gakusei, which means _student_ in Japanese, is an application for learning and practicing Japanese.
The project's primary focus is to develop a tool for learning Japanese via Swedish.
Gakusei is governed by [Daigaku Sverige](http://www.daigaku.se), and sponsored by [Kits](https://www.kits.se).

A beta version of Gakusei can be tested at [gakusei.daigaku.se](http://gakusei.daigaku.se).

## Contents
* [Prerequisites](#prereq)
* [Instructions](#instructions)
* [Deployment](#deploy)
* [System overview](#system)

## Prerequisites <a name="prereq"/>
To build the project, it is recommended to use `npm`, a nodejs-based general command line utility, and maven (`mvn`), a command line utility for Java.
In the instructions below, it is assumed that the aforementioned tools are available.

## Instructions <a name="instructions"/>
**Quick Note:** If you are just looking to make the application run ASAP, without a persistent database or anything, do `mvn package -Pproduction` (The only requirements are maven and java 10.)

`git clone` this project (how to get git: `apt-get install git` using *nix or using [Git for Windows/Mac/Solaris/Linux](https://git-scm.com/downloads)), or just download as zip and unzip it somewhere.

### Get the back-end running in a development environment

* You will need [Java 10](http://www.oracle.com/technetwork/java/javase/downloads/jdk10-downloads-4416644.html)

#### Simple: Using in-memory database (H2)

1. In terminal, ```mvn spring-boot:run```

**Note:** You should also be able to just run as a Java application in your IDE of choice.

#### Advanced: Using PostgreSQL

1. Make sure to have a fairly recent installation of PostgreSQL 9
2. In Postgres, create a user with name/password *gakusei*
3. In Postgres, create a database with the name *gakusei* with the user *gakusei* as owner (or appropriate privileges)
4. In Postgres, create a schema called *contentschema* in database *gakusei*
5. (Java10) Start the back-end with ```mvn spring-boot:run -Dspring-boot.run.profiles=postgres``` or ```mvn spring-boot:run -Dspring-boot.run.profiles=postgres,enable-resource-caching```

**Note #1:** Data initialization is set manually to true or false in application.yml. Starting the server twice with data init set to true may put redundant data in your database, so make sure to only do it once. If you need to refresh your database, you will have to wipe and delete/drop all tables as well.


**Note #2:** You should also be able to just run as a Java application in your IDE of choice, specifying ##TODO"Update command"`--spring.profiles.active=postgres` as argument to enable postgres.

### Get the front-end running in a development environment

Install [nodejs](https://nodejs.org/en/), any recent version is fine (>=v8.4.0)

1. Navigate to project directory in a terminal (eg. `cd IdeaProjects/gakusei`)
2. In terminal, write `npm install` to install all needed dependencies
3. Now you can choose to either
* Do `npm start` to open a web server at http://localhost:7777. Any changes will automatically update, so no need to run the command again.
* Do `npm run compile` to simply compile the files, and visit the back-end server on http://localhost:8080 with reduced developer convenience. For every change you make in the front-end, you will need to run the command again.  

**Note #1:** The following tools are useful for debugging the frontend: [Redux-devtools](https://github.com/zalmoxisus/redux-devtools-extension), and [React-devtools](https://github.com/facebook/react-devtools)  

### Package the project and run locally
Since we will create a single .jar file with all resources embedded, we will need to compile the front-end to the back-end resources first. We can use the pre-made maven profiles for this purpose.

1. Do `mvn clean package -Pproduction` to install npm packages, compile the front-end, back-end, and finally, package the .jar file to `target/`
2. Start the server:
* `nohup java -jar target/gakusei.jar &> server.log &` for in-memory db, that clears on restart.
* `nohup java -jar target/gakusei.jar --spring.profiles.active="postgres, enable-resource-caching" &> server.log &` for postgres, with previously mentioned setup needed.
3. Go to http://localhost:8080.

* Command `mvn package -Pdevelopment` is also available, should you want to use it for troubleshooting.
* The spring profile "enable-resource-caching" enables some very effective caching methods. You should always want to have this profile active when you deploy in production.


### The api documentation through swagger
Run the application and visist

[for json](http://localhost:8080/v2/api-docs)  or [for ui](http://localhost:8080/swagger-ui.html#/)

There you will see a list of all the rest api's that is in the project


###	Using the Elastic stack (ELK) to analyse events
Requirements:
* Elasticsearch
* Kibana
* Logstash
* Logstash jdbc plugin
* postgres jdbc driver
* Running gakusei database

**Note #1:** Logstash currently requires Java 8 and does not support Java 9 or higher.

#### Installing ELK 

Complete steps 1-3 from this installation page for the Elastic Stack to install Elasticsearch, Kibana and Logstash:\
https://www.elastic.co/guide/en/elastic-stack/current/installing-elastic-stack.html

For Mac you can just use brew with the following commands:
* `brew install elasticsearch`
* `brew install kibana`
* `brew install logstash`

To be able to search the database, install the logstash jdbc input plugin with the following command:
* `logstash-plugin install logstash-input-jdbc`

In case the command does not work, refer to the installation page for the jdbc input plugin:\
https://www.elastic.co/blog/logstash-jdbc-input-plugin

Download the latest version of the postgres driver from this page:\
https://jdbc.postgresql.org/download.html

Create a config file for logstash, e.g., `gakusei-config.conf` and paste the following configuration into the file:

```
input {
	jdbc {
		jdbc_connection_string => "jdbc:postgresql://localhost:5432/gakusei"
		jdbc_user => "gakusei"
		jdbc_driver_library => "postgresql-42.2.5.jar"
		jdbc_driver_class => "org.postgresql.Driver"
		statement => "SELECT * from events"
	}
}

output {
	elasticsearch {
		index => "gakusei"
		document_type => "event"
		document_id => "%{id}"
		hosts => "localhost:9200"
	}
}
```
**Note 2:** `jdbc_driver_library` points to the postgres driver that you just downloaded.

**Note 3:** `index` does not have to be "gakusei". You can set the index to be whatever you want. You will refer to this later in Kibana.

#### Running ELK

1. Start Elasticsearch and Kibana by simply typing `elasticsearch` and `kibana` into seperate terminals.
2. Start Logstash with the following command: `logstash -f <pathToConfigFile>` in a third terminal.
3. Open a web browser and go to `http://localhost:5601` which hosts the Kibana application.
4. In the upper right corner, click on `Set up index pattern` and type in the name of the index you defined in the config file.
5. Click next to complete the setup and then navigate to the `Discover` page on the left panel to see the data.

**Note 4:** If nothing shows on the discover page, the timespan is probably too short. It can be changed from the upper right corner. You can also use the following command to check if Elasticsearch contains the data:
* `curl localhost:9200/gakusei/event/1`

This command would return the first indexed event by Elasticsearch where `gakusei` is the index name, `event` is the document type and the `1` at the end is the index of the event.

You should now have imported the data from your database into Elasticsearch and view it with Kibana.

Refer to online tutorials to learn how to use Kibana or use the Kibana user guide on the this page:\
https://www.elastic.co/guide/en/kibana/current/index.html

### Using the Elastic Stack (ELK) with Docker (Probably only MAC for now)

Requirements:
* Docker version 17.05+
* Docker Compose version 1.6.0+
* postgres jdbc driver
* Running gakusei database

#### Installing Docker

Download and install Docker from this page:\
https://www.docker.com/products/docker-engine#/download

Download and install Docker Compose from this page:\
https://docs.docker.com/compose/install/

Download the latest version of the postgres driver from this page:\
https://jdbc.postgresql.org/download.html

**Note 1:** On desktop systems like Docker for Mac and Windows, Docker Compose is included as part of those desktop installs.

Clone the docker-elk repository that includes a pre-configured Elastic Stack running on Docker:
* `git clone https://github.com/deviantony/docker-elk.git`

#### Configuring ELK on Docker from scratch

**Note 2:** If you already have the gakusei project on your machine, you can skip these steps and proceed to [Running ELK on Docker](#running)

Navigate to the `/logstash/pipeline` directory and create two files `gakusei_events.conf` and `gakusei_progresstrackinglist.conf`.

Paste the following configuration to `gakusei_events.conf`:
```
input {
	jdbc {
		jdbc_connection_string => "jdbc:postgresql://docker.for.mac.localhost:5432/gakusei?gakusei"
		jdbc_user => "gakusei"
		jdbc_password => "gakusei"
		jdbc_driver_library => "/usr/share/logstash/postgresql-42.2.5.jar"
		jdbc_driver_class => "org.postgresql.Driver"
		statement => "SELECT * from events"
	}
}

## Add your filters / logstash plugins configuration here

output {
	elasticsearch {
		index => "events"
		document_type => "event"
		document_id => "%{id}"
		hosts => "elasticsearch:9200"
	}
}
```

Paste the following configuration to `gakusei_progresstrackinglist`:
```
input {
	jdbc {
		jdbc_connection_string => "jdbc:postgresql://docker.for.mac.localhost:5432/gakusei?gakusei"
		jdbc_user => "gakusei"
		jdbc_password => "gakusei"
		jdbc_driver_library => "/usr/share/logstash/postgresql-42.2.5.jar"
		jdbc_driver_class => "org.postgresql.Driver"
		statement => "SELECT * from progresstrackinglist"
	}
}

## Add your filters / logstash plugins configuration here

output	{
	elasticsearch {
		index => "progresstrackinglist"
		document_type => "progresstracking"
		document_id => "%{id}"
		hosts => "elasticsearch:9200"
	}
}
```

**Note 3:** As you might have noticed, the jdbc connection string points to `docker.for.mac.localhost` as the host. This unfortuneately might only work on MAC computer for now, but should work fine with a remote postgres server that uses an ip address.

Navigate back to the `logstash` directory and open the `Dockerfile`.
Add these lines to the `Dockerfile` to configure logstash to work with our running postgres database:
```
# Install the logstash input jdbc plugin to work with postgres.
RUN logstash-plugin install logstash-input-jdbc

# Copy files from the host machine to the container. The syntax is 'COPY <source> <target>'.
COPY /pipeline/gakusei_events.conf /usr/share/logstash/pipeline/
COPY /pipeline/gakusei_progresstrackinglist.conf /usr/share/logstash/pipeline/
COPY postgresql-42.2.5.jar /usr/share/logstash/

# Commands to run on logstash startup.

# CMD ["-f", "/usr/share/logstash/pipeline/gakusei_progresstrackinglist.conf"]
# CMD ["-f", "/usr/share/logstash/pipeline/gakusei_events.conf"]
```

**Note 4:** The commands are intentionally commented out. As you will soon see, we will use them one at a time.

#### Running ELK on Docker <a name="running"/>

Make sure you are in the `Logstash` folder inside the `elk-on-docker` folder. Edit `Dockerfile` and uncomment one of the commands at the end. It does not matter which one, but lets go with the first.

Then start up the Elastic stack on Docker using these two commands:
1. docker-compose build
2. docker-compose up

Once all the data has been transfered to Elasticsearch, shut down the containers with `Ctrl + C` to edit the Dockerfile.
Comment out the first command and uncomment the second command in the `Dockerfile`, then build and run Docker again using the two commands above.

**Note 5:** You must run both commands after any changes that you make. You can shut down the docker containers with `Ctrl + C` and start it up again only with the second command and you should still have the data in Elasticsearch.

Elasticsearch should now contain all the data. You can view the indices in elasticsearch with the following command:

`curl http://localhost:9200/_cat/indices\?v`

In case you need to delete the data from elasticsearch and start from the beginning, you can use this command to delete entire indices, e.g. the 'events' index:

`curl -XDELETE localhost:9200/events`

When you have successfully executed all the above steps, you can open kibana in the browser and navigate to `Management => Saved Objects => import` to import a dashboard that includes graphs for 'number of answers per user' and 'number of incorrect answers per nugget' (More will be added). Import the file below and choose the corresponding index for each visualization and finally click on import. Now you should be able to see the graphs under the dashboard tab on the left panel.

[Dashboard file](https://kitsab-my.sharepoint.com/:u:/g/personal/akar_khatab_kits_se/EZxceBxFrNxApDKxtC--NeYBnEdbDMujqiEvSaxxUrT1fA?e=Lnffgt)

#### Inspecting the containers

To list all the containers that are currently running, use the following command:
* `docker ps`

To include containers that are not currently running, use the following command:
* `docker ps -a`

To inspect a docker image with bash, use the following command:
* `docker run --rm -it --entrypoint=/bin/bash <image name>` 


## Deployment <a name="deploy"/>
The repository is synched with [Travis CI](https://travis-ci.org/), which is a tool for continuous integration that automatically builds, tests and deploys the project.
Travis configuration is available in [.travis.yml](.travis.yml).

When pushing to master or develop, Travis does the following:
* `mvn clean package -Pproduction` to install npm packages, compile the front-end, back-end, and finally, package the .jar file to `target/`
* copy the .jar from the Travis build directory to the specified server
```
master  -> gakusei.daigaku.se
develop -> staging.daigaku.se
```
* ssh to the specified server
* run `deploy_gakusei.sh` located in the Scripts directory

### Staging and production servers
The staging and production environments have similar setups. They are CentOs Linux 7 (Core) servers hosted by [Linode](https://www.linode.com/), with an [nginx](http://nginx.org/) web server.

The following happens on deploy:

#### 1. `deploy_gakusei.sh`
* set some enivronmental variables (script mode (=deploy), logfile name, production jar file name, db user etc)
* execute `node /home/<staging or production>/deploy-watcher/index.js`

#### 2. `index.js`
* create backups
  * the old .jar file and logfile are moved to the backup directory
  * the old database is dumped to the db backup directory
* the old .jar gets replaced by the new .jar
* `pkill --pidfile <pidfile>` is executed to terminate the running process with the pid in `<pidfile>`.
* `nohup java -jar <new>.jar --spring.profiles.active='postgres,enable-resource-caching' &> <logfile> & echo &! > <pidfile>` is executed to run the new jar (with the postgres and enable-resource-caching profiles active), redirect the output to the logfile and save the pid to file.

#### Other useful scripts
Other bash scripts than the deploy script are available in the `Scripts` directory:
* `backup_gakusei.sh`
* `restart_gakusei.sh`
* `start_gakusei.sh`
* `stop_gakusei.sh`

#### nginx
The main nginx configuration file (`nginx.conf`) is located in `etc/nginx/`. Linode has a guide that covers most of the directives and setup: https://www.linode.com/docs/web-servers/nginx/how-to-configure-nginx.

The virtual domains ([server block](https://www.linode.com/docs/web-servers/nginx/how-to-configure-nginx#server-virtual-domains-configuration)) configuration is located in `sites-available`.

nginx listens to incoming http requests on port 80 and https requests on port 443. <br>
All incoming http requests are rewritten to https URIs and redirected to port 443. <br>
Subsequently the requests are proxied to Tomcat serving Gakusei on localhost:8080.

### Monit
Monit is a free open-source proccess supervision tool. It is used on the Gakusei servers in order to run the start up script when Gakusei is down. `monit status` shows the status of the server. The configuration for monit is in `/etc/monitrc`.

## System overview <a name="system"/>
The following picture gives a brief overview of the projects structure:

![Alt System Overview](./doc/img/GakuseiOverview.png)

### Frontend
- React
- React Redux
- React Router
- React Bootstrap
- Webpack

Webpack packages everything into a bundle file (except for most resource files, they'll get merged in eventually as well), which is served via a single index.html file given either by the back-end in production (thymeleaf, inside `templates/` dir) or by the webpack dev server front-end on port 7777 (`templates/webpack_index.html`).

### Backend
- Spring Boot
- Maven
- Ehcache

The backend is a Spring Boot application. The frontend's REST requests are received by the controllers which handles the
request. The controllers uses modules with business logic and repositories with the database connections in order to
handle the requests and returning a response.

Ehcache is a very popular caching tool used to make the app run faster. The configuration for the cache is in ehcache.xml. Ehcache is only enabled if the `enable-resource-caching` profile is active which is highly recommended. Spring automatically configures Ehcache and only the `@EnableCaching` and `@Cacheable` annotations are required to use the cache. See the spring documentation on how to invalidate the cache if needed.

### Misc
In the project's Spring Boot configuration file (src/main/resources/application.yml) the data initialization and event
logging can be turned on and off. Data initialization is only for the development environment, as actual data is not shipped in this project.
Any changes to data structure is done via liquibase's changeset file. Make sure your changes are incremental (one changeset for each new change) after you've published your application somewhere, otherwise liquibase will think you've done something wrong modifying existing changesets, and will refuse to continue.
