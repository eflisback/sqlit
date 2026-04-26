# Python Basics

sqlit runs Python via [Pyodide](https://pyodide.org/) - the standard CPython interpreter compiled to WebAssembly. That means real Python, in the browser, no install required.

## Querying the database

When you load a `.sqlite` file, sqlit makes it available to Python through a special constant: `SQLIT_MEMORY`. Pass it to `sqlite3.connect()` and you're in.

````load
https://sqlit.app/examples/users.sqlite
````

````python
import sqlite3

con = sqlite3.connect(SQLIT_MEMORY)
rows = con.execute("SELECT * FROM users").fetchall()

for row in rows:
    print(row)
````

## Processing results in Python

SQL is great at filtering and aggregating, but sometimes it's easier to do things on the Python side - especially formatting, string manipulation, or anything that needs real logic.

````python
rows = con.execute(
    "SELECT users.name, COUNT(posts.id) AS n FROM users LEFT JOIN posts ON posts.user_id = users.id GROUP BY users.id"
).fetchall()

for name, count in rows:
    label = "post" if count == 1 else "posts"
    print(f"{name}: {count} {label}")
````

## User input

Python's `input()` works in sqlit too - it pauses execution and shows a prompt for you to type into.

````python
import sqlite3

name = input("Search for a user: ")
con = sqlite3.connect(SQLIT_MEMORY)
rows = con.execute(
    "SELECT name, email FROM users WHERE name LIKE ?",
    (f"%{name}%",)
).fetchall()

if rows:
    for row in rows:
        print(row)
else:
    print("No match found.")
````

