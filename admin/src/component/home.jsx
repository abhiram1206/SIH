import { useState, useEffect } from "react"
import { Button } from "./ui/Button"
import { Card, CardContent, CardFooter } from "./ui/Card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "./ui/Dialog"
import { Label } from "./ui/Label"
import { Input } from "./ui/Input"
import { Textarea } from "./ui/TextArea"

// Fetch Plants from the API
export default function Home() {
  const [plants, setPlants] = useState([])  // Initially an empty array
  const [showAddPlantModal, setShowAddPlantModal] = useState(false)
  const [newPlant, setNewPlant] = useState({
    name: "",
    description: "",
    image: null,
    category: "", // Added category field
    glbFile: null, // Added GLB file field
  })

  // Fetch the plants from the API on component mount
  useEffect(() => {
    const fetchPlants = async () => {
      try {
        const response = await fetch("http://localhost:3000/getPlants")
        const result = await response.json()
        if (response.ok) {
          setPlants(result.data)  // Update the state with fetched plants
        } else {
          console.error('Error fetching plants:', result.error)
        }
      } catch (error) {
        console.error('Error fetching plants:', error)
      }
    }

    fetchPlants()
  }, [])

  const handleAddPlant = () => {
    setShowAddPlantModal(true)
  }

  const handleSubmit = async () => {
    const formData = new FormData();
  
    formData.append("name", newPlant.name);
    formData.append("description", newPlant.description);
    formData.append("category", newPlant.category);
    
    if (newPlant.image) {
      formData.append("plantImage", newPlant.image); // Append the image file
    }
    
    if (newPlant.glbFile) {
      formData.append("blenderModel", newPlant.glbFile); // Append the GLB file
    }
  
    try {
      const response = await fetch("http://localhost:3000/createPlant", {
        method: "POST",
        body: formData, // Send the formData
      });
  
      const result = await response.json();
  
      if (response.ok) {
        setPlants([
          ...plants,
          {
            id: plants.length + 1,
            ...newPlant,
          },
        ]);
        setShowAddPlantModal(false);
        setNewPlant({
          name: "",
          description: "",
          plantImage: null,
          category: "",
          blenderModel: null,
        });
      } else {
        console.error("Error creating plant:", result.error);
      }
    } catch (error) {
      console.error("Error creating plant:", error);
    }
  };
  
  const handleEditPlant = (plant) => {}

  const handleDeletePlant = async (plantId) => {
    try {
      const response = await fetch(`http://localhost:3000/deletePlant/${plantId}`, {
        method: 'DELETE',
      });
  
      if (response.ok) {
        // Filter out the deleted plant from the local state
        setPlants(plants.filter((plant) => plant._id !== plantId));
      } else {
        const result = await response.json();
        console.error('Error deleting plant:', result.error);
      }
    } catch (error) {
      console.error('Error deleting plant:', error);
    }
  };
  

  return (
    <div className="w-full h-full flex flex-col">
      <header className="bg-background border-b px-6 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Plant Management</h1>
        <Button onClick={handleAddPlant}>Add Plant</Button>
      </header>
      <main className="flex-1 overflow-auto p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {plants.map((plant) => (
            <Card key={plant._id}>
              <img
                src={`http://localhost:3000/${plant.plantImage}`}  // Check if image exists
                alt={plant.name}
                width={300}
                height={300}
                className="w-full h-48 object-cover rounded-t-lg"
                style={{ aspectRatio: "300/300", objectFit: "cover" }}
              />
              <CardContent>
                <h3 className="text-lg font-semibold">{plant.name}</h3>
                <p className="text-muted-foreground">{plant.description}</p>
              </CardContent>
              <CardFooter className="flex flex-row gap-5 items-center justify-end">
                <Button variant="outline" size="sm" onClick={() => handleEditPlant(plant)}>
                  Edit
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDeletePlant(plant._id)}>
                  Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>

      {/* Add Plant Modal */}
      <Dialog open={showAddPlantModal} onOpenChange={setShowAddPlantModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Plant</DialogTitle>
            <DialogDescription>Fill in the details for the new plant you want to add.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid items-center grid-cols-4 gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <input
                id="name"
                name="name"
                value={newPlant.name}
                onChange={(e) => setNewPlant({ ...newPlant, name: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid items-center grid-cols-4 gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <textarea
                id="description"
                name="description"
                value={newPlant.description}
                onChange={(e) => setNewPlant({ ...newPlant, description: e.target.value })}
                className="col-span-3 min-h-[100px]"
              />
            </div>
            <div className="grid items-center grid-cols-4 gap-4">
              <Label htmlFor="name" className="text-right">
                Category
              </Label>
              <input
                id="name"
                name="category"
                value={newPlant.category}
                onChange={(e) => setNewPlant({ ...newPlant, category: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid items-center grid-cols-4 gap-4">
              <Label htmlFor="image" className="text-right">
                Image
              </Label>
              <div className="col-span-3">
                <input
                  type="file"
                  name="plantImage"
                  id="image"
                  onChange={(e) => setNewPlant({ ...newPlant, image: e.target.files[0] })}
                />
              </div>
            </div>
            <div className="grid items-center grid-cols-4 gap-4">
              <Label htmlFor="glbFile" className="text-right">
                GLB File
              </Label>
              <div className="col-span-3">
                <input
                  name="blenderModel"
                  type="file"
                  id="glbFile"
                  accept=".glb"
                  onChange={(e) => setNewPlant({ ...newPlant, glbFile: e.target.files[0] })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddPlantModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>Save Plant</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
