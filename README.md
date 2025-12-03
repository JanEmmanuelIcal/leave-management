

📘 Leave Management System – README
📌 Title

Leave Management System

📄 Description

The Leave Management System is a web application designed to streamline how employees file leave requests and how administrators manage approvals. It provides an organized platform where users can submit leave applications, check their leave history, and track approval status. Administrators can review, approve, reject, and monitor all leave transactions efficiently.

⭐ Features
👨‍💼 Employee Features

Secure Login

Submit Leave Requests

Choose leave types:

Sick Leave

Annual Leave

Track request status (Pending, Approved, Rejected)

View personal leave history

Update personal profile

🛠️ Admin Features

Administrator Access

Email: icaljanemmanue@gmail.com

Password: 1234567

View all leave requests

Approve or reject submissions

View employee list

Monitor activity logs

Manage system settings

🧰 Technologies Used

Next.js

React.js

Node.js

Tailwind CSS

JavaScript

📂 Project Tree Structure
leave-management-system/
│
├── README.md
├── package.json
├── next.config.js
├── tailwind.config.js
│
├── src/
│   ├── app/
│   │   ├── layout.jsx
│   │   ├── page.jsx
│   │   ├── login/
│   │   │   └── page.jsx
│   │   ├── dashboard/
│   │   │   ├── admin/
│   │   │   └── employee/
│   │   ├── leaves/
│   │   │   ├── new/
│   │   │   └── view/
│   │   └── api/
│   │       ├── auth.js
│   │       ├── leaves.js
│   │       └── users.js
│   │
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Sidebar.jsx
│   │   ├── LeaveForm.jsx
│   │   └── LeaveCard.jsx
│   │
│   └── styles/
│       └── globals.css
│
└── public/
    ├── logo.png
    └── assets/

▶️ Steps to Run the Project
1. Install Dependencies
npm install

2. Start the Development Server
npm run dev

3. Access the System

Open in your browser:
👉 http://localhost:3000

👥 Author
Name	
Jan Emmanuel Ical	
Kris Bon
Celena Scott
Shiela Fungo
Hugh Derit
