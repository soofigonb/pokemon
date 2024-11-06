import { readFile } from 'fs/promises';
import axios from "axios";
import pokemonList from './src/pokemon/pokemon.js';
import api from './src/api/api.js';

async function pokemonAleatorio() {
  try {
    // Seleccionar un Pokémon aleatorio
    const randomPokemon = pokemonList[Math.floor(Math.random() * pokemonList.length)];
    console.log(`Pokémon seleccionado aleatoriamente: ${randomPokemon}`);

    // Hacer una solicitud a la PokeAPI
    const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${randomPokemon}`);
    const pokemonData = response.data;

    // Destructuring para extraer los datos relevantes
    const { name, abilities, base_experience, height, weight, types, stats, sprites } = pokemonData;
    const { front_default: sprite } = sprites;

    // Acceder a las habilidades y tipos correctamente
    const abilitiesList = abilities.map(ability => ability.ability.name).join(', ');
    const typesList = types.map(type => type.type.name).join(', ');

    // Crear un mensaje descriptivo usando template literals
    const pokemonDescription = `
      El Pokémon seleccionado es: ${name.charAt(0).toUpperCase() + name.slice(1)}.
      Este Pokémon tiene las siguientes habilidades: ${abilitiesList}.
      Su experiencia base es de ${base_experience} puntos.
      Mide ${height / 10} metros y pesa ${weight / 10} kilogramos.
      Su tipo es: ${typesList}.
      Sus estadísticas son:
      - Vida: ${stats.find(stat => stat.stat.name === 'hp').base_stat}
      - Ataque: ${stats.find(stat => stat.stat.name === 'attack').base_stat}
      - Defensa: ${stats.find(stat => stat.stat.name === 'defense').base_stat}
      - Ataque Especial: ${stats.find(stat => stat.stat.name === 'special-attack').base_stat}
      - Defensa Especial: ${stats.find(stat => stat.stat.name === 'special-defense').base_stat}
      - Velocidad: ${stats.find(stat => stat.stat.name === 'speed').base_stat}
      Y su imagen es: ${sprite}
    `;

    
    console.log(pokemonDescription);

  } catch (error) {
    console.error('Error:', error);
  }
}

pokemonAleatorio();


