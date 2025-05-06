import React from 'react';
import { useAwareness } from '@slate-yjs/react';

export default function PresenceList() {
  const awareness = useAwareness();
  const users = Array.from(awareness.getStates().values())
    .filter(user => user.name);

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      background: 'white',
      padding: '15px',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    }}>
      <h3 style={{ marginTop: 0 }}>Online Users</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {users.map((user, index) => (
          <li key={index} style={{ display: 'flex', alignItems: 'center', margin: '5px 0' }}>
            <span style={{
              display: 'inline-block',
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: user.color,
              marginRight: '8px'
            }} />
            {user.name}
          </li>
        ))}
      </ul>
    </div>
  );
}