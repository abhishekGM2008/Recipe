const { recipeData } = require("./db/db.connect")
recipeData()
const Recipe = require("./models/recipe.models")

const express = require("express")
const app = express()
app.use(express.json())

const PORT = 3000
app.listen(PORT, () => {
    console.log("Server Running on", PORT)
})

const cors = require("cors")
const corsOptions = {
    origin: "*",
    credentials: true,
    optionSuccessStatus: 200
}

app.use(cors(corsOptions))


//3, function for creating new recipe...
    const createNewRecipe = async(newRecipe) => {
    try{
        const newRecipeCreated = new Recipe(newRecipe)
        const savednewRecipe = await newRecipeCreated.save()
        return savednewRecipe
    }
     catch(error){
        console.log("error occured while creating new recipe", error)
     }
}

app.post("/addRecipe", async (req, res) => {
    try{
        const recipeCreated = await createNewRecipe(req.body)
        if(recipeCreated){
            res.status(201).json({message: "Recipe added successfully", recipe: recipeCreated})
        } else {
            res.status(404).json({error: "Recipe not added."})
        }
    }
    catch(error){
        res.status(500).json({error: "Failed to create new recipe..."})
    }
} )

app.get("/", (req, res) => {
    res.send("Hi, Welcome to Recipe Website...")
})


//6, Function to get all recipes in db as response

const allRecipes = async () => {
try{
    const recipeFound = await Recipe.find()
    return recipeFound
}
catch(error){
    console.log("error occured while reading all REcipes", error)
}
}

app.get("/allrecipes", async (req, res) => {
    try{
        const readRecipes = await allRecipes()
        if(readRecipes){
            res.status(201).json(readRecipes)
        } else {
            res.status(404).json({error: "No Data is found."})
        }
    }
    catch(error){
        res.status(500).json({error: "failed to fetch all recipes data."})
    }
})

//7, function to get details from title..

const readByTitle = async (recipeTitle) => {
    try{
        const recipeByTitle = await Recipe.findOne({title: recipeTitle})
        return recipeByTitle
    }
    catch(error){
        console.log("Error occured while fetching the data.", error)
    }
}

app.get("/recipe/:recipeTitle", async (req, res) => {
    try{
        const reciperead = await readByTitle(req.params.recipeTitle)
        if(reciperead){
            res.status(201).json(reciperead)
        } else {
            res.status(404).json({error: "Recipe not found."})
        }
    }
    catch(error){
        res.status(500).json({error: "Failed to fetch the data."})
    }
})

//function to get details from author

const readByAuthor = async (authorName) => {
    try{
        const recipeByAuthor = await Recipe.findOne({author: authorName})
        return recipeByAuthor
    }
    catch(error){
        console.log("error occured while fecthing the data.", error)
    }
}

app.get("/recipes/author/:authorName", async (req, res) => {
    try{
        const authorRecipe = await readByAuthor(req.params.authorName)
        if(authorRecipe){
            res.status(201).json(authorRecipe)
        } else {
            res.status(404).json({error: "Data not found."})
        }
    }
    catch(error){
        res.status(500).json({error: "failed to fetch the data."})
    }
})

//9 , to get all the recipes which are easy difficulty level...

const easyMethod = async (levelOf) => {
    try{
        const levelOfmaking = await Recipe.findOne({difficulty: levelOf})
        return levelOfmaking
    }
    catch(error){
        console.log("failed to fetch the data", error)
    }
}

app.get("/recipes/difficulty/:levelOf", async (req, res) => {
    try{
        const selectedLevel = await easyMethod(req.params.levelOf)
        if(selectedLevel){
            res.status(201).json(selectedLevel)
        } else{
            res.status(404).json({error: "data not found."})
        }
    }
     catch(error){
        res.status(500).json({error: "failed to fetch the data."})
     }
})

//10, function to update difficulty level from intermediate to easy of recipe spaghetti carbonara

const updatelevel =  async (recipeId, level) => {
    try{
        const changingLevel = await Recipe.findByIdAndUpdate( recipeId, level , {new: true})
        return changingLevel
    }
    catch(error){
        console.log("failed to fetch the data.", error)
    }
}

app.post("/recipe/update/:recipeId", async (req, res) => {
    try{
        const updatedNew = await updatelevel(req.params.recipeId, req.body)
        if(updatedNew){
            res.status(201).json({message: "Data is updated", recipe: updatedNew})
        } else{
            res.status(404).json({error: "Data is not found"})
        }
    }
    catch(error){
        res.status(500).json({error: "Failed to update the data."})
    }
})


//11, function to update prep time and cook time by using its title

const updateTime = async (recipeTitle , timeUp) => {
    try{
        const newTime = await Recipe.findOneAndUpdate({title: recipeTitle}, timeUp , {new: true})
        return newTime
    }
    catch(error){
        console.log("error occured while fecthing the data.", error)
    }
}

app.post("/recipe/updating/:recipeTitle", async (req, res) => {
    try{
        const newUpdatedTime = await updateTime(req.params.recipeTitle, req.body)
        if(newUpdatedTime){
            res.status(201).json({message: "The data is updated successfully", recipe: newUpdatedTime})
        } else{
            res.status(404).json({error: "data is not found."})
        }
    }
    catch(error){
        res.status(500).json({error: "Failed to update the data."})
    }
})

//12, function to delete the recipe... with recipe id

const deleteRecipe  = async (recipeId) => {
    try{
        const selectedRecipe = await Recipe.findByIdAndDelete(recipeId, {new: true})
        return selectedRecipe
    }
    catch(error){
        console.log("Error occured while fetching the data.", error)
    }
}

app.delete("/recipe/deleting/:recipeId", async (req, res) => {
    try{
        const recipeDeleted = await deleteRecipe(req.params.recipeId)
        if(recipeDeleted){
            res.status(201).json({message: "Recipe deleted successfully", recipe: recipeDeleted})
        } else {
            res.status(404).json({error: "Data not found"})
        }
    }
    catch(error){
        res.status(500).json({error: "failed to delete the data."})
    }
})