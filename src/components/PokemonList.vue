<template>
    <PokeballSpinner v-if="!showCards" class="w-100" />
    <div @scroll="handleDebouncedScroll" v-if="showCards" class="d-flex flex-wrap w-100 justify-content-evenly">
        <div v-for="pokemon in list_all" :key="showCards" class="col-lg-2 col-sm-6 my-2" > 
            <PokemonCardList :pokemon="pokemon" :key="pokemon"/>
        </div>
    </div>
</template>
<script setup> 
import {ref, onMounted, onUnmounted} from "vue";
import PokemonCardList from "@/components/PokemonCardList.vue"
import PokeballSpinner from '@/components/PokeballSpinner.vue';
import mainApi from '@/api/main.js'
const offset = ref(0)
const limit = ref(18)
const list_all = ref([])
const showCards = ref(false)
const isScrolled = ref(false)
onMounted(async () => {
    await getInitialInfo()
    window.addEventListener('scroll', handleDebouncedScroll);
})
onUnmounted(()=>{
    window.removeEventListener('scroll', handleDebouncedScroll);
})
const getInitialInfo = async () => {
    const {data,status} = await mainApi.getPaginatedPokemon(offset.value,limit.value)
    const {results} = data;
    var auxiiar = []
    !isScrolled.value ? list_all.value = results : auxiiar = results
    data.results.map(async (result, index)  =>  {
        const detailed_pokemon = await mainApi.getDetailedPokemon(result.name)
        var data_pokemon = detailed_pokemon.data
        !isScrolled.value ? list_all.value[index].details = data_pokemon : auxiiar[index].details = data_pokemon
    })
    if(isScrolled)
        list_all.value = list_all.value.concat(auxiiar)
    showCards.value = true
}
const handleDebouncedScroll = async () => {
    const scrollPosition = window.scrollY + window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    if (scrollPosition + 1 >= documentHeight) {
        offset.value = offset.value + limit.value
        isScrolled.value = true
        if(offset.value <= 10277)
            await getInitialInfo()

    }
}

</script>