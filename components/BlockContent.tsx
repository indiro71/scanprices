import React from 'react';

export const BlockContent = ({ children }) => {
  return (
    <div className="bg-white p-5 bg-opacity-50 rounded-2xl shadow">
      {children}
    </div>
  );
};
