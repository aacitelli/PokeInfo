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
            document.getElementById("pokemonDescription").textContent = "Please revise uijyour search."; 

            // This will go to the catch             
            throw new Error("Pokemon Data Retrieval Error - HTTP Code " + response.status);   
        }   

        return response.json();       
    })
    .then(function(pokemonData)
    {          
        updatePokemonData(pokemonData);    

        // IMPORTANT NOTE: This doesn't have to be in a separate then(), this just makes it easier for me to organize and read. Performance impact is basically nil  
        console.log("Species Data URL: " + pokemonData.species.url); // Debug 

        /* RETRIEVING SPECIES DATA */
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

            // Evolution tree data retrieval 
            console.log("Evolution Data URL: " + speciesData.evolution_chain.url);

            fetch(speciesData.evolution_chain.url)
            .then(function(response)
            {
                if (!response.ok)
                {
                    throw new Error("Evolution Data Retrieval Error - HTTP Error Code " + response.status);
                }

                return response.json();
            })
            .then(function(data)
            {
                updateEvolutionData(pokemonData, data);
            })
            .catch(function(err)
            {
                console.error(err);
            })
        })
        .catch(function(err)
        {
            console.error(err);
        });

        /* RETRIEVING DATA FOR EACH ABILITY */
        // I can't do this in the method because that goes on a per-ability basis.
        // This is a method b/c I don't want to put too much code in the "netcode" 
        removePreviousAbilityData();

        // Iterates through each ability that the pokemon has
        for (let i = 0; i < pokemonData.abilities.length; i++)
        {
            console.log("Current Ability URL: " + pokemonData.abilities[i].ability.url);
            fetch(pokemonData.abilities[i].ability.url)
            .then(function(response)
            {
                if (!response.ok)
                {
                    throw new Error("Move Data Retrieval Error - HTTP Error Code " + response.status);                
                }

                return response.json();
            })
            .then(function(abilityData)
            {
                setAbilityData(abilityData);
            })
            .catch(function(err)
            {
                console.error(err);
            });
        }
    })
    .catch(function(err)
    {
        document.getElementById("pokemonImage").src = "";
        document.getElementById("pokemonName").textContent = "Pokemon Not Found.";
        document.getElementById("pokemonDescription").textContent = "Please check your spelling.";
        console.error(err);       
    });
}

// This function gets you a nice, cold, refreshing Sprite out of the fridge
// Seriously though, this returns a URL of a sprite of the passed-in pokemon name  
async function getSprite(pokemonName)
{
    // The user can't straight up run this function but toLowerCase is just incase I pass in something capitalized by accident 
    return fetch("https://pokeapi.co/api/v2/pokemon/" + pokemonName + "/") 
    .then(function(response)
    {
        if (!response.ok)
        {
            throw new Error("Sprite Retrieval Error - HTTP Code " + response.status);
        }

        return response.json();
    })
    .then(function(data)
    {
        return data.sprites.front_default;        
    })
    .catch(function(err)
    {
        console.error(err);
    });
}

// Updates any fields that use pokemonData 
function updatePokemonData(pokemonData)
{
    setPicture(pokemonData);
    setName(pokemonData);
    setMoves(pokemonData);
    setStats(pokemonData);
}

// Updates any fields that use the move data 
function updateSpeciesData(speciesData)
{
    setFlavorText(speciesData);
}

function updateEvolutionData(pokemonData, evolutionData)
{
    setEvolutionData(pokemonData, evolutionData);
}

// Both sets of data are passed b/c it's almost zero footprint and very easy to maintain 
function setPicture(pokemonData)
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
        // Use a method here because it's used elsewhere on the website (the abilities, at least)
        movesList[i] = capitalizeAndRemoveDashes(movesList[i]);
    }   

    // Sets the list equal to the alphabetized version of itself 
    movesList = insertionSortStrings(movesList);
    
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

// Todo - Make the CSS for this look better - Add icons and make it horizontal and all that good stuff 
function setStats(pokemonData)
{
    let parent = document.getElementById("innerStatsContainer");

    // Wiping last ones
    while (parent.firstChild) { parent.removeChild(parent.firstChild) }

    // Todo - Figure out how to modify the order that these are presented in b/c the order PokeAPI presents them in is hella nonintuitive
    // Loops through each stat and adds it to the page 
    for (let i = 0; i < pokemonData.stats.length; i++)
    {        
        let container = document.createElement("div");
        container.classList.toggle("statContainer");

        let image = document.createElement("img");

        // Which sprite gets used depends on the name of the stat 
        // These images are probably copyrighted but w/e, this is a personal project
        switch(pokemonData.stats[i].stat.name)
        {
            case "hp":
            {
                image.src = "http://www.clker.com/cliparts/M/u/b/H/w/K/red-plus-hi.png";
                break;
            }

            case "attack":
            {
                image.src = "https://cdn1.iconfinder.com/data/icons/unigrid-military/60/002_military_battle_attack_swords-512.png";
                break;
            }
            
            case "defense":
            {
                image.src = "https://cdn3.iconfinder.com/data/icons/common-4/24/ui-49-512.png";
                break;
            }

            case "speed":
            {
                image.src = "https://static.thenounproject.com/png/12193-200.png";
                break;
            }

            case "special-attack":
            {
                image.src = "https://cdn3.iconfinder.com/data/icons/game-play/512/gaming-game-play-multimedia-console-18-512.png";
                break;
            }

            case "special-defense":
            {
                image.src = "https://cdn2.iconfinder.com/data/icons/seo-and-marketing-glyph-3/24/18-512.png";
                break;
            }

            // Debug
            default:
            {
                console.error("Couldn't find picture associated with that stat.");
                break;
            }
        }        

        image.classList.toggle("statImage");

        let name = document.createElement("h4");
        name.textContent = pokemonData.stats[i].stat.name;   

        // These are both workarounds for the container becoming taller because the text is too long
        if (name.textContent === "special-attack")
        {
            name.textContent = "spcl-atk";
        }   

        if (name.textContent === "special-defense")
        {
            name.textContent = "spcl-def";
        }

        name.textContent = capitalizeAndRemoveDashes(name.textContent);
        name.classList.toggle("statName");

        let value = document.createElement("p");
        value.textContent = pokemonData.stats[i].base_stat;    
        value.classList.toggle("statValue"); 

        container.appendChild(image);
        container.appendChild(name);
        container.appendChild(value);

        parent.appendChild(container);
    }
}

function removePreviousAbilityData()
{
    let parent = document.getElementById("innerAbilitiesContainer");
    while (parent.firstChild) { parent.removeChild(parent.firstChild); }
}

// Takes JSON data for a single ability and adds it to the page via DOM 
function setAbilityData(abilityData)
{    
    // Todo - Alphabetize the abilities (probably technically best to do this DURING when they're added, but probably much easier)
    // and barely less efficient to do it at the end. Pokemon have a few abilities max so performance difference is probably on the scale
    // of fractions of a millisecond anyway 
    
    // The three pieces of information necessary for current move 
    let title = document.createElement("h3");    
    let description = document.createElement("p");
    let isHidden;   // Just a boolean, not a page element 

    title.textContent = abilityData.name;
    title.textContent = capitalizeAndRemoveDashes(title.textContent);

    description.textContent = abilityData.effect_entries[0].effect;

    // Todo - This is technically a faulty assumption that if it's hidden for the first one it's hidden for every pokemon
    // Probably fixable by passing in the pokemon data too (wouldn't be too complicated) and checking THAT isHidden
    // Also fixable by iterating through the array, looking for the actual pokemon's name, though that requires the pokemon's name 
    isHidden = abilityData.pokemon[0].is_hidden;

    if (isHidden)
    {
        title.textContent = title.textContent + " (Hidden)";
    }

    let parent = document.getElementById("innerAbilitiesContainer");

    let abilityContainer = document.createElement("div");
    abilityContainer.classList.toggle("abilityContainer");

    abilityContainer.appendChild(title);
    abilityContainer.appendChild(description);

    parent.appendChild(abilityContainer);
}

// Todo - Make it so I don't have to pass pokemonData in here b/c it sorta breaks a standard 
async function setEvolutionData(pokemonData, evolutionData)
{
    // Todo - Try and minimize the amount of fresh declarations...
    // I could keep reusing variables but it's a little complicated to make sure class application behaves correctly
    // Adding the lowest evolution level (s)  
    let parent = document.getElementById("evolutionChainInnerContainer");

    // Removing previous evolution chains
    while (parent.firstChild) { parent.removeChild(parent.firstChild) }

    let boxContainer = document.createElement("div");
    boxContainer.classList.toggle("evolutionBox");

    let currentImage = document.createElement("img");
    let currentName = document.createElement("p");

    currentImage.src = await getSprite(evolutionData.chain.species.name);
    currentName.textContent = capitalizeAndRemoveDashes(evolutionData.chain.species.name);

    boxContainer.appendChild(currentImage);
    boxContainer.appendChild(currentName);

    parent.appendChild(boxContainer);    

    // Second Level Evolutions
    if (evolutionData.chain.evolves_to.length > 0)
    {
        // Inserting the horizontal arrow
        let arrow = document.createElement("div");
        arrow.classList.toggle("evolutionArrow");

        let image = document.createElement("img");
        image.src = "http://www.stickpng.com/assets/images/585e4773cb11b227491c3385.png";
        arrow.appendChild(image);

        parent.appendChild(arrow);

        let i = 0; 

        // Each loop represents one pokemon it's going through 
        while (i < evolutionData.chain.evolves_to.length)
        {
            let currentImage = document.createElement("img");
            let currentName = document.createElement("p");

            // JavaScript is wack 
            currentImage.src = await getSprite(evolutionData.chain.evolves_to[i].species.name);
            currentName.textContent = capitalizeAndRemoveDashes(evolutionData.chain.evolves_to[i].species.name);

            let boxContainer = document.createElement("div");
            boxContainer.classList.toggle("evolutionBox");

            boxContainer.appendChild(currentImage);
            boxContainer.appendChild(currentName);

            parent.appendChild(boxContainer);

            i++;
        }
    }    

    // PLEASE WORK TRY B/C THIS IS GOING TO BE LIVING HELL TO DEBUG OTHERWISE 

    // Third Level Evolutions
    // Checking if it's even valid to check for a third    
    if (evolutionData.chain.evolves_to.length > 0)
    {
        // Yes, I know it's possible to do a compound if statement, but this is more readable imo 
        // Checking for a third
        if (evolutionData.chain.evolves_to[0].evolves_to.length > 0)
        {   
            // Inserting the horizontal arrow 
            arrow = document.createElement("div");
            arrow.classList.toggle("evolutionArrow");

            image = document.createElement("img");
            image.src = "http://www.stickpng.com/assets/images/585e4773cb11b227491c3385.png";
            arrow.appendChild(image);

            parent.appendChild(arrow);

            // Same procedure as above except w/ slightly modified indexing scheme 
            let i = 0; 

            // Each loop represents one pokemon it's going through 
            while (i < evolutionData.chain.evolves_to[0].evolves_to.length)
            {
                let currentImage = document.createElement("img");
                let currentName = document.createElement("p");

                // JavaScript is wack 
                // Making the assumption that all second level evolutions will result in the same set of third level evolutions
                currentImage.src = await getSprite(evolutionData.chain.evolves_to[0].evolves_to[i].species.name);
                currentName.textContent = capitalizeAndRemoveDashes(evolutionData.chain.evolves_to[0].evolves_to[i].species.name);

                let boxContainer = document.createElement("div");
                boxContainer.classList.toggle("evolutionBox");

                boxContainer.appendChild(currentImage);
                boxContainer.appendChild(currentName);

                parent.appendChild(boxContainer);

                i++;
            }
        }        
    }
}

// Trying to de-clutter code a bit 
// Returns an alphabetically sorted array of whatever you passed in 
function insertionSortStrings(movesList)
{
    // Alphabetizes the list 
    let endArr = [];

    // Assigning first element
    endArr[0] = movesList[0];

    // Todo - Implement a more efficient sorting algoirithm than insertion sort (which isn't awful but there are better ones available esp. for worst use time implementation)
    // Again, there are never more than like 100ish moves so this won't take excessively long in any case 
    for (let i = 1; i < movesList.length; i++)
    {
        for (let j = 0; j < endArr.length; j++)
        {
            if (movesList[i].toLowerCase() < endArr[j].toLowerCase())
            {
                // Splice syntax for simple insertion: splice(index, 0, item)
                endArr.splice(j, 0, movesList[i]); 
                break;    // Just breaks out of inner loop indicating current element is sorted             
            }
        }        
    }

    return endArr;
}

function capitalizeAndRemoveDashes(str)
{
    // Capitalizing first letter
    str = str.charAt(0).toUpperCase() + str.slice(1, str.length);

    // Iterates through for dashes, and if one is found replace w/ a space and capitalize next letter 
    for (let j = 0; j < str.length; j++)
    {
        if (str.charAt(j) === "-")
        {
            // This will technically run into an indexOutOfBounds error if the second word is one character long but should be fine otherwise 
            str = str.slice(0, j) + " " + str.charAt(j + 1).toUpperCase() + str.slice(j + 2, str.length);
        }
    }

    return str;
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
