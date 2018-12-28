// Wait until content is loaded (sort of just as a precaution at this point)
document.addEventListener("DOMContentLoaded", function()
{
    getPokemon("random");
});

// Two Modes - "Random" as input returns a random pokemon. Anything else signifies a specific name 
// This function retrieves all the relevant data needed to fill out every field on the webpage 
function getPokemon(input)
{
    if (input.toLowerCase() ===  "random")
    {
        input = Math.floor(Math.random() * 802 + 1).toString();
    }

    let pokemonData, pokemonDataOK = true;

    // Getting pokemon data 
    console.log("Pokemon Data URL: " + "https://pokeapi.co/api/v2/pokemon/" + input + "/"); // Debug

    // Getting pokemonData
    fetch("https://pokeapi.co/api/v2/pokemon/" + input + "/")    
    .then(function(response)
    {     
        if (!response.ok)
        {
            // Only should realistically enter here whenever the user inputs a nonvalid pokemon name 
            document.getElementById("pokemonName").textContent = "Pokemon Not Found.";
            document.getElementById("pokemonDescription").textContent = "Please revise your search."; 

            // This will go to the catch             
            throw new Error("Pokemon Data Retrieval Error - HTTP Code " + response.status);   
        }   

        return response.json();       
    })
    .then(function(pokemonData)
    {          
        updatePokemonData(pokemonData);      
        return pokemonData;
    })
    .then(function(pokemonData)
    {
        // IMPORTANT NOTE: This doesn't have to be in a separate then(), this just makes it easier for me to organize and read. Performance impact is basically nil  
        console.log("Species Data URL: " + pokemonData.species.url); // Debug 

        /* Getting species data */
        fetch(pokemonData.species.url)
        .then(function(response)
        {
            if (!response.ok)
            {
                throw new Error("Species Data Retrieval Error - HTTP Error Code " + response.status);
            }

            return response.json();
        })
        .then(function(speciesData)
        {
            // Both of these objects are full of data, so can be passed
            updateSpeciesData(speciesData);
        })
        .catch(function(err)
        {
            console.log(err);
        });

        /*
        // Getting the data for each ability and calling the ability update function for each
        for (let i = 0; i < pokemonData.abilities.length; i++)
        {
            // Debug 
            console.log("Getting ability data from URL " + pokemonData.abilities[i].move.url);

            fetch(pokemonData.abilities[i].move.url)
            .then(function(response)
            {
                if (!response.ok)
                {
                    throw new Error("Ability Data Retrieval Error - HTTP Error Code " + response.status);
                }

                return response.json();
            })
            .then(function(abilityData)
            {
                updateAbilityData(abilityData);
            })
            .catch(function(err)
            {
                console.log(err);
            });
        }    
        */
    })    
    .catch(function(err)
    {
        pokemonDataOK = false;
        console.log(err);       
    });
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
    var key = e.which || e.keyCode;

    if (key === 13)
    { 
      let pokemonName = document.getElementById("textInput").value;
      getPokemon(pokemonName.toLowerCase());
    }
});
