import React, { useEffect, useState } from 'react';
import API from '../api';
import { Link } from 'react-router-dom';

function Recommendations() {
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    API.get('/users/recommendations').then(res => setRestaurants(res.data));
  }, []);

  return (
    <div>
      <h2>Recommended Restaurants</h2>
      <ul>
        {restaurants.map(r => (
          <li key={r._id}>
            <Link to={`/restaurants/${r._id}`}>{r.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Recommendations; 