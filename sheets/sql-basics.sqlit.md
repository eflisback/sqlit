# SQL Basics

SQL (_Structured Query Language_) is how you talk to relational databases. You write a query, the database engine figures out how to answer it, and you get rows back. SQLite is a lightweight version of that engine: no server, no config, just a file (or in sqlit's case, memory).

Let's load a small database with two tables: **users** and **posts**.

````load
https://sqlit.ebbe.dev/examples/users.sqlite
````

## Selecting data

`SELECT` is the workhorse. Use `*` to grab all columns, or list specific ones.

````sql
SELECT * FROM users
````

````sql
SELECT name, email FROM users
````

## Filtering with WHERE

Add a `WHERE` clause to narrow down results. String comparisons are case-insensitive in SQLite by default.

````sql
SELECT * FROM users WHERE name = 'Alice'
````

You can also use `LIKE` with `%` as a wildcard:

````sql
SELECT * FROM users WHERE email LIKE '%example.com'
````

## Sorting with ORDER BY

````sql
SELECT * FROM posts ORDER BY title ASC
````

## Joining tables

The `posts` table has a `user_id` column that references `users.id`. A `JOIN` lets you combine them into a single result.

````sql
SELECT users.name, posts.title
FROM posts
JOIN users ON posts.user_id = users.id
ORDER BY users.name
````

## Aggregates

`COUNT`, `SUM`, `AVG`, `MIN`, `MAX`. These collapse multiple rows into a single value. Pair them with `GROUP BY` to get per-group counts.

````sql
SELECT users.name, COUNT(posts.id) AS post_count
FROM users
LEFT JOIN posts ON posts.user_id = users.id
GROUP BY users.id
ORDER BY post_count DESC
````

That's the core of SQL. From here it's mostly combining these building blocks.
