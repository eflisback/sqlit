# Welcome to sqlit

This tool lets you execute _SQL queries_ and _Python code_ directly in your browser with **zero setup**. It does this using...

- [SQLite](https://sqlite.org/), which has been compiled to WebAssembly - the low-level assembly-like language that browsers understand.
- [Pyodide](https://pyodide.com/), the standard CPython interpreter compiled to (you guessed it) WebAssembly, allowing it to be used natively in browsers.

## Try it out

Below you'll find a cell which loads a remote `.sqlite` file into memory, one that queries it using SQL, and one that queries the same database using Python with the `sqlite3` module.

````load
{{ORIGIN}}/examples/users.sqlite
````

````sql
SELECT * FROM users
````

````python
import sqlite3

name = input("Enter a name: ")

con = sqlite3.connect(SQLIT_MEMORY) # Provided by sqlit
rows = con.execute(
    "SELECT name, email FROM users WHERE name LIKE ?",
    (f"%{name}%",)
).fetchall()

for row in rows:
    print(row)

if len(rows) == 0:
    print("No results found")
````

## Editing

- **Double-click** Markdown cells to edit them. When you're done, press **Escape** to stop editing.
- **Right-click** a cell to open the context menu. From there, you can insert new cells above or below, move cells up or down, and delete them.

## File format

The entire sqlit sheet, including executable cells, is represented by [Markdown](https://en.wikipedia.org/wiki/Markdown). This makes external editing and version tracking convenient. Try exporting this sheet using the button in the header, inspect it, make some changes, then import it back using the other button. Note that executable cells are just _code blocks_ wrapped with four backticks instead of three.