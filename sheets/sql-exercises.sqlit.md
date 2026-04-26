# SQL Exercises

Time to write some queries yourself. The database below contains notable buildings across Sweden. In the table: name, city, height (meters), floors, and completion year.

````load
https://sqlit.app/examples/buildings.sqlite
````

Start by having a look at what's in there:

````sql
SELECT * FROM buildings
````

## Exercise 1

List only the buildings located in **Stockholm**.

````sql

````

## Exercise 2

Find the **3 tallest** buildings. Show their names and heights, tallest first.

````sql

````

## Exercise 3

**Count** how many buildings each city has. Show the city name and the count, sorted by count descending.

````sql

````

## Exercise 4

Find all buildings that were completed **before 2010**. Show the name, city, and completion year.

````sql

````
