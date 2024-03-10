import sqlite3

def log_data(cursor, table_name, log_file):
    # Fetch all rows from the table
    cursor.execute(f"SELECT * FROM {table_name}")
    rows = cursor.fetchall()

    # Log table name
    log_file.write(f"\nTable: {table_name}\n")

    # Log column names
    column_names = [description[0] for description in cursor.description]
    log_file.write(", ".join(column_names) + "\n")

    # Log each row of data
    for row in rows:
        log_file.write(", ".join(map(str, row)) + "\n")

def log_all_data(db_path, log_path):
    # Connect to the SQLite database
    connection = sqlite3.connect(db_path)
    cursor = connection.cursor()

    # Open log file in append mode
    with open(log_path, 'a') as log_file:
        # Get the list of tables in the database
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
        tables = cursor.fetchall()

        # Log data for each table
        for table in tables:
            table_name = table[0]
            log_data(cursor, table_name, log_file)

    # Close the database connection
    connection.close()

if __name__ == "__main__":
    # Replace 'your_database.db' with the path to your SQLite database file
    database_path = 'data.sqlite'

    # Replace 'log.txt' with the desired log file path
    log_file_path = 'log.txt'

    # Log all data in all tables
    log_all_data(database_path, log_file_path)

