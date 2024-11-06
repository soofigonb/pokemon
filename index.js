import { readFile } from 'fs/promises';
import axios from "axios";

async function pokemonAleatorio() {
    try {
        // Leer el archivo de Pokémon usando Promesas
        const data = await readFile('pokemon.txt', 'utf-8');
        const pokemonList = JSON.parse(data);
        const randomPokemon = pokemonList[Math.floor(Math.random() * pokemonList.length)];
        console.log(`Pokémon seleccionado aleatoriamente: ${randomPokemon}`);

        // Hacer una solicitud a la PokeAPI
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${randomPokemon}`);
        const pokemonData = response.data;

        // Extraer y mostrar datos relevantes del Pokémon
        const pokemonInfo = {
            name: pokemonData.name,
            abilities: pokemonData.abilities.map(ability => ability.ability.name),
            base_experience: pokemonData.base_experience,
            height: pokemonData.height,
            weight: pokemonData.weight,
            types: pokemonData.types.map(type => type.type.name),
            stats: pokemonData.stats.map(stat => ({
                name: stat.stat.name,
                base_stat: stat.base_stat
            })),
            sprite: pokemonData.sprites.front_default
        };

        console.log('Datos del Pokémon:', pokemonInfo);

    } catch (error) {
        console.error('Error:', error);
    }
}

pokemonAleatorio();


//Ejercicio 2:

const loadApiUrls = async () => {
    try {
      const data = await readFile('urls.json', 'utf-8');
      return JSON.parse(data); // Convierte el JSON en objeto
    } catch (error) {
      console.error("Error al leer el archivo de URLs:", error.message);
      return {}; 
    }
  };
  
  // Función para esperar un tiempo antes de continuar (retardo entre solicitudes)
  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  
  // Función para hacer las solicitudes de manera secuencial
  const fetchApis = async (apiUrls) => {
    for (const key in apiUrls) {
      try {
        const url = apiUrls[key];
        const response = await axios.get(url);
        console.log(`Respuesta de ${key}:`);
        console.log(response.data);
        
        
        await sleep(2000);
      } catch (error) {
        if (error.response && error.response.status === 429) {
          console.error(`Error 429 al hacer la solicitud a ${key}: Límite de solicitudes alcanzado. Esperando...`);
          
          // Esperar 5 segundos antes de reintentar
          await sleep(5000);
          try {
            const response = await axios.get(apiUrls[key]);
            console.log(`Reintento exitoso para ${key}:`);
            console.log(response.data);
          } catch (retryError) {
            console.error(`No se pudo recuperar la solicitud para ${key}:`, retryError.message);
          }
        } else {
          console.error(`Error al hacer la solicitud a ${key}:`, error.message);
        }
      }
    }
  };
  
  // Leer las URLs desde el archivo y hacer las solicitudes
  const run = async () => {
    const apiUrls = await loadApiUrls(); // Carga las URLs desde el archivo
    if (Object.keys(apiUrls).length > 0) {
      fetchApis(apiUrls); 
    }
  };
  
  run();