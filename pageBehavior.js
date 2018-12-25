// Wait until content is loaded (sort of just as a precaution at this point)
document.addEventListener("DOMContentLoaded", function()
{
    getPokemon("random");
});

// Two Modes - "Random" as input returns a random pokemon. Anything else signifies a specific name 
function getPokemon(input)
{
    let searchQuery = input;

    if (input.toLowerCase() ===  "random")
    {
        searchQuery = Math.floor(Math.random() * 802 + 1).toString();
    }

    // Getting the pokemon data 
    fetch("https://pokeapi.co/api/v2/pokemon/" + searchQuery + "/")    
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
        .then(function(response2)
        {
            if (!response2.ok)
            {
                console.log("Species Response: Fail. Throwing error.");
            }

            return response2.json();
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
        document.getElementById("pokemonName").textContent = "";
        document.getElementById("pokemonDescription").textContent = "No Pokemon With That Name Found. Please revise your search.    ";
    });
}

// This is heavily methodized because otherwise it would be one long mess and it's far easier to debug this way
function updatePage(pokemonData, speciesData)
{
    /* All the function calls that set up the page based on the passed-in JSON data. */
    setPicture(pokemonData, speciesData);
    setName(pokemonData, speciesData);
    setFlavorText(pokemonData, speciesData);
    setMoves(pokemonData, speciesData);
    setWidthHeight(pokemonData, speciesData);
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

function setWidthHeight(pokemonData, speciesData)
{
    // Setting width
    document.getElementById("weightText").innerText = "Weight: " + pokemonData.weight + " hectograms";

    // Setting height
    document.getElementById("heightText").innerText = "Height: " + pokemonData.height + " decimeters"; 
}

function setMoves(pokemonData, speciesData)
{
    // Getting a list of moves from the JSON object
    let movesList = [], numMoves = pokemonData.moves[0].length;
    for (let i = 0; i < pokemonData.moves.length; i++)
    {
        movesList.push(pokemonData.moves[i].move.name);
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

/* Todo - Rewrite anything relevant to only fetch data if it's needed */
function setAbilities(pokemonData, speciesData)
{
    // Utilized for organizational reasons mostly (slight performance hit but helps readability)
    let name, isHidden;

    // Iterates through each ability and adds it to the page 
    // Accounts for if the pokemon has zero abilities too 
    for (let i = 0; i < pokemonData.abilities.length; i++)
    {
        name = pokemonData.abilities[i].ability.name;
        isHidden = pokemonData.abilities[i].is_hidden;

        // Gets and sets the data from the ability
        getSetAbilityData(pokemonData.abilities[i].ability.url, isHidden, name);
    }
}

// This function gets the data from the API and then sets the relevant on-page elements using the DOM 
function getSetAbilityData(url, isHidden, name)
{
    fetch(url)
    .then(function(response)
    {
        if (!response.ok)
        {
            console.log("Malformed response from server in getAbilityData.");
        }

        return response.json();
    })
    .then(function(data)
    {
        /* 
            This is my solution to not being able to return something to the parent function from a child function.

            Basically, every piece of API data you'd get has a "get" and "set", where "get" is the actual api call
            and set is actually setting the data on the page 
        */
        setAbilityData(data, isHidden, name);
    })
    .catch(function(err)
    {
        console.log("Error getting data from getAbilityData. Error: " + err);
    })
}

// Appends a single ability and its information to the page 
function setAbilityData(abilityData, isHidden, name)
{
    // Getting the parent element that it'll be appended to 
    // Todo - Pass this through so that it doesn't need done for each ability 
    let parent = document.getElementById("abilitiesContainer");

    // Initializing HTML elements
    let title = document.createElement("h3");
    let description = document.createElement("p3");
    let hiddenText;

    // If it's hidden, adjust some formatting
    if (isHidden)
    {
        title.style.display = "inline";

        hiddenText = "(Hidden)";
        hiddenText.style.fontWeight = "bold";       
    }    

    // Giving them the correct text 
    title = name;
    
    let flag = false, i = 0;

    do 
    {
        if (abilityData.flavor_text_entries[i].language.name === "en")
        {
            description = abilityData.flavor_text_entries[i].flavor_text;
            flag = true;
        }

    } while(!flag);

    // Actually putting them on the page 
    parent.appendChild(title);
    parent.appendChild(hiddenText);
    parent.appendChild(description);
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
