CREATE SEQUENCE job_post_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE users_seq START WITH 1 INCREMENT BY 1;
CREATE TABLE users (
    id integer PRIMARY KEY,
    username varchar(40) NOT NULL UNIQUE,
    password varchar(255) NOT NULL
);
CREATE TABLE job_post (
    post_id integer PRIMARY KEY,
    post_profile varchar(100) NOT NULL,
    post_desc varchar(255) NOT NULL,
    req_experience integer NOT NULL CHECK (req_experience BETWEEN 0 AND 50),
    post_tech_stack varchar(255)[] NOT NULL,
    owner_username varchar(40) NOT NULL REFERENCES users(username)
);
