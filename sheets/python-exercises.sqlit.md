# Python Exercises

Practice querying a database from Python. The database below has a single table — **buildings** — with columns: `id`, `name`, `city`, `height`, `floors`, `completion_year`.

````load
https://sqlit.ebbe.dev/examples/buildings.sqlite
````

````python
import sqlite3
con = sqlite3.connect(SQLIT_MEMORY)
print(con.execute("SELECT * FROM buildings").fetchall())
````

## Exercise 1

Query all buildings and print just their **names**, one per line.

````python

````

## Exercise 2

Without using `ORDER BY` or `MAX` in SQL, find and print the **tallest building** using Python. Fetch all rows, then figure it out in code.

````python

````

## Exercise 3

Group the buildings by **city** using a Python dictionary and print how many buildings each city has.

````python

````

## Exercise 4

Use `input()` to ask for a city name, then print all buildings in that city. Handle the case where no buildings are found.

````python

````
