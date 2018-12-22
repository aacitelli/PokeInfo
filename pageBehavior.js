// Wait until content is loaded (sort of just as a precaution at this point)
document.addEventListener("DOMContentLoaded", function()
{
    getData();
});

function getData()
{
    // Original range is [0, 802) -> [0, 801] (b/c of floor) so we add 1 to get to [1, 802]
    let pokemonNum = Math.floor(Math.random() * 802 + 1);

    fetch("https://pokeapi.co/api/v2/pokemon/" + pokemonNum + "/")
    .then(function(response)
    {
        return response.json();
    }).then(function(data)
    {
        console.log(data);
        updatePage(data);
    }).catch(function(err)
    {
        console.log("Failed to fetch data.");
    });
}

function updatePage()
{

}
