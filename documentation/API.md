# API Documentation

## Authentication

### POST /register
Registers a new user.
- Request body: `name`, `email`, `password`, `confirm_password`
- Response: redirects to dashboard on success.

### POST /login
Logs in an existing user.
- Request body: `email`, `password`
- Response: redirects to dashboard on success.

### GET /logout
Ends the user session and redirects to login.

## Contacts

### GET /dashboard
Loads the dashboard with contact statistics.

### GET /contacts
Displays the contact list with optional query filters:
- `search`
- `category`
- `status`
- `sort`
- `page`

### GET /contacts/new
Loads the add contact page.

### POST /contacts
Creates a new contact.
- Request body: `full_name`, `email`, `phone`, `company`, `job_title`, `address`, `notes`, `category`, `status`

### GET /contacts/:id/edit
Loads the edit page for a contact.

### POST /contacts/:id
Updates a contact.

### POST /contacts/:id/delete
Deletes a contact.

### GET /contacts/:id
Loads the contact detail page.
