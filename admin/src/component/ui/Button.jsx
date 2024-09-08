// src/components/ui/button.js
import React from "react";

export const Button = ({ onClick,children, variant = "default", ...props }) => {
  const styles = variant === "outline" ? "border border-gray-400" : "bg-green-600 text-white";
  return (
    <button onClick={onClick} className={`px-4 py-2 rounded ${styles}`} {...props}>
      {children}
    </button>
  );
};
