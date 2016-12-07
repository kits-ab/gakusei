DROP TABLE IF EXISTS users;
CREATE TABLE users(id SERIAL PRIMARY KEY, username VARCHAR(32), password VARCHAR(64));

DROP TABLE IF EXISTS contentschema.facts;
DROP TABLE IF EXISTS contentschema.nuggets CASCADE;

DROP SCHEMA IF EXISTS contentschema;
CREATE SCHEMA contentschema;

CREATE TABLE contentschema.nuggets(
id serial PRIMARY KEY NOT NULL,
type VARCHAR(32) NOT NULL,
description VARCHAR(100)
);

CREATE TABLE contentschema.facts(
id SERIAL PRIMARY KEY NOT NULL,
type VARCHAR(32) NOT NULL,
data VARCHAR(100) NOT NULL,
description VARCHAR(100),
nuggetid integer NOT NULL REFERENCES contentschema.nuggets(id)
);

