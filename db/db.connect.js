const mongoose = require("mongoose")
require("dotenv").config()
const mongoUri = process.env.MONGODB

const recipeData = async() => {
    await mongoose
    .connect(mongoUri)
    .then(() => {console.log("Connected to Database.")
    })
    .catch((error) => console.log("Error Occured.", error))
}
module.exports = {recipeData}

