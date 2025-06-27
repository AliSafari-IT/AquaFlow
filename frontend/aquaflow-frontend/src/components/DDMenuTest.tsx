import React from 'react';
import { DDMenu } from '@asafarim/dd-menu';

const DDMenuTest = () => {
  const testItems = [
    { id: '1', label: 'Item 1', onClick: () => console.log('Item 1 clicked') },
    { id: '2', label: 'Item 2', onClick: () => console.log('Item 2 clicked') },
    { id: '3', label: 'Item 3', onClick: () => console.log('Item 3 clicked') },
  ];

  return (
    <div style={{ padding: '20px', background: '#f0f0f0', margin: '20px' }}>
      <h3>DDMenu Test</h3>
      <DDMenu
        trigger={<button style={{ padding: '10px 20px', background: '#4299e1', color: 'white', border: 'none', borderRadius: '5px' }}>Test Menu</button>}
        items={testItems}
      />
    </div>
  );
};

export default DDMenuTest;
