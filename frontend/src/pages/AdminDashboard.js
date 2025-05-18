import { useEffect, useState } from 'react';
import API from '../services/api';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';


const AdminDashboard = () => {
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    const res1 = await API.get('/admin/dashboard');
    const res2 = await API.get('/admin/users');
    const res3 = await API.get('/admin/stores');
    setStats(res1.data);
    setUsers(res2.data);
    setStores(res3.data);
  };

  const userSchema = Yup.object().shape({
    name: Yup.string().min(20).max(60).required(),
    email: Yup.string().email().required(),
    password: Yup.string()
      .matches(/^(?=.*[A-Z])(?=.*\W).{8,16}$/, '8-16 chars, 1 uppercase, 1 special char')
      .required(),
    address: Yup.string().max(400).required(),
    role: Yup.string().oneOf(['admin', 'user', 'owner']).required(),
  });

  const storeSchema = Yup.object().shape({
    name: Yup.string().required(),
    email: Yup.string().email().required(),
    address: Yup.string().required(),
    owner_id: Yup.number().required(),
  });

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Admin Dashboard</h2>
        <button onClick={() => {
        localStorage.removeItem('token');
        window.location.href = '/';
        }} style={{ float: 'right', padding: '5px 10px' }}>
        Logout
        </button>
        
      {/* Dashboard Stats */}
      <div style={{ marginBottom: '2rem' }}>
        <p><strong>Total Users:</strong> {stats.totalUsers}</p>
        <p><strong>Total Stores:</strong> {stats.totalStores}</p>
        <p><strong>Total Ratings:</strong> {stats.totalRatings}</p>
      </div>

      {/* Add User */}
      <div style={{ marginBottom: '2rem' }}>
        <h4>Add User</h4>
        <Formik
          initialValues={{ name: '', email: '', password: '', address: '', role: 'user' }}
          validationSchema={userSchema}
          onSubmit={async (values, { resetForm }) => {
            await API.post('/admin/users', values);
            fetchDashboard();
            resetForm();
          }}
        >
          {() => (
            <Form>
              <Field name="name" placeholder="Full Name" /><ErrorMessage name="name" component="div" />
              <Field name="email" placeholder="Email" /><ErrorMessage name="email" component="div" />
              <Field name="password" placeholder="Password" /><ErrorMessage name="password" component="div" />
              <Field name="address" placeholder="Address" /><ErrorMessage name="address" component="div" />
              <Field as="select" name="role">
                <option value="user">User</option>
                <option value="admin">Admin</option>
                <option value="owner">Owner</option>
              </Field>
              <button type="submit">Add User</button>
            </Form>
          )}
        </Formik>
      </div>

      {/* Add Store */}
      <div style={{ marginBottom: '2rem' }}>
        <h4>Add Store</h4>
        <Formik
          initialValues={{ name: '', email: '', address: '', owner_id: '' }}
          validationSchema={storeSchema}
          onSubmit={async (values, { resetForm }) => {
            await API.post('/admin/stores', values);
            fetchDashboard();
            resetForm();
          }}
        >
          {() => (
            <Form>
              <Field name="name" placeholder="Store Name" /><ErrorMessage name="name" component="div" />
              <Field name="email" placeholder="Store Email" /><ErrorMessage name="email" component="div" />
              <Field name="address" placeholder="Address" /><ErrorMessage name="address" component="div" />
              <Field name="owner_id" placeholder="Owner ID" /><ErrorMessage name="owner_id" component="div" />
              <button type="submit">Add Store</button>
            </Form>
          )}
        </Formik>
      </div>

      {/* Users Table */}
      <div>
        <h4>Users</h4>
        <table border="1" cellPadding="8">
          <thead>
            <tr><th>Name</th><th>Email</th><th>Address</th><th>Role</th></tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.address}</td>
                <td>{u.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Stores Table */}
        <div>
        <h4>Stores</h4>
        <table border="1" cellPadding="8">
            <thead>
            <tr>
                <th>Name</th> 
                <th>Email</th>
                <th>Address</th>
                <th>Owner Name</th> {/* New column */}
                <th>Rating</th>
            </tr>
            </thead>
            <tbody>
            {stores.map(s => (
                <tr key={s.id}>
                <td>{s.name}</td>
                <td>{s.email}</td>
                <td>{s.address}</td>
                <td>{s.owner_name || 'N/A'}</td> {/* Show owner name */}
                <td>{Number(s.rating).toFixed(1)}</td>
                </tr>
            ))}
            </tbody>
        </table>
        </div>


    </div>
  );
};

export default AdminDashboard;
