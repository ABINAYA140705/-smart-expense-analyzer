import sqlite3

DB_NAME = "expenses.db"

def create_table():
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS expenses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT NOT NULL,
        category TEXT NOT NULL,
        description TEXT,
        amount REAL NOT NULL,
        payment_mode TEXT
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS budgets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        category TEXT UNIQUE NOT NULL,
        monthly_limit REAL NOT NULL
    )
    """)

    conn.commit()
    conn.close()

def insert_expense(date, category, description, amount, payment_mode):
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute("""
    INSERT INTO expenses (date, category, description, amount, payment_mode)
    VALUES (?, ?, ?, ?, ?)
    """, (date, category, description, amount, payment_mode))
    conn.commit()
    conn.close()

def get_all_expenses():
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM expenses ORDER BY date DESC")
    rows = cursor.fetchall()
    conn.close()
    return [{"id": r[0], "date": r[1], "category": r[2], "description": r[3], "amount": r[4], "payment_mode": r[5]} for r in rows]

def get_expenses_by_month(year_month):
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM expenses WHERE date LIKE ? ORDER BY date DESC", (f"{year_month}%",))
    rows = cursor.fetchall()
    conn.close()
    return [{"id": r[0], "date": r[1], "category": r[2], "description": r[3], "amount": r[4], "payment_mode": r[5]} for r in rows]

def delete_expense(expense_id):
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute("DELETE FROM expenses WHERE id = ?", (expense_id,))
    conn.commit()
    conn.close()

def update_expense(expense_id, date, category, description, amount, payment_mode):
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute("""
    UPDATE expenses SET date=?, category=?, description=?, amount=?, payment_mode=?
    WHERE id=?
    """, (date, category, description, amount, payment_mode, expense_id))
    conn.commit()
    conn.close()

def set_budget(category, monthly_limit):
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute("""
    INSERT INTO budgets (category, monthly_limit) VALUES (?, ?)
    ON CONFLICT(category) DO UPDATE SET monthly_limit=excluded.monthly_limit
    """, (category, monthly_limit))
    conn.commit()
    conn.close()

def get_budgets():
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute("SELECT category, monthly_limit FROM budgets")
    rows = cursor.fetchall()
    conn.close()
    return [{"category": r[0], "monthly_limit": r[1]} for r in rows]
