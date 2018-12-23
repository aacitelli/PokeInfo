// Wait until content is loaded (sort of just as a precaution at this point)
document.addEventListener("DOMContentLoaded", function()
{
    getRandomPokemon();
});

function getRandomPokemon()
{
    // Total # of pokemon in database
    let pokemonNum = Math.floor(Math.random() * 802 + 1);

    console.log("JSON File 1 URL: " + "https://pokeapi.co/api/v2/pokemon/" + pokemonNum + "/")
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
    });
}

function updatePage(pokemonData, speciesData)
{
    console.log("Update Page Function: ");
    console.log("Pokemon Data: " + pokemonData);
    console.log("Species Data: " + speciesData);
}
