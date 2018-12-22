// Wait until content is loaded (sort of just as a precaution at this point)
document.addEventListener("DOMContentLoaded", function()
{
    getRandomPokemon();
});

function getRandomPokemon()
{
    // Original range is [0, 802) -> [0, 801] (b/c of floor) so we add 1 to get to [1, 802]
    let pokemonNum = Math.floor(Math.random() * 802 + 1);

    let pokemonData; // Holds the 
    let speciesData;

    // Getting the pokemon data 
    fetch("https://pokeapi.co/api/v2/pokemon/" + pokemonNum + "/")
    
    // After the data is fetched, this returns the HTTP response
    .then(function(response)
    {
        console.log("Got Pokemon Response.");
        return response.json();
    })
    
    // If the first data was obtained successfully
    .then(function(pokemonData)
    {
        /* Chaining another set of data on b/c the first was successful and we 
            need the first set to get the url for the second set programmatically */
        console.log("Got Data 1.");

        // Gets the species data - THis just chains b/c the original was successful
        fetch(pokemonData.species.url).then(function(response)
        {
            console.log("Got Species Response.")
            return response.json();
        })
        
        .then(function(data)
        {
            console.log("Got species Data.");
            speciesData = data;

            // Both of these objects are full of data, so can be passed
            updatePage(pokemonData, speciesData);
        })
        
        .catch(function(err)
        {
            console.log("Failed to fetch species data.");
        });
    })
    
    // If there was an error with getting the first set of data 
    .catch(function(err)
    {
        console.log("Failed to fetch pokemon data.");
    });
}

function updatePage(pokemonData, speciesData)
{

}
