🚀 PLAN DEPLOYMENT – DailyTask Reminder (Node.js + SQLite + WAHA API)
⚙️ 1. Tech Stack Final
Layer	Teknologi	Fungsi
Backend	Node.js (Express.js)	API + Scheduler
Database	SQLite (file tasks.db)	Menyimpan data tugas
Scheduler	node-cron	Mengecek reminder setiap menit
Notification	WAHA API	Kirim WhatsApp otomatis
Hosting	Railway.app	Gratis & auto-deploy dari GitHub
Frontend	HTML + Tailwind (static)	UI CRUD sederhana
📁 2. Struktur Folder
daily-task-reminder/
│
├── server.js             # Entry point utama
├── db.js                 # Inisialisasi SQLite
├── routes/
│   └── tasks.js          # Route CRUD API
├── cron.js               # Scheduler reminder
├── public/
│   └── index.html        # UI HTML
│   └── style.css
├── tasks.db              # File database SQLite
├── package.json
└── .env.example          # Contoh environment vars