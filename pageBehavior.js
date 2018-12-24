// Wait until content is loaded (sort of just as a precaution at this point)
document.addEventListener("DOMContentLoaded", function()
{
    getRandomPokemon();
});

// Todo - Make this a single function with "modes" or smth like that 
// Todo - Make this spit out if no pokemon matches whatever got put in by the user 
// Same as the randomized one but uses 
function getPokemon(input)
{
    // Getting the pokemon data 
    fetch("https://pokeapi.co/api/v2/pokemon/" + input + "/")    
    .then(function(response)
    {
        if (!response.ok)
        {
            console.log("Pokemon Response: Fail. Throwing error.");
            throw new Error("HTTP Error " + response.status);
        }

        return response.json();
    })    
    .then(function(pokemonData)
    {        
        fetch(pokemonData.species.url)
        .then(function(response)
        {
            if (!response.ok)
            {
                console.log("Species Response: Fail. Throwing error.");
            }

            return response.json();
        })
        .then(function(speciesData)
        {
            // Both of these objects are full of data, so can be passed
            updatePage(pokemonData, speciesData);
        })
        .catch(function(err)
        {
            console.log("Failed to fetch species data. Error: " + err);
        });
    })
    .catch(function(err)
    {
        console.log("Failed to fetch pokemon data. Error: " + err);
        document.getElementById("pokemonName").textContent = "No Pokemon With That Name Found.";
        document.getElementById("pokemonDescription").textContent = "";
    });
}

function getRandomPokemon()
{
    // Total # of pokemon in database
    let pokemonNum = Math.floor(Math.random() * 802 + 1);

    // Getting the pokemon data 
    fetch("https://pokeapi.co/api/v2/pokemon/" + pokemonNum + "/")    
    .then(function(response)
    {
        if (!response.ok)
        {
            console.log("Pokemon Response: Fail. Throwing error.");
            throw new Error("HTTP Error " + response.status);
        }

        return response.json();
    })    
    .then(function(pokemonData)
    {        
        fetch(pokemonData.species.url)
        .then(function(response)
        {
            if (!response.ok)
            {
                console.log("Species Response: Fail. Throwing error.");
            }

            return response.json();
        })
        .then(function(speciesData)
        {
            // Both of these objects are full of data, so can be passed
            updatePage(pokemonData, speciesData);
        })
        .catch(function(err)
        {
            console.log("Failed to fetch species data. Error: " + err);
        });
    })
    .catch(function(err)
    {                
        console.log("Failed to fetch pokemon data. Error: " + err);
        document.getElementById("pokemonName").textContent = "No Pokemon With That Name Found.";
        document.getElementById("pokemonDescription").textContent = "";
    });
}

// This is heavily methodized because otherwise it would be one long mess and it's far easier to debug this way
function updatePage(pokemonData, speciesData)
{
    /* All the function calls that set up the page based on the given JSON data. */
    setPicture(pokemonData, speciesData);
    setName(pokemonData, speciesData);
    setFlavorText(pokemonData, speciesData);
    setMoves(pokemonData, speciesData);
}

// Both sets of data are passed b/c it's almost zero footprint and very easy to maintain 
function setPicture(pokemonData, speciesData)
{
    // Todo - Figure out a way to get a higher resolution picture
    document.getElementById("pokemonImage").src = pokemonData.sprites.front_default;    
}

function setName(pokemonData, speciesData)
{
    // Getting name from retrieved JSON data 
    let pokemonName = pokemonData.name;

    // Capitalizing first letter
    pokemonName = pokemonName.slice(0, 1).toUpperCase() + pokemonName.slice(1, pokemonName.length);
    
    // Setting DOM element to be that 
    document.getElementById("pokemonName").textContent = pokemonName;
}

function setFlavorText(pokemonData, speciesData)
{
    // Todo - Figure out a way of doing this w/o searching through until you find the english one 
    let flavorText, flag = false, currIndex = 0;

    // Getting the english version of the flavor text 
    while (!flag)
    {
        if (speciesData.flavor_text_entries[currIndex].language.name === "en")
        {
            flavorText = speciesData.flavor_text_entries[currIndex].flavor_text;
            flag = true;
        }

        currIndex++; 
    }
    
    // Setting DOm element to be that 
    document.getElementById("pokemonDescription").textContent = flavorText;
}

function setMoves(pokemonData, currIndex)
{
    // Getting a list of moves from the JSON object
    
}

// This button just calls the retrieval function again
document.getElementById("randomizeButton").addEventListener("click", function()
{
    getRandomPokemon();
});

// Fired when ANY key is pressed  
document.getElementById("textInput").addEventListener("keypress", function (e) 
{
    console.log("Event listener fired");
    var key = e.which || e.keyCode;

    if (key === 13)
    { 
      let pokemonName = document.getElementById("textInput").value;
      getPokemon(pokemonName.toLowerCase());
    }
});
