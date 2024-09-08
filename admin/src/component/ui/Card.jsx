import React from 'react';

export const Card = ({ children }) => {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      {children}
    </div>
  );
};

export const CardContent = ({ children }) => {
  return <div className="p-4">{children}</div>;
};

export const CardFooter = ({ children }) => {
  return <div className="px-4 py-2  bg-white">{children}</div>;
};
