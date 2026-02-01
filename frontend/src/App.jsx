import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

import Home from './pages/Home';

import ManageMenu from './pages/ManageMenu';
import Attendance from './pages/Attendance';
import StaffLogin from './pages/StaffLogin';
import ManageBills from './pages/ManageBills';
import StudentMenu from './pages/StudentMenu';
import ManageStudents from './pages/ManageStudents';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="staff-login" element={<StaffLogin />} />
        <Route path="register" element={<Register />} />
        <Route path="dashboard" element={<Dashboard />} />

        <Route path="manage-menu" element={<ManageMenu />} />
        <Route path="manage-students" element={<ManageStudents />} />
        <Route path="attendance" element={<Attendance />} />
        <Route path="manage-bills" element={<ManageBills />} />
        <Route path="menu" element={<StudentMenu />} />
      </Route>
    </Routes>
  );
}

export default App;
