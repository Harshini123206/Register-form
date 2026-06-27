# Student Registration App

A simple registration application with:
- Frontend form fields: `username`, `student name`, `student id`
- Backend API built with Node.js and Express
- MySQL database storage
- Static frontend served from the same server

## Files
- `server.js` - Express backend and API route
- `public/index.html` - registration form
- `public/style.css` - form styling
- `public/app.js` - frontend submission logic
- `db/init.sql` - MySQL database/table creation script
- `.env.example` - environment variable template

## Prerequisites
- EC2 instance running Linux
- Node.js 18+ / npm
- MySQL server
- EC2 Security Group allowing inbound TCP 3000 (or 80 if using a reverse proxy)

If your EC2 instance does not already have Node.js and MySQL, install them like this:

```bash
sudo apt update
sudo apt install -y nodejs npm mysql-server
```

For a more recent Node.js version, use NodeSource or `nvm`.

## Setup
1. Clone or copy the repo to your EC2 instance.

2. Install dependencies:

```bash
cd /home/ec2-user/Register-form
npm install
```

3. Create the environment file:

```bash
cp .env.example .env
```

Edit `.env` and set your MySQL credentials.

4. Create the MySQL database and table:

```bash
mysql -u root -p < db/init.sql
```

If your MySQL user is not `root`, use the correct user and password:

```bash
mysql -u <your_user> -p < db/init.sql
```

5. Start the app:

```bash
npm start
```

The app will run on the port defined in `.env` (default `3000`).

## EC2 Deployment Step-by-Step
Follow these exact steps on your EC2 instance.

1. SSH into your EC2 instance:

```bash
ssh -i /path/to/your-key.pem ec2-user@<EC2_PUBLIC_IP>
```

2. Update packages and install Node.js, npm, and MySQL:

```bash
sudo apt update
sudo apt install -y nodejs npm mysql-server
```

3. Clone the repository into the home directory:

```bash
cd /home/ec2-user
git clone <your-repo-url> Register-form
cd Register-form
```

4. Install Node dependencies:

```bash
npm install
```

5. Copy and edit environment variables:

```bash
cp .env.example .env
nano .env
```

Set `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, and `PORT`.

6. Initialize the database:

```bash
sudo mysql -u root -p < db/init.sql
```

If your MySQL user is not `root`, use the correct user instead:

```bash
mysql -u <your_user> -p < db/init.sql
```

7. Verify MySQL is running:

```bash
sudo systemctl status mysql
```

8. Start the app:

```bash
npm start
```

9. Open the port in AWS Security Group:

- Type: `Custom TCP`
- Protocol: `TCP`
- Port range: `3000`
- Source: `0.0.0.0/0`

10. Open the app in your browser:

```text
http://<EC2_PUBLIC_IP>:3000
```

## Accessing the app from outside
1. In your AWS console, open the EC2 Security Group settings for your instance.
2. Add an inbound rule for:
   - Type: `Custom TCP`
   - Protocol: `TCP`
   - Port range: `3000`
   - Source: `0.0.0.0/0` (for public access) or a restricted CIDR
3. If you want to use port `80`, update `PORT=80` in `.env` and run the app with sudo or a process manager.

Then open in a browser:

```text
http://<EC2_PUBLIC_IP>:3000
```

## Running in background
Install `pm2` and run the server as a service:

```bash
npm install -g pm2
pm start
pm2 start server.js --name registration-app
pm2 save
pm2 startup
```

## How it works
- User fills the form at `/`
- Frontend sends a POST request to `/api/register`
- Backend inserts the record into MySQL `students` table
- Server responds with success or error message

## Database details
The app uses the `registration_app` database and the `students` table:

- `id` - auto-increment primary key
- `username` - student username
- `student_name` - student full name
- `student_id` - unique student ID
- `created_at` - record timestamp

## Notes
- Ensure MySQL is running before starting the server.
- If using a custom MySQL host or port, update `.env` accordingly.
- For production, consider using HTTPS and a reverse proxy like Nginx.
