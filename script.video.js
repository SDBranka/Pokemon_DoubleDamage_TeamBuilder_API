$('form').on('submit', function(e) {
    e.preventDefault();

    var types = $('input[type=text]').val().replace(' ', '');
    types = types.split(',');
    // types = types.split(',');

    // console.log(types);

    // the map function returns an array of the pokemon types entered
    var trainerTypes = types.map(function(type) {
        
        
        console.log(type);
        // $.ajax returns a special deferred object
        return $.ajax({
            url: 'http://pokeapi.co/api/v2/type/' + type + '/',
        });

    });
    console.log(trainerTypes);

    // $.when is a special jQuery function that waits for all the AJAX requests to finish
    // $.apply is a method that we can use that will allow us
    // to call $.when
    // takes two arguments, the context we want the value to be inside the call and an array-like object of AJAX requests 
    $.when.apply(null, trainerTypes)
        // .then will pass the data from the AJAX requests to the function
        .then(function(){
            // console.log(arguments);
            // we have to convert this to an actual array
            // .slice is a method that will take the arguments and turn it into an array
            // .call is a method that will take a comma separated list
            var pokemonTypes = Array.prototype.slice.call(arguments);
            // console.log(pokemonTypes);
            getDoubleDmgTypes(pokemonTypes);
        });
});

// function gets the types of pokemon that will cause double damage to the selected pokemon typs
function getDoubleDmgTypes(pokemonTypes) {
    pokemonTypes = pokemonTypes.map(function(types) {
        // console.log(types);
        return types[0].damage_relations.double_damage_from;
    });
    pokemonTypes = flatten(pokemonTypes);
    // console.log(pokemonTypes);

    var damageTypes = pokemonTypes.map(function(type) {
        return $.ajax({
            url: type.url,
            dataType: 'json',
            method: 'GET'
        });
    });

    // console.log(damageTypes);

    $.when.apply(null, damageTypes)
        .then(function() {
            var pokemon = Array.prototype.slice.call(arguments);
            buildTeam(pokemon);
        });

}

function buildTeam(pokemon) {
    // builds a series of arrays that contain the pokemon that do double damage to the selected pokemon
    pokemon = pokemon.map(function(poke){
        return poke[0].pokemon;
    });

    // cleans the array built above
    pokemon = flatten(pokemon);
    // console.log(pokemon);

    var team = [];
    // selects six pokemon from the array built above
    for (var i = 0; i < 6; i++) {
        team.push(getRandomPokemon(pokemon));
    }
    // console.log(team);

    // builds an array with all the calls in it
    team = team.map(function(pokemon) {
        return $.ajax({
            url: pokemon.pokemon.url,
            dataType: 'json',
            method: 'GET'
        });
    });
    // console.log(team);

    $.when.apply(null, team)
        .then(function() {
            var pokemonTeam = Array.prototype.slice.call(arguments);
            // console.log(pokemonTeam);
            pokemonTeam = pokemonTeam.map(function(poke) {
                return poke[0];
            });

            // console.log(pokemonTeam);
            displayPokemon(pokemonTeam);
        });
}

// displays the pokemonTeam
function displayPokemon(pokemon) {
    // for each pokemon on the team this takes the id and displays the pokemon's image and name
    pokemon.forEach(function(poke) {
        var $container = $('<div>').addClass('pokemon');
            
        var $image = $('<img>').attr('src', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/' + poke.id + '.png');

        var $title = $('<h2>').text(poke.name);
        $container.append($image, $title);
        $('.poke-container').append($container);

    });
}


// rundomly selects pokemon from the collected group that does double damage
function getRandomPokemon(pokemonArray){
    var index = Math.floor(Math.random() * pokemonArray.length);
    return pokemonArray[index];
}


function flatten(arrayToFlatten) {
    return arrayToFlatten.reduce(function(a, b) {
        return a.concat(b);
    }, []);
}




