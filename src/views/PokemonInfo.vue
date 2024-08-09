<template>
    <PokeballSpinner v-if="!showData" class="w-100" />
    <div v-if="showData">
      <Card class="border-danger border w-75 mx-auto my-4 flex-wrap" style="border-width: 5px;">
        <Card id="profile" class="col-6 d-block p-2">
            <div class="d-block w-100">
              <div id="data" class="w-100 mx-auto justify-content-evenly text-center d-flex">
                <h5> {{ pokemon?.name?.toUpperCase() }} </h5>
                <h5> # {{ helpers.formatToFourDigits(pokemon?.id) }} </h5>
              </div>
              <div class="d-flex w-100">
                <div @click="playAudio" :class="`img-container ${pokemonTypeClass} mx-auto bg-white d-flex text-dark`">
                    <img :key="showData" :src="pokemon?.sprites?.other['official-artwork']?.front_default" alt="" srcset="" class="w-100 p-2 mx-auto">
                </div>
                <audio id="cry" :src="pokemon?.cries?.latest"></audio>
              </div>
              <div class="d-flex">
                <div class="d-block col-12">
                  <div class="d-flex text-center justify-content-evenly my-3 col-12">
                    <div v-for="type in pokemon?.types" :class="`rounded-pill text-center px-2 ${pokemonTypeItem(type.type)}`">
                        {{ type.type.name.toString().toUpperCase() }}
                    </div>
                  </div>
                  <div class="d-flex text-center justify-content-evenly my-3 col-12 flex-wrap">
                    <span class="col-6"> <strong>
                      Weight: {{ (pokemon.weight / 10).toFixed(2) }} kg
                    </strong> .</span>
                    <span class="col-6"> <strong>
                      Height: {{ (pokemon.height / 10).toFixed(2) }} mts.
                    </strong> </span>
                    <span class="col-6 mt-3"> <strong>
                      Base hapiness: {{ pokemon?.specie?.base_happiness }}
                    </strong> .</span>
                    <span class="col-6 mt-3"> <strong>
                      Capture rate: {{ pokemon?.specie?.capture_rate }} %
                    </strong> </span>
                  </div>
                </div>
              </div>
            </div>
        </Card>
        <Card class="col-6 p-2">
            <div  id="stats" class="w-100">
                <PolarArea v-if="showData" :data="dataChart" :options="options" />
            </div>
        </Card>
        <Card class="col-12 p-4">
          <div class="d-block col-6">
            <h5 class="w-100 text-center">Abilities:</h5>
            <div class="d-flex w-100 flex-wrap">
              <div 
                v-for="(abilityGroup, idx) in abilitiesFull" 
                :key="idx"
                :id="`carouselExampleControls-${idx}`"
                class="carousel carousel-dark slide col-6" 
                data-bs-ride="carousel"
              >
                <h5 class="w-100 text-center"> <strong class="w-100">{{ helpers.getAbilityName(pokemon?.abilities[idx]?.ability?.name) }}</strong> </h5>
                <div class="carousel-inner mx-auto text-center">
                  <div
                    v-for="(abilityFull, index) in abilityGroup"
                    :key="index"
                    :class="['carousel-item', { active: index === 0 }]"
                  >
                    <div class="d-block w-75 mx-auto">
                      <p>{{ abilityFull ? abilityFull.flavor_text : '' }} <br> {{ abilityFull ? abilityFull?.version_group?.name.split('-').join(' ') : '' }}</p>
                    </div>
                  </div>
                </div>
                <button 
                  class="carousel-control-prev" 
                  type="button" 
                  :data-bs-target="`#carouselExampleControls-${idx}`" 
                  data-bs-slide="prev"
                >
                  <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                  <span class="visually-hidden">Previous</span>
                </button>
                <button 
                  class="carousel-control-next" 
                  type="button" 
                  :data-bs-target="`#carouselExampleControls-${idx}`" 
                  data-bs-slide="next"
                >
                  <span class="carousel-control-next-icon" aria-hidden="true"></span>
                  <span class="visually-hidden">Next</span>
                </button>
              </div>
            </div>
          </div>
          <div class="d-block col-6">
            <h5 class="w-100 text-center">Evolution chain:</h5>
            <div class="d-flex justify-content-evenly">
              <div class="d-block" v-for="chain in pokemon?.specie?.evolution_chain?.data">
                <div @click="changeView(chain.id)" :class="`img-container ${pokemonTypeClass} mx-auto bg-white d-flex text-dark`" style="cursor: pointer;">
                      <img @click="changeView(chain.id)" :key="showData" :alt="chain.name" :src="chain?.sprites?.front_default" alt="" srcset="" class="w-100 p-2 mx-auto">
                  </div>
                  <h5 class="text-center w-100 mt-2"> {{ chain.name }} </h5>
              </div>
            </div>
          </div>
        </Card>
        </Card>
        <div style="cursor: pointer;" @click="router.push('/')" class="m-5 bg-danger mx-auto d-flex w-20 pt-2 rounded-pill text-white">
          <p class="mx-auto">
            <FontAwesomeIcon class=" px-1 " :icon="faArrowRotateLeft" />
            <strong class="ms-2">  Return to Pokedex</strong>
          </p>
        </div>
    </div>
</template>
<script setup>
import { ref , nextTick,onMounted} from 'vue';
import { useRouter } from 'vue-router';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faArrowRotateLeft } from '@fortawesome/free-solid-svg-icons';
import helpers from '@/composables/helpers';
import Card from '@/components/Card.vue';
import PokeballSpinner from '@/components/PokeballSpinner.vue';
import {
  Chart as ChartJS,
  RadialLinearScale,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js'
import { PolarArea } from 'vue-chartjs'
ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend)
const props = defineProps({
    id:{
        type:Number,
        required:true
    }
})
const router = useRouter()
const pokemon = ref([]);
const abilitiesFull = ref([])
const pokemonTypeClass = ref("")
const showData = ref(false)
const options = ref(null)
const dataChart = ref(null)
onMounted( async() => {

  showData.value = false
  const {data,abilitiesComplete} = await helpers.getAllDetailsFromPokemon(props.id)
  console.log(data, abilitiesComplete)
  abilitiesFull.value = abilitiesComplete
  pokemon.value = data
  const chartData = helpers.getDataForPolarChart(pokemon.value)
  dataChart.value = chartData
  options.value = helpers.optionsChart
  nextTick(() => {
    const carousels = document.querySelectorAll('.carousel');
    carousels.forEach(carousel => {
      new bootstrap.Carousel(carousel, {
        interval: 2000,
        ride: 'carousel'
      });
    });
  });
  updatePokemonTypeClass()
  setTimeout(() => {
    showData.value = true
  }, 2000);
})
const updatePokemonTypeClass = () => {
  if (pokemon.value && pokemon.value && pokemon.value.types && pokemon.value.types[0] && pokemon.value.types[0].type) {
    const typeName = pokemon.value.types[0].type.name.toLowerCase();
    pokemonTypeClass.value = `pokemon-type-${typeName}`;
  } else {
    pokemonTypeClass.value = '';
  }
};
const pokemonTypeItem = (item) => {
    const typeName = item.name.toLowerCase();
    return `pokemon-type-${typeName}`;

};
const playAudio = () => {
  const myAudio = document.getElementById("cry");
  myAudio.play();

}
const changeView = (id) => {
  router.push(`/pokemon/${id}`)
  router.go(0)
}
</script>
<style lang="scss">

.img-container{
    border-radius: 50%;
    height: 20s0px;
    width: 200px;
}
</style>