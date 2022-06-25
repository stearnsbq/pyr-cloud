-- Your SQL goes here

CREATE TABLE IF NOT EXISTS Users (
    id SERIAL PRIMARY KEY,
    username varchar(255) UNIQUE NOT NULL,
    password varchar(255) NOT NULL
)