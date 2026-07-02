# Personal CRM System

## Candidate Information
- Candidate Name: CODTECH Intern
- Intern ID: CTTS006
- Organization: CODTECH IT SOLUTIONS PRIVATE LIMITED
- Internship Domain: Full Stack Web Development

## Project Overview
Personal CRM System is a modern contact management web application designed for organizing leads, clients, friends, and family. Built with Node.js, Express.js, EJS, and SQLite3, it provides secure authentication, contact CRUD operations, dashboards, search, and responsive UI.

## Features
- User registration and login with bcrypt password hashing
- Session-based authentication with protected routes
- Add, edit, view, and delete contacts
- Contact fields: name, email, phone, company, job title, address, notes, category, status
- Search and filter by name, email, phone, company, category, status
- Dashboard showing total contacts, active, follow-up, and closed counts
- Responsive design for desktop, tablet, and mobile
- Professional blue-green theme with glass UI effects
- 404 and 500 error pages

## Installation
1. Clone the repository
2. Run `npm install`
3. Copy `.env.example` to `.env` and update values as needed
4. Run `npm start`
5. Open `http://localhost:3001`

## Technologies Used
- Node.js
- Express.js
- SQLite3
- EJS templates
- Express Session
- bcryptjs
- Helmet
- Morgan
- Day.js
- Font Awesome

## Folder Structure
- `app.js` - application entrypoint
- `database/` - SQLite database and initialization logic
- `controllers/` - request handlers for auth and contacts
- `middleware/` - authentication middleware
- `models/` - data access models
- `routes/` - application routes
- `views/` - EJS templates and page views
- `public/` - static assets: CSS, JS, images
- `documentation/` - project documentation files

## Project Scope
This project is a complete production-quality CRM system with secure user authentication, persistent contact management, reporting dashboards, and robust UI/UX design.

## Future Enhancements
- Add profile image uploads
- Introduce team collaboration and role management
- Add email reminders and follow-up scheduling
- Add export/import contacts in CSV
- Add dark mode and more advanced analytics

## Live Demo
A live demo can be deployed on Render or another Node.js hosting platform with the provided configuration.

## GitHub Repository
https://github.com/air1812/CODTECH-Personal-CRM-System
