# Welcome to sqlit!

This tool let's you execute _SQL queries_ and _Python code_ directly in your browser with **zero setup**. It does this using...

- [SQLite](https://sqlite.org/), which has been compiled to WebAssembly - the low-level assembly-like language that browsers understand.
- [Pyodide](https://pyodide.com/), the standard CPython interpreter compiled to (you guessed it) WebAssembly, allowing it to be used natively in browsers.

## Try it out!

Below you'll find a cell which loads a remote `.sqlite` file into memory, one that queries it using SQL, and one that makes the same query using Python with the `sqlite3` module. 