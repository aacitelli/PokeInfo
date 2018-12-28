// Wait until content is loaded (sort of just as a precaution at this point)
document.addEventListener("DOMContentLoaded", function()
{
    getPokemon("random");
});

// Two Modes - "Random" as input returns a random pokemon. Anything else signifies a specific name 
// This function retrieves all the relevant data needed to fill out every field on the webpage 
function getPokemon(input)
{
    // Figuring out which mode to run the function in ("Random" vs. a specified Pokemon)
    let searchQuery = input;

    if (input.toLowerCase() ===  "random")
    {
        searchQuery = Math.floor(Math.random() * 802 + 1).toString();
    }
    
    let pokemonDataOK = true;

    // Getting pokemon data 
    // Debug
    console.log("Getting pokemon data from URL: " + "https://pokeapi.co/api/v2/pokemon/" + searchQuery + "/");

    // Getting pokemonData
    // searchQuery is either a random pokemon's number or the pokemon's name if the user put one in 
    fetch("https://pokeapi.co/api/v2/pokemon/" + searchQuery + "/")    
    .then(function(pokemonDataResponse)
    {
        // Todo - Convert this to something that works across more browsers (response.ok has really meh support cross-browser)
        if (!pokemonDataResponse.ok)
        {
            console.log("Pokemon Response: Fail. Throwing error.");
            throw new Error("HTTP Error " + pokemonDataResponse.status);
        }

        return pokemonDataResponse.json();
    })
    .then(function(pokemonData)
    {        
        updatePokemonData(pokemonData);

        
    })    
    .catch(function(err)
    {
        // Todo - Figure out how to only enter this catch if there's an error with the pokemon data and not other stuff nested in here 
        console.log("Catch of pokemonData retrieval entered. Error: " + err);
        document.getElementById("pokemonName").textContent = "Pokemon Not Found.";
        document.getElementById("pokemonDescription").textContent = "Please revise your search.";
    });
    
    // Getting data that's dependent on the pokemon data
    // I'm not nesting this because that makes error reporting a lot harder 
    if (pokemonDataOK)
    {
        // Debug
        console.log("Getting species data from URL: " + pokemonData.species.url);

        /* Note - The inner data types aren't nested b/c they don't depend on each other, only the original pokemon data */
        // Getting speciesData
        fetch(pokemonData.species.url)
        .then(function(speciesDataResponse)
        {
            if (!speciesDataResponse.ok)
            {
                console.log("Species Response: Fail. Throwing error.");
                throw new Error("HTTP Error " + speciesDataResponse.status);
            }

            return speciesDataResponse.json();
        })
        .then(function(speciesData)
        {
            // Both of these objects are full of data, so can be passed
            updateSpeciesData(speciesData);
        })
        .catch(function(err)
        {
            console.log("Failed to fetch species data. Error: " + err);
        });

        // Getting the data for each ability and calling the ability update function for each
        for (let i = 0; i < pokemonData.abilities.length; i++)
        {
            // Debug 
            console.log("Getting ability data from URL: " + pokemonData.abilities[i].move.url);

            fetch(pokemonData.abilities[i].move.url)
            .then(function(abilityDataResponse)
            {
                if (!abilityDataResponse.ok)
                {
                    console.log("Ability Response: Fail. Throwing error.");
                    throw new Error("HTTP Error " + abilityDataResponse.status);
                }

                return abilityDataResponse.json();
            })
            .then(function(abilityData)
            {
                updateAbilityData(abilityData);
            })
            .catch(function(err)
            {
                console.log("Failed to fetch ability data. Error: " + err);
            });
        }   
    }
}

// Updates any fields that use pokemonData 
function updatePokemonData(pokemonData)
{
    setPicture(pokemonData);
    setName(pokemonData);
    setMoves(pokemonData);
}

// Updates any fields that use the move data 
function updateSpeciesData(speciesData)
{
    setFlavorText(speciesData);
}

// Calls functions which need a single move's data (pretty much just one function, I'm just being consistent w/ the function calling scheme)
function updateAbilityData(abilityData)
{
    // setAbilityData(abilityData);
}

// Both sets of data are passed b/c it's almost zero footprint and very easy to maintain 
function setPicture(pokemonData, speciesData)
{
    // Todo - Figure out a way to get a higher resolution picture
    document.getElementById("pokemonImage").src = pokemonData.sprites.front_default;    
}

function setName(pokemonData)
{
    // Debug
    console.log("Setting name.");

    // Getting name from retrieved JSON data 
    let pokemonName = pokemonData.name;

    // Capitalizing first letter
    pokemonName = pokemonName.slice(0, 1).toUpperCase() + pokemonName.slice(1, pokemonName.length);
    
    // Setting DOM element to be that 
    document.getElementById("pokemonName").textContent = pokemonName;
}

function setFlavorText(speciesData)
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

// Todo - Implement a "search" function where you can search for a move and if the move is there it'll be highlighted 
// Todo - Make it so clicking on a move will output some information about it or open that move's page (first is more likely and easier) 
function setMoves(pokemonData)
{
    // Getting a list of moves from the JSON object
    let movesList = [];
    for (let i = 0; i < pokemonData.moves.length; i++)
    {
        movesList.push(pokemonData.moves[i].move.name);
    }

    try
    {
        // Modifying text formatting - Capitalizes first letters and replaces dashes w/ spaces 
        // Iterates through each move entry 
        for (let i = 0; i < movesList.length; i++)
        {
            // Capitalizing first letter
            movesList[i] = movesList[i].charAt(0).toUpperCase() + movesList[i].slice(1, movesList[i].length);

            // Iterates through for dashes, and if one is found replace w/ a space and capitalize next letter 
            for (let j = 0; j < movesList[i].length; j++)
            {
                if (movesList[i].charAt(j) === "-")
                {
                    // This will technically run into an indexOutOfBounds error if the second word is one character long but should be fine otherwise 
                    movesList[i] = movesList[i].slice(0, j) + " " + movesList[i].charAt(j + 1).toUpperCase() + movesList[i].slice(j + 2, movesList[i].length);
                }
            }
        }
    }

    catch (err)
    {
        console.log("Text Formatting Error in movesList: " + err);
    }
    
    /* Adding them onto the DOM list */
    let listHeader = document.getElementById("skillsList");
    
    // Removes the previous moves from the list 
    while (listHeader.firstChild)
    {
        listHeader.removeChild(listHeader.firstChild);
    }

    for (let i = 0; i < movesList.length; i++)
    {
        let newListElement = document.createElement("li");
        newListElement.textContent = movesList[i];
        newListElement.classList.toggle("possibleMove");
        listHeader.appendChild(newListElement);
    }
}

// This button just calls the retrieval function again
document.getElementById("randomizeButton").addEventListener("click", function()
{
    getPokemon("random");
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
