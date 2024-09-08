// BookMark.js
import React from 'react';
import { FaBookmark } from 'react-icons/fa';
import { Button } from "./ui/button";

export default function BookMark({ bookmarkedPlants, data, onCardClick, handleBookmarkClick }) {
  const bookmarkedData = data.filter(plant => bookmarkedPlants.includes(plant._id));

  if (bookmarkedData.length === 0) {
    return <p>No bookmarks found.</p>;
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {bookmarkedData.map((plant) => (
        <div 
          key={plant._id} 
          className="relative overflow-hidden rounded-lg shadow-lg cursor-pointer transition duration-300 ease-in-out transform hover:scale-105" 
          onClick={() => onCardClick(plant)}
        >
          <img
            src={`http://localhost:3000/${plant.plantImage}`}
            alt={plant.name}
            width={600}
            height={400}
            className="h-64 w-full object-cover"
            style={{ aspectRatio: "600/400", objectFit: "cover" }}
          />
          <div className="absolute top-2 right-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleBookmarkClick(plant);
              }}
              className={`text-2xl ${bookmarkedPlants.includes(plant._id) ? 'text-blue-500' : 'text-gray-500'}`}
            >
              {bookmarkedPlants.includes(plant._id) ? <FaBookmark /> : <FaRegBookmark />}
            </button>
          </div>
          <div className="bg-white p-4">
            <h3 className="text-xl font-bold">{plant.name}</h3>
            <p className="text-sm text-gray-500">
              {plant.description ? plant.description.substring(0, 100) + '...' : 'No description available.'}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
