# Database Documentation

## Database Engine
- SQLite3

## Database Files
- `database/crm.sqlite` — primary CRM database
- `database/sessions.sqlite` — session storage

## Tables

### users
- `id` INTEGER PRIMARY KEY AUTOINCREMENT
- `name` TEXT NOT NULL
- `email` TEXT NOT NULL UNIQUE
- `password` TEXT NOT NULL
- `created_at` TEXT NOT NULL

### contacts
- `id` INTEGER PRIMARY KEY AUTOINCREMENT
- `user_id` INTEGER NOT NULL
- `full_name` TEXT NOT NULL
- `email` TEXT NOT NULL
- `phone` TEXT NOT NULL
- `company` TEXT NOT NULL
- `job_title` TEXT NOT NULL
- `address` TEXT NOT NULL
- `notes` TEXT
- `category` TEXT NOT NULL
- `status` TEXT NOT NULL
- `created_at` TEXT NOT NULL
