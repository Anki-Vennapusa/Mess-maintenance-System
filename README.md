# SVU Hostel Mess Maintenance System

A comprehensive web-based application designed to streamline the management of hostel mess operations. This system facilitates efficient handling of student attendance, mess billing, menu management, and provides role-based access for students and staff.

## 🚀 Key Features

### 👤 User Roles
*   **Student**: Access to personal dashboard, view daily/weekly menus, check attendance history, and view/download monthly mess bills.
*   **Staff/Admin**: Full administrative control to mark attendance, manage food menus, generate monthly bills, and view student details.

### 🍛 Menu Management
*   **Weekly Schedule**: Define breakfast, lunch, and dinner menus for all 7 days of the week.
*   **Dynamic Updates**: Staff can easily update menu items as needed.

### 📅 Attendance System
*   **Daily Tracking**: Mark student attendance on a daily basis.
*   **Meal Preference**: Track 'Veg' or 'Non-Veg' meal preferences for precise billing.
*   **History**: Students can view their comprehensive attendance logs.

### 💰 Billing System
*   **Automated Calculation**: Generates bills based on attendance count and meal types.
*   **Detailed Breakdown**: Bills include:
    *   **Mess Charges**: Based on daily rates and non-veg add-on rates.
    *   **Fixed Charges**: Room Rent, Water Charges, Electricity Charges, Establishment Charges.
*   **Invoicing**: Generate and download detailed PDF invoices.

---

## 🛠️ Tech Stack

### Frontend
*   **Framework**: [React](https://react.dev/) (v19)
*   **Build Tool**: [Vite](https://vitejs.dev/)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
*   **Routing**: React Router DOM
*   **Icons**: Lucide React
*   **HTTP Client**: Axios
*   **PDF Generation**: jsPDF, autoTable

### Backend
*   **Framework**: [Django](https://www.djangoproject.com/) (v6.0)
*   **API**: Django REST Framework (DRF)
*   **Authentication**: Simple JWT (JSON Web Tokens)
*   **CORS**: django-cors-headers

### Database
*   **System**: [MySQL](https://www.mysql.com/)
*   **Connector**: mysqlclient / PyMySQL

---

## 📂 Database Schema

The application uses a relational database with the following key models:

| Model | Description | Key Fields |
| :--- | :--- | :--- |
| **User** | Custom user model extending AbstractUser | `username`, `password`, `is_student`, `is_staff_member` |
| **StudentProfile** | Extends User with specific student info | `reg_num`, `branch`, `year`, `phone` |
| **Menu** | Stores daily meal plans | `day` (Mon-Sun), `breakfast`, `lunch`, `dinner` |
| **Attendance** | Daily attendance records | `student`, `date`, `is_present`, `meal_type` (Veg/Non-Veg) |
| **Bill** | Monthly bill records | `student`, `month`, `amount`, `is_paid`, `daily_rate`, `fixed_charges` |

---

## ⚙️ Project Structure

```text
minor-project/
├── backend/                # Django Backend
│   ├── mess_api/           # API Application (Models, Views, Serializers)
│   ├── mess_system/        # Project Configuration (Settings, URLs)
│   ├── manage.py           # Django CLI utility
│   ├── venv/               # Python Virtual Environment
│   └── ...                 # Utility scripts
├── frontend/               # React Frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Full page components (Dashboard, Login, etc.)
│   │   ├── App.jsx         # Main App component & Routing
│   │   └── main.jsx        # Entry point
│   ├── public/             # Static assets
│   ├── package.json        # Frontend dependencies
│   └── vite.config.js      # Vite configuration
└── README.md               # Project Documentation
```

---

## 🏁 Getting Started

### Prerequisites
*   **Python** (v3.8+)
*   **Node.js** (v18+) & **npm**
*   **MySQL Server**

### 1. Database Setup
Ensure your MySQL server is running and create a database named `mess_system_db`.
```sql
CREATE DATABASE mess_system_db;
```

### 2. Backend Setup
Navigate to the backend directory:
```bash
cd backend
```

Create and activate a virtual environment (optional but recommended):
```bash
python -m venv venv
# Windows
.\venv\Scripts\activate
# Linux/Mac
source venv/bin/activate
```

Install Python dependencies:
*(Ensure you have Django, DRF, mysqlclient, etc. installed. If a requirements.txt exists, run `pip install -r requirements.txt`)*
```bash
pip install django djangorestframework django-cors-headers djangorestframework-simplejwt mysqlclient
```

Configure Internal Settings:
*   Open `backend/mess_system/settings.py`.
*   Update the `DATABASES` section with your MySQL credentials (`USER`, `PASSWORD`).

Run Migrations:
```bash
python manage.py makemigrations
python manage.py migrate
```

Start the Development Server:
```bash
python manage.py runserver
```
*The backend API will be available at `http://127.0.0.1:8000/`*

### 3. Frontend Setup
Open a new terminal and navigate to the frontend directory:
```bash
cd frontend
```

Install Dependencies:
```bash
npm install
```

Start the Development Server:
```bash
npm run dev
```
*The application will launch at `http://localhost:5173/`*

---

## 🔑 Default Login Credentials
*(If applicable, list test credentials below, or you may need to use `create_staff_user.py` script)*

To create a staff user, you can run the provided utility script in the backend folder:
```bash
python create_staff_user.py
```

To register a student, use the **Register** page on the frontend.

---

## 📝 API Endpoints
Base URL: `/api/`

*   **Auth**: `/token/` (Login), `/token/refresh/`
*   **Attendance**: `/attendance/`, `/attendance/bulk_update/`
*   **Menu**: `/menu/`, `/menu/<day>/`
*   **Billing**: `/bills/`, `/bills/generate_monthly_bills/`
*   **Student**: `/student/profile/`

---
*Generated for SVU Hostel Mess Maintenance Project*
