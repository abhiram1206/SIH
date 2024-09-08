import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import ModelViewer from './ModelViewer';

const Modal = ({ isOpen, onClose, plant, recommendations, onPlantClick }) => {
  const [showRecommendations, setShowRecommendations] = useState(true);

  useEffect(() => {
    // Reset to show recommendations when modal first opens
    setShowRecommendations(true);
  }, [plant]);

  const handlePlantClick = (recPlant) => {
    // Hide recommendations and show the clicked plant details
    setShowRecommendations(false);
    onPlantClick(recPlant);
  };

  const handleClose = (e) => {
    e.stopPropagation();
    onClose();
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-md shadow-md w-11/12 max-h-[90vh] h-fit overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{plant.name}</h2>
          <button onClick={handleClose} className="text-xl font-bold">&times;</button>
        </div>
        <div className="flex flex-row">
          <div className="">
            <ModelViewer modelPath={`http://localhost:3000/${plant.blenderModel}`} />
          </div>
          <div className="w-1/2">
            <p>{plant.description}</p>
          </div>
        </div>
        
        {/* Conditionally render the recommendations section */}
        {showRecommendations && (
          <>
            <h3 className="mb-2 text-2xl font-bold"> Same Category</h3>
            <div className="grid grid-cols-3 gap-4">
              {recommendations.map((recPlant) => (
                <div 
                  key={recPlant._id} 
                  className="relative overflow-hidden rounded-lg shadow-lg cursor-pointer"
                  onClick={() => handlePlantClick(recPlant)}  // Handle click on recommended plant
                >
                  <img
                    src={`http://localhost:3000/${recPlant.plantImage}`}
                    alt={recPlant.name}
                    className="h-64 w-full object-cover"
                  />
                  <h4 className="text-xl font-bold p-4">{recPlant.name}</h4>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>,
    document.body
  );
};

export default Modal;
