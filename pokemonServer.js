const http = require('http');
const fs = require('fs');


const fetchPokemonData = () => {
    console.log('Fetching Pokemon Data')
    return new Promise((resolve, reject) => {
        fs.readFile('pokemon.json', 'utf-8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(JSON.parse(data));
            }
        });
    });
};

const handleRequest = async (req, res) => {
    let pokemonID = decodeURI(req.url.substring(1));

    const pokemonsData = await fetchPokemonData();

    if (!isNaN(pokemonID)) {
        pokemonID = parseInt(pokemonID);
        pokemonData = pokemonsData.find(pokemon => pokemon.id === pokemonID);
    } else {

        pokemonData = pokemonsData.find(pokemon => pokemon.name.english.toLowerCase() === pokemonID.toLowerCase());

        if (!pokemonData) {
            pokemonData = pokemonsData.find(pokemon => pokemon.name.japanese.toLowerCase() === pokemonID.toLowerCase());
        }
        if (!pokemonData) {
            pokemonData = pokemonsData.find(pokemon => pokemon.name.chinese.toLowerCase() === pokemonID.toLowerCase());
        }
        if (!pokemonData) {
            pokemonData = pokemonsData.find(pokemon => pokemon.name.french.toLowerCase() === pokemonID.toLowerCase());
        }
    }

    if (pokemonData) {
        const response = {
            'Tipo': pokemonData.type,
            'HP': pokemonData.base.HP,
            'Attack': pokemonData.base.Attack,
            'Defense': pokemonData.base.Defense,
            'Sp. Attack': pokemonData.base['Sp. Attack'],
            'Sp. Defense': pokemonData.base['Sp. Defense'],
            'Speed': pokemonData.base.Speed,
        };
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(response, null, 2));
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('No se encontro ningún pokemon con ese nombre o ID');
    }
};

const server = http.createServer(handleRequest);

server.listen(3000, () => {
    console.log('El servidor esta escuchando en el puerto 3000');
});