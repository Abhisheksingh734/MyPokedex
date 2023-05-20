import inquirer from "inquirer";
import { parseOptions } from "./savingFile.js";


const promptForPokemon = async () => {
  const question = {
    type: "input",
    name: "pokemon_name",
    message: "Pokemon name: ",
  };
  return await inquirer.prompt(question);
};

//checkbox

const promptForDownloadInfo = async () => {
  return await inquirer.prompt({
    type: "checkbox",
    name: "Options",
    message: "Pokemon info to download",
    choices: [
      new inquirer.Separator("---Options---"),
      {
        name: "Status",
      },
      {
        name: "Sprites",
      },
      {
        name: "Artwork",
      },
    ],
  });
};


//continue

const promptToContinue = async ()=>{
    return await inquirer.prompt({
        type:"list",
        message:"Would you like to search for another pokemon?",
        name: 'continue',
        choices: ["Yes","No"],
    });
};



// const fetchPokemon = async (pokemonName)=>{
//   try{
//     const url = `https://pokeapi.co/api/v2/pokemon/${pokemonName}`;
//     const response = await fetch(url);
//     const json = await response.json();
//     return json;

//   }catch{

//   }
// };

const fetchPokemon = async (pokemonName) => {
  try {
    const url = `https://pokeapi.co/api/v2/pokemon/${pokemonName}`;
    const response = await fetch(url);
    if (response.ok) {
      const json = await response.json();
      return json;
    } else {
      console.log("Error: Pokemon not found.");
      return null;
    }
  } catch (error) {
    console.log("Error: Failed to fetch Pokemon data.");
    return null;
  }
};


// const promptUser = async ()=>{
//     while(true){
//         const pokemonName =await promptForPokemon();
//         //fetching pokemon JSON

//         const pokemonJSON = await fetchPokemon(pokemonName.pokemon_name);
//         const pokemonOptions = await promptForDownloadInfo();

//         // Jo options hai uske according get data from pokemonJSON
//         // and save in local disk
//         await parseOptions(pokemonJSON,pokemonOptions);   //pokemonOptions from inquirer //pokemonJSON from API

//         const keepGoing = await promptToContinue();
//         if(keepGoing.continue ==="No") break;
//     }
// }

const promptUser = async () => {
  while (true) {
    const pokemonName =await promptForPokemon();
    const pokemonJSON= await fetchPokemon(pokemonName.pokemon_name);

    if (pokemonJSON !==null) {
      const pokemonOptions = await promptForDownloadInfo();
      await parseOptions(pokemonJSON, pokemonOptions);

      const keepGoing = await promptToContinue();
      if (keepGoing.continue === "No") break;
    }
  }
};




export {promptUser};