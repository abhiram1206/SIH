import express from 'express'
import multer from 'multer'
import mongoose from 'mongoose'
import cors from 'cors'
import bodyParser from 'body-parser'
import path from 'path'
import fs from 'fs'
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { fileURLToPath } from 'url'
import 'dotenv/config'
import Plant from './Models/Plants.js' // Assuming you have a Plant model
import User from './Models/User.js'

const app = express()
app.use(express.json())
app.use(cors())
app.use(bodyParser.json())
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, 'uploads')
    cb(null, uploadPath) 
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`)
  }
})

const upload = multer({ storage })

mongoose.connect(process.env.MONGODB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => app.listen(process.env.SERVER_PORT, () => {
    console.log(`Connected to Database and listening on ${process.env.SERVER_PORT}`)
  }))
  .catch((err) => console.log('Database connection error:', err))

app.post('/createPlant', upload.fields([
    { name: 'blenderModel', maxCount: 1 },
    { name: 'plantImage', maxCount: 1 }
  ]), async (req, res) => {
    // Debugging: Check what's in req.body
    console.log('Request Body:', req.body)
  
    const { name, description, category } = req.body // Destructure the fields from the body
  
    try {
      // Get relative paths by removing the absolute part
      const blenderModel = req.files['blenderModel'] ? `uploads/${req.files['blenderModel'][0].filename}` : null
      const plantImage = req.files['plantImage'] ? `uploads/${req.files['plantImage'][0].filename}` : null
  
      if (!blenderModel || !plantImage) {
        return res.status(400).json({ error: 'Both blenderModel and plantImage are required.' })
      }
  
      // Validate the presence of required fields
      if (!name || !description || !category) {
        return res.status(400).json({ error: 'Name, description, and category are required.' })
      }
  
      // Create a new plant document
      const newPlant = new Plant({
        name,
        description,
        blenderModel,
        plantImage,
        category
      })
  
      await newPlant.save()
  
      res.status(200).json({ message: 'Plant created successfully', plant: newPlant })
    } catch (error) {
      console.error('Error creating plant:', error)
      res.status(500).json({ error: error.message })
    }
})

app.get("/getPlants", async(req, res) => { 
    try {
        let plants  = await Plant.find({})
        res.send({status: "ok", data: plants})
    } catch (error) {
        console.error('Error Fetching plant:', error)
      res.status(500).json({ error: error.message })
    }
})
  

// DELETE Plant by ID
app.delete('/deletePlant/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Find the plant by ID
    const plant = await Plant.findById(id);
    if (!plant) {
      return res.status(404).json({ error: 'Plant not found' })
    }

    // Delete the GLB file and Image associated with the plant
    if (plant.blenderModel) {
      const blenderModelPath = path.join(__dirname, plant.blenderModel)
      fs.unlink(blenderModelPath, (err) => {
        if (err) {
          console.error(`Failed to delete blender model file: ${blenderModelPath}`, err)
        }
      });
    }

    if (plant.plantImage) {
      const plantImagePath = path.join(__dirname, plant.plantImage);
      fs.unlink(plantImagePath, (err) => {
        if (err) {
          console.error(`Failed to delete plant image file: ${plantImagePath}`, err)
        }
      });
    }

    // Delete the plant from the database
    await Plant.findByIdAndDelete(id)

    return res.status(200).json({ message: 'Plant deleted successfully' });
  } catch (error) {
    console.error('Error deleting plant:', error)
    res.status(500).json({ error: error.message })
  }
})


let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

const formatDatatoSend = (user) => {
  const access_token = jwt.sign({ id: user._id }, process.env.SECRET_KEY)
  return {
      _id: user._id,
      addresses: user.addresses,
      access_token,
      profile_img: user.personal_info.profile_img,
      username: user.personal_info.username,
      email: user.personal_info.email,
      fullname: user.personal_info.fullname,
  }
}
const generateUsername = async (email) => {
  let username = email.split("@")[0];

  let isUsernameNotUnique = await User.exists({"personal_info.username": username}).then((result) => result);

  if (isUsernameNotUnique) {
      username += nanoid().substring(0, 5); // Append nanoid with an underscore separator
  }

  return username;
}


app.post("/signup", (req, res) => {
  
  if (!req.body || !req.body.username || !req.body.fullname || !req.body.email || !req.body.password) {
      return res.status(400).json({"error":"Request body is missing required fields"});
  }
  
  let { username, fullname, email, password } = req.body

  // Validate fullname
  if(fullname.length < 5){
      return res.status(403).json({"error":"Fullname must be at least 3 characters long"})
  }
  if(username.length < 5){
      return res.status(403).json({"error":"Username must be at least 3 characters long"})
  }

  // Validate email
  if(!email.length){
      return res.status(403).json({"error":"Enter email address"})
  }
  if(!emailRegex.test(email)){
      return res.status(403).json({"error":"Email is Invalid"})
  }

  // Validate password
  if(!passwordRegex.test(password)){
      return res.status(403).json({"error":"Password should be 6 to 20 characters long with a numeric, 1 uppercase and 1 lowercase letters"})
  }

  bcrypt.hash(password, 10, async (err, hashed_password)=>{
      let user = new User({
          personal_info: {username, email,fullname, password:hashed_password}
      })

      console.log(user)

      user.save().then((u)=>{
          return res.status(200).json(formatDatatoSend(u))
      })
      .catch(err =>{
          if(err.code == 11000){
              return res.status(500).json({"error":"Email already exists"})
          }
          return res.status(500).json({"error":err.message})
      })
  })
})

app.post("/signin", (req, res) => {
  const { email, password } = req.body
  User.findOne({"personal_info.email":email})
  .then((user)=>{
      if(!user){
          return res.status(403).json({"error":"email not found"})
      }
      bcrypt.compare(password, user.personal_info.password,(err, result) =>{
          if(err){
              return res.status(403).json({"error":"Error occured while login please try again"})
          }
          if(!result){
              return res.status(403).json({"error":"Incorrect password"})
          } else {
              return res.status(200).json(formatDatatoSend(user))
          }
      })

  })
  .catch(err => {
      console.log(err.message)
      return res.status(500).json({"error":err.message})
  })
})

// Add these routes in your Express app

// Save/Bookmark a plant
// Save/Bookmark a plant
app.post('/savePlant', async (req, res) => {
  const { userId, plantId } = req.body;

  console.log("Request received with body:", req.body);  // Log the body received

  if (!userId || !plantId) {
    return res.status(400).json({ error: 'User ID and Plant ID are required.' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // Check if the plant is already saved
    if (user.saved_plants.includes(plantId)) {
      return res.status(400).json({ error: 'Plant is already saved.' });
    }

    user.saved_plants.push(plantId);
    await user.save();
    res.status(200).json({ message: 'Plant saved successfully.' });
  } catch (error) {
    console.error('Error saving plant:', error);
    res.status(500).json({ error: error.message });
  }
});

// Remove a saved plant
app.post('/removeSavedPlant', async (req, res) => {
  const { userId, plantId } = req.body;

  console.log("Request received with body:", req.body);  // Log the body received

  if (!userId || !plantId) {
    return res.status(400).json({ error: 'User ID and Plant ID are required.' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // Remove the plant from the saved list
    user.saved_plants = user.saved_plants.filter(id => id.toString() !== plantId);
    await user.save();
    res.status(200).json({ message: 'Plant removed successfully.' });
  } catch (error) {
    console.error('Error removing saved plant:', error);
    res.status(500).json({ error: error.message });
  }
});
