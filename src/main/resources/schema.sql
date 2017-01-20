--DROP TABLE IF EXISTS users;
--CREATE TABLE users(id SERIAL PRIMARY KEY, username VARCHAR(32), password VARCHAR(64), userrole VARCHAR(64));

CREATE SCHEMA IF NOT EXISTS contentschema;

CREATE TABLE IF NOT EXISTS contentschema.lessons(
id SERIAL PRIMARY KEY NOT NULL,
name VARCHAR(64) NOT NULL,
description VARCHAR(1024)
);

CREATE TABLE IF NOT EXISTS contentschema.nuggets(
id VARCHAR(16) PRIMARY KEY NOT NULL,
type VARCHAR(32) NOT NULL,
description VARCHAR(256),
hidden BOOLEAN
);

CREATE TABLE IF NOT EXISTS contentschema.lessons_nuggets(
lesson_id SERIAL,
nugget_id VARCHAR(16)
);

CREATE TABLE IF NOT EXISTS contentschema.facts(
id SERIAL PRIMARY KEY NOT NULL,
type VARCHAR(32) NOT NULL,
data VARCHAR(128) NOT NULL,
description VARCHAR(256),
nuggetid VARCHAR(16) NOT NULL REFERENCES contentschema.nuggets(id)
);
