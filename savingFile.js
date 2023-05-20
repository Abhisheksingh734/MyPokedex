import fs from "fs/promises"
import path from "path";

// console.log(path.sep);//  "\" 

// fs.mkdir("./test");

const saveImgFile = async(filePath,toStore)=>{
     await fs.writeFile(filePath,toStore);
}

const createFolder = async (folderName)=>{
    const folderPath = path.join(process.cwd(),folderName);
    try{
        await fs.access(folderPath);
    }catch{
        fs.mkdir(folderPath);
    };
    
}



const savePokemonStats = async (folderName,pokemonStatsObjes)=>{
    let statString = `----- Your Pokemon Stats -----\n`;
    for (const stat of pokemonStatsObjes){
        statString += `${stat.stat.name}: ${stat.base_stat}\n`
    }

    //creating a folder to store stats
    await createFolder(folderName); 
    const filePath = path.join(process.cwd(),folderName,"stats.txt");
    await fs.writeFile(filePath,statString);
};


const savePokemonArtwork = async (folderName,pokemonSpriteObj)=>{

    const url = pokemonSpriteObj.other["official-artwork"].front_default;
    const response = await fetch(url);   //fetching image

    const arrayBuffer = await response.arrayBuffer();  
    const buffer = Buffer.from(arrayBuffer);  // creating buffer to store image

    //
    await createFolder(folderName);
    const filePath = path.join(process.cwd(),folderName,"artWork.png");
    await saveImgFile(filePath,buffer);
    
};


const savePokemonSprites = async(folderName,pokemonSpritesObject)=>{
    let spritePromises = [];
    let spriteNames = [];

    for(const [name,url] of Object.entries(pokemonSpritesObject)){
        if(!url) continue;
        if(name==="other" || name ==="versions") continue;

        spritePromises.push(fetch(url).then((res)=> res.arrayBuffer()))
        spriteNames.push(name);
    };
    spritePromises = await Promise.all(spritePromises);
    await createFolder(folderName);

    for(let i =0;i<spritePromises.length;i++){
        const filePath = path.join(process.cwd(),folderName,`${spriteNames[i]}.png`);

        await saveImgFile(filePath,spriteNames[i]);
        console.log(filePath);
    };
};


const parseOptions = async(pokemonObj,optionObject)=>{
    const options = optionObject.Options;
    const pokemonName =pokemonObj.name

    if(options.includes("Status")){
        await savePokemonStats(pokemonName,pokemonObj.stats);
    }
    if(options.includes("Sprites")){
        await savePokemonSprites(pokemonName,pokemonObj.sprites);
    }
    if(options.includes("Artwork")){
        await savePokemonArtwork(pokemonName,pokemonObj.sprites);
    }
};




export {parseOptions}