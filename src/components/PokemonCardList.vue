<template>
  <div @click="redirect" :class="`rounded-card mx-auto text-center ${pokemonTypeClass} bg-white text-dark`">
        <img :src="props.pokemon?.details?.sprites?.other['official-artwork']?.front_default" alt="" srcset="" class="w-50 img-1">
        <img :src="props.pokemon?.details?.sprites?.other['official-artwork']?.front_shiny" alt="" srcset="" class="w-50 img-2">
        <h5> {{ props.pokemon.name.toUpperCase() }} </h5>
        <h6> # {{ helpers.formatToFourDigits(props.pokemon?.details?.id) }} </h6>
        <div class="cont-types  d-flex text-center justify-content-evenly">
            <div v-for="type in props.pokemon?.details?.types" :class="`rounded-card mx-auto text-center px-2 my-2 ${pokemonTypeItem(type.type)}`">
                {{ type.type.name.toString().toUpperCase() }}
            </div>
        </div>
    </div>
</template>
<script setup>
import { computed,toRefs,ref,onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import helpers from "@/composables/helpers.js"

const router = useRouter()
const props = defineProps({
    pokemon:{
        type:Object,
        required:true,
    }
})
const { pokemon } = toRefs(props);
const pokemonTypeClass = ref('');

const updatePokemonTypeClass = () => {
  if (pokemon.value && pokemon.value.details && pokemon.value.details.types && pokemon.value.details.types[0] && pokemon.value.details.types[0].type) {
    const typeName = pokemon.value.details.types[0].type.name.toLowerCase();
    pokemonTypeClass.value = `pokemon-type-${typeName}`;
  } else {
    pokemonTypeClass.value = '';
  }
};

const redirect = () => {
  router.push("/pokemon/"+props.pokemon.details.id)
}

updatePokemonTypeClass();

let intervalId = null;

const checkPokemonDetails = () => {
  if (props.pokemon.details !== undefined) {
    updatePokemonTypeClass();
    clearInterval(intervalId); // Detiene el intervalo una vez que details esté cargado
  }
};

const pokemonTypeItem = (item) => {
    const typeName = item.name.toLowerCase();
    return `pokemon-type-${typeName}`;

};

onMounted(() => {
  intervalId = setInterval(checkPokemonDetails, 100);
});

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId);
  }
});

</script>
<style scoped lang="scss">
.rounded-card {
  border-radius: 1em;
  .img-2{
    display: none;
  }
}
.rounded-card:hover{
  cursor: pointer;
  .img-1{
    display: none;
  }
  .img-2{
    display: flex;
    margin: 0 auto;
  }

}
</style>
