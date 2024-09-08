// src/components/ui/input.js
import React from "react";

export const Input = ({ type = "text", ...props }) => {
  return (
    <input
      type={type}
      className="border border-gray-300 px-3 py-2 rounded-md"
      {...props}
    />
  );
};
