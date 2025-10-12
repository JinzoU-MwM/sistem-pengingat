const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Path ke database file
const dbPath = path.join(__dirname, 'tasks.db');

// Buat koneksi ke database
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error connecting to database:', err.message);
    } else {
        console.log('Connected to SQLite database.');
    }
});

// Inisialisasi tabel tasks
const initDatabase = () => {
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT,
            datetime TEXT NOT NULL,
            priority TEXT DEFAULT 'medium',
            whatsapp_number TEXT,
            completed BOOLEAN DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `;

    db.run(createTableQuery, (err) => {
        if (err) {
            console.error('Error creating tasks table:', err.message);
        } else {
            console.log('Tasks table initialized successfully.');
        }
    });
};

// Fungsi helper untuk database operations
const dbOperations = {
    // Query helper dengan promise
    run: (query, params = []) => {
        return new Promise((resolve, reject) => {
            db.run(query, params, function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ id: this.lastID, changes: this.changes });
                }
            });
        });
    },

    // Get single row
    get: (query, params = []) => {
        return new Promise((resolve, reject) => {
            db.get(query, params, (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    },

    // Get all rows
    all: (query, params = []) => {
        return new Promise((resolve, reject) => {
            db.all(query, params, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }
};

// Inisialisasi database jika file ini dijalankan langsung
if (require.main === module) {
    initDatabase();

    // Tutup koneksi setelah inisialisasi
    setTimeout(() => {
        db.close((err) => {
            if (err) {
                console.error('Error closing database:', err.message);
            } else {
                console.log('Database connection closed.');
            }
        });
    }, 1000);
}

module.exports = {
    db,
    initDatabase,
    dbOperations
};