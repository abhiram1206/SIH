import React from 'react';

export const Dialog = ({ open, onOpenChange, children }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white w-full max-w-md rounded-lg shadow-lg">
        {children}
      </div>
    </div>
  );
};

export const DialogContent = ({ children }) => {
  return <div className="p-6">{children}</div>;
};

export const DialogHeader = ({ children }) => {
  return <div className="border-b px-6 py-4">{children}</div>;
};

export const DialogTitle = ({ children }) => {
  return <h2 className="text-xl font-semibold">{children}</h2>;
};

export const DialogDescription = ({ children }) => {
  return <p className="text-sm text-gray-500">{children}</p>;
};

export const DialogFooter = ({ children }) => {
  return <div className="px-6 py-4 bg-gray-100">{children}</div>;
};
