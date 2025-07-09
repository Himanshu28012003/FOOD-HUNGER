import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api';

function Menu() {
  const { restaurantId } = useParams();
  const [menu, setMenu] = useState(null);

  useEffect(() => {
    API.get(`/menus/${restaurantId}`).then(res => setMenu(res.data));
  }, [restaurantId]);

  if (!menu) return <div>Loading...</div>;

  return (
    <div>
      <h2>Menu</h2>
      <ul>
        {menu.items.map(item => (
          <li key={item._id}>
            <div>{item.name} - ${item.price}</div>
            <div>{item.description}</div>
            <ul>
              {item.reviews?.map(r => (
                <li key={r._id}>{r.comment} (Rating: {r.rating})</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Menu; 