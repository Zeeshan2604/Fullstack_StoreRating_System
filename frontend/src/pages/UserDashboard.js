import { useEffect, useState } from 'react';
import API from '../services/api';
import { Formik, Form, Field } from 'formik';


const UserDashboard = () => {
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    const res = await API.get('/user/stores');
    setStores(res.data);
  };

  const filteredStores = stores.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.address.toLowerCase().includes(search.toLowerCase())
  );

  const handleRating = async (storeId, rating, resetForm) => {
    await API.post('/user/rate', { storeId, rating });
    fetchStores();
    resetForm();
  };

  

  return (
    
    <div style={{ padding: '2rem' }}>
      <h2>User Dashboard</h2>
        <button
        onClick={() => {
        localStorage.removeItem('token');
        window.location.href = '/';
        }}
        style={{ float: 'right', padding: '5px 10px' }}>
        Logout
        </button>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search by name/address"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginBottom: '1rem', padding: '0.5rem', width: '300px' }}
      />

      {/* Store List */}
      <table border="1" cellPadding="8" width="100%">
        <thead>
          <tr>
            <th>Store Name</th>
            <th>Address</th>
            <th>Overall Rating</th>
            <th>Your Rating</th>
            <th>Submit / Modify</th>
          </tr>
        </thead>
        <tbody>
          {filteredStores.map(store => (
            <tr key={store.id}>
              <td>{store.name}</td>
              <td>{store.address}</td>
              <td>{Number(store.avg_rating).toFixed(1)}</td>
              <td>{store.user_rating ?? 'N/A'}</td>
              <td>
                <Formik
                  initialValues={{ rating: store.user_rating || '' }}
                  enableReinitialize
                  onSubmit={(values, { resetForm }) =>
                    handleRating(store.id, values.rating, resetForm)
                  }
                >
                  {() => (
                    <Form>
                      <Field as="select" name="rating">
                        <option value="">Select</option>
                        {[1, 2, 3, 4, 5].map(num => (
                          <option key={num} value={num}>{num}</option>
                        ))}
                      </Field>
                      <button type="submit">Save</button>
                    </Form>
                  )}
                </Formik>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserDashboard;
