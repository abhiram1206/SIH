import { useEffect, useState, useContext } from 'react';
import { Button } from "./ui/button";
import Footer from './Footer';
import Navbar from './Navbar';
import Modal from './Modal';  // Import the modal component
import BookMark from './BookMark';  // Import the BookMark component
import { FaBookmark, FaRegBookmark } from "react-icons/fa";
import axios from 'axios';
import { UserContext } from '../App';

export default function Explore() {
  const [data, setData] = useState([]);
  const [bookmarkedPlants, setBookmarkedPlants] = useState([]); // Change Set to array
  const [selectedPlant, setSelectedPlant] = useState(null); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [filterCategories, setFilterCategories] = useState([]); 
  const [isFilterOpen, setIsFilterOpen] = useState(false); 
  const [searchQuery, setSearchQuery] = useState(''); 
  const [viewBookmarks, setViewBookmarks] = useState(false); // Manage view state

  let { userAuth: { _id } } = useContext(UserContext);  // Get user ID from context

  useEffect(() => {
    fetch('http://localhost:3000/getPlants', {
      method: 'GET',
    })
      .then((res) => res.json())
      .then((data) => {
        setData(data.data);
        setBookmarkedPlants(data.data.filter(plant => plant.isBookmarked).map(plant => plant._id));
      });
  }, []);

  const handleCardClick = (plant) => {
    setSelectedPlant(plant);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPlant(null);
  };

  const handleBookmarkClick = async (plant) => {
    try {
      // Prepare the payload with userId and plantId
      const payload = {
        userId: _id,  // Make sure _id is from userAuth or UserContext
        plantId: plant._id
      };
  
      console.log("Payload being sent:", payload);  // Debugging: Check the payload
  
      if (bookmarkedPlants.includes(plant._id)) {
        // Remove the bookmark if it's already saved
        const response = await fetch('http://localhost:3000/removeSavedPlant', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });
  
        const result = await response.json();
        console.log("Remove bookmark response:", result);  // Log the response for debugging
  
        if (response.ok) {
          // Update local state by removing the plant from the bookmarked list
          setBookmarkedPlants(prev => prev.filter(id => id !== plant._id));
        } else {
          console.error('Error removing bookmark:', result.error);
        }
      } else {
        // Save the bookmark if it's not saved yet
        const response = await fetch('http://localhost:3000/savePlant', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });
  
        const result = await response.json();
        console.log("Save bookmark response:", result);  // Log the response for debugging
  
        if (response.ok) {
          // Update local state by adding the plant to the bookmarked list
          setBookmarkedPlants(prev => [...prev, plant._id]);
        } else {
          console.error('Error saving bookmark:', result.error);
        }
      }
    } catch (error) {
      console.error('Error in bookmark toggle:', error.message);
    }
  };
  
  
  
  

  const handleCategoryChange = (e) => {
    const { value, checked } = e.target;
    setFilterCategories(prevCategories => 
      checked ? [...prevCategories, value] : prevCategories.filter(category => category !== value)
    );
  };

  const handleApplyFilter = () => {
    setSelectedCategories(filterCategories);
    setIsFilterOpen(false);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const filteredPlants = selectedCategories.length
    ? data.filter(plant => selectedCategories.includes(plant.category))
    : data;

  const searchedPlants = searchQuery
    ? filteredPlants.filter(plant => plant.name.toLowerCase().includes(searchQuery))
    : filteredPlants;

  const sameCategoryPlants = selectedPlant
    ? searchedPlants.filter(plant => plant.category === selectedPlant.category && plant._id !== selectedPlant._id)
    : [];

  const uniqueCategories = [...new Set(data.map(plant => plant.category))];

  return (
    <div className="w-[1480px] mx-auto">
      <Navbar />
      <div className="container mx-auto py-12 px-6">
        <div className="flex justify-between mb-4 gap-5">
          <input
            type="text"
            placeholder="Search plants..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="border bg-gray-200 border-gray-200 rounded px-4 py-2 w-full rounded-lg"
          />
          <Button 
            onClick={() => setIsFilterOpen(!isFilterOpen)} 
            className="bg-green-600 w-40 text-white border-2 border-green-600 hover:bg-transparent hover:text-black px-4 py-2 rounded transition duration-300 ease-in-out transform hover:scale-105"
          >
            {isFilterOpen ? 'Close Filter' : 'Filter'}
          </Button>
          <Button
            onClick={() => setViewBookmarks(!viewBookmarks)}
            className="bg-blue-600 w-40 text-white border-2 border-blue-600 hover:bg-transparent hover:text-black px-4 py-2 rounded transition duration-300 ease-in-out transform hover:scale-105"
          >
            {viewBookmarks ? 'View All' : 'View Bookmarks'}
          </Button>
        </div>

        {isFilterOpen && (
          <div className="bg-gray-100 p-6 rounded-lg shadow-md mb-6 transition-all duration-300 ease-in-out">
            <h2 className="text-2xl font-bold mb-4">Filter by Category</h2>
            <div className="flex flex-col gap-4">
              {uniqueCategories.map(category => (
                <label key={category} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    value={category}
                    onChange={handleCategoryChange}
                    className="form-checkbox h-5 w-5 text-green-600 border-gray-300 rounded"
                  />
                  <span className="text-lg">{category}</span>
                </label>
              ))}
            </div>
            <Button 
              onClick={handleApplyFilter} 
              className="bg-green-600 w-40 text-white border-2 border-green-600 hover:bg-transparent hover:text-black px-4 py-2 rounded transition duration-300 ease-in-out transform hover:scale-105 mt-4"
            >
              Apply Filter
            </Button>
          </div>
        )}

        <main>
          {viewBookmarks ? (
            <BookMark 
              bookmarkedPlants={bookmarkedPlants} 
              data={data} // Pass data as prop
              onCardClick={handleCardClick} 
              handleBookmarkClick={handleBookmarkClick}
            />
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {searchedPlants.map((plant) => (
                <div 
                  key={plant._id} 
                  className="relative overflow-hidden rounded-lg shadow-lg cursor-pointer transition duration-300 ease-in-out transform hover:scale-105" 
                  onClick={() => handleCardClick(plant)}
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
          )}
        </main>

        {selectedPlant && (
          <Modal 
            isOpen={isModalOpen} 
            onClose={closeModal} 
            plant={selectedPlant}
            recommendations={sameCategoryPlants}
            onPlantClick={handleCardClick}
          />
        )}
      </div>
      <Footer />
    </div>
  );
}
