// Wait until content is loaded (sort of just as a precaution at this point)
document.addEventListener("DOMContentLoaded", function()
{
    getData();
});

function getData()
{
    // Todo - Implement arrow syntax once you get it working this way 
    fetch("https://pokeapi.co/api/v2/pokemon/ditto/")
    .then(function(response)
    {
        return response.json();
    }).then(function(data)
    {
        updatePage(data);
    }).catch(function(err)
    {
        console.log("Failed to fetch data.");
    });
}

function updatePage()
{
    
}