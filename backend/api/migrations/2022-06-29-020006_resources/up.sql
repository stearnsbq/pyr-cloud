-- Your SQL goes here


CREATE TABLE IF NOT EXISTS Resource (
    id SERIAL PRIMARY KEY,
    route varchar(255) UNIQUE NOT NULL,
    method varchar(255) NOT NULL CHECK (method IN ('POST', 'GET', 'PUT', 'DELETE')),
    parent SERIAL,
    function SERIAL,
    FOREIGN KEY (parent) REFERENCES Resource(id)
);

CREATE TABLE IF NOT EXISTS Function (
    id SERIAL PRIMARY KEY,
    name varchar(255) NOT NULL,
    runtime varchar(255) NOT NULL CHECK (runtime IN ('nodejs', 'python')),
    codePath varchar(255) NOT NULL,
    resource SERIAL,
    FOREIGN KEY(resource) REFERENCES Resource(id)
);

ALTER TABLE Resource ADD CONSTRAINT fk_function FOREIGN KEY (function) REFERENCES Function (id);