import main from "@/api/main";
const formatToFourDigits = (number) => {
    number = parseInt(number)
    return number.toLocaleString('en-US', {
      minimumIntegerDigits: 4,
      useGrouping: false
    });
  }
const colorMapping = {
  HP: 'rgba(255, 99, 132, 0.2)', // Red
  ATTACK: 'rgba(54, 162, 235, 0.2)', // Blue
  DEFENSE: 'rgba(255, 206, 86, 0.2)', // Yellow
  'SPECIAL-ATTACK': 'rgba(75, 192, 192, 0.2)', // Green
  'SPECIAL-DEFENSE': 'rgba(153, 102, 255, 0.2)', // Purple
  SPEED: 'rgba(255, 159, 64, 0.2)', // Orange
  DEFAULT: 'rgba(201, 203, 207, 0.2)' // Gray for other stats or as default
};

const getDataForPolarChart = (pokemon) => {
  
  const backgroundColors = pokemon.stats.map(stat => {
    const label = stat.stat.name.toString().toUpperCase();
    return colorMapping[label] || colorMapping.DEFAULT;
  });

  const pointBackgroundColors = pokemon.stats.map(stat => {
    const label = stat.stat.name.toString().toUpperCase();
    return colorMapping[label].replace('0.2', '1') || colorMapping.DEFAULT.replace('0.2', '1');
  });
  return {
    labels: pokemon.stats.map(stat => stat.stat.name.toString().toUpperCase()),
    datasets: [
      {
        label: 'Stats',
        backgroundColor: backgroundColors,
        pointBackgroundColor: pointBackgroundColors,
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: pointBackgroundColors,
        data: pokemon.stats.map(stat => stat.base_stat)
      }
    ]
  }
}
const optionsChart = {
  responsive: true,
  maintainAspectRatio: false
}
const getAbilityName = (ability)=> {
  var newName = ""
  if(ability.toString().includes("-")){
    newName = ability.split("-").join(" ")
  }else{
    newName = ability
  }
  newName = newName.charAt(0).toUpperCase() + newName.slice(1);
  return newName
}
const getEvolutionChainFull = async (chain) => {
  var cont = 0
  var evolutionComplete = {}
  var data_evolve = []
  if(chain.species){
    var name = chain.species.name
    name = name.charAt(0).toUpperCase() + name.slice(1);
    data_evolve.push({name})
    const response = await main.getDetailedPokemon(chain.species.name)
    data_evolve[cont].id = response.data.id
    data_evolve[cont].sprites = response.data.sprites
    cont ++
  }
  if(chain.evolves_to[0]?.species){
    var name = chain.evolves_to[0].species.name
    name = name.charAt(0).toUpperCase() + name.slice(1);
    data_evolve.push({name,details:chain.evolves_to[0].evolution_details[0]})
    const response = await main.getDetailedPokemon(chain.evolves_to[0].species.name)
    data_evolve[cont].id = response.data.id
    data_evolve[cont].sprites = response.data.sprites
    cont ++
  }
  if(chain.evolves_to[0]?.evolves_to[0]?.species){
    var name = chain.evolves_to[0].evolves_to[0].species.name
    name = name.charAt(0).toUpperCase() + name.slice(1);
    data_evolve.push({name,details:chain.evolves_to[0].evolves_to[0].evolution_details[0]})
    const response = await main.getDetailedPokemon(chain.evolves_to[0].evolves_to[0].species.name)
    data_evolve[cont].id = response.data.id
    data_evolve[cont].sprites = response.data.sprites
    cont ++
  }
  evolutionComplete.count = cont
  evolutionComplete.data = data_evolve
  return evolutionComplete

}
const getAllDetailsFromPokemon = async(id) => {
  var abilitiesComplete = []
  const {data} = await main.getDetailedPokemon(id)
  data.abilities.map(async ability=> {
    const link = ability.ability.url
    const response = await main.getUrl(link)
    const filteredTexts = response.data.flavor_text_entries.filter(text => text.language.name === "en");
    var uniqueFlavors = {};

    filteredTexts.forEach(item => {
      const { flavor_text, version_group: { name } } = item;
      if (!uniqueFlavors[flavor_text]) {
        uniqueFlavors[flavor_text] = { ...item, version_group_names: [name] };
      } else {
        uniqueFlavors[flavor_text].version_group_names.push(name);
      }
    });

    const mergedFlavors = Object.values(uniqueFlavors).map(item => {
      item.version_group = { name: item.version_group_names.join(', '), url: item.version_group.url };
      delete item.version_group_names;
      return item;
    });

    ability.ability = response.data
    ability.ability.flavor_text_entries = mergedFlavors
    abilitiesComplete.push(mergedFlavors)
  })
  var specie =  await main.getUrl(data.species.url)
  specie = specie.data
  var evolution_chain = await main.getUrl(specie.evolution_chain.url)
  evolution_chain = evolution_chain.data
  const chainFull = await getEvolutionChainFull(evolution_chain.chain)
  specie.evolution_chain = chainFull
  data.specie = specie
  return {data , abilitiesComplete}
}
export default {
    formatToFourDigits,
    getDataForPolarChart,
    optionsChart,
    getAbilityName,
    getEvolutionChainFull,
    getAllDetailsFromPokemon
}