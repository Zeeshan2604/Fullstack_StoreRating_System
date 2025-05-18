import { useEffect, useState } from 'react';
import API from '../services/api';

const OwnerDashboard = () => {
  const [ratings, setRatings] = useState([]);
  const [average, setAverage] = useState(0);
  const [storeName, setStoreName] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const resStore = await API.get('/owner/store-info');
    const resRatings = await API.get('/owner/ratings');
    const resAvg = await API.get('/owner/average-rating');

    setStoreName(resStore.data.name);
    setRatings(resRatings.data);
    setAverage(resAvg.data.averageRating);
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Store Owner Dashboard</h2>

      <h3>Store: {storeName}</h3>

      {/* Average Rating */}
      <div style={{ marginBottom: '1rem' }}>
        <h4>Average Rating: ⭐ {Number(average).toFixed(1)}</h4>
      </div>

      {/* Ratings Table */}
      <div>
        <h4>Ratings Submitted by Users</h4>
        <table border="1" cellPadding="8" width="100%">
          <thead>
            <tr>
              <th>User Name</th>
              <th>Email</th>
              <th>Rating</th>
            </tr>
          </thead>
          <tbody>
            {ratings.length > 0 ? (
              ratings.map((r, i) => (
                <tr key={i}>
                  <td>{r.user_name}</td>
                  <td>{r.email}</td>
                  <td>{r.rating}</td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="3">No ratings submitted yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OwnerDashboard;
