<script setup>
import PokemonList from "../components/PokemonList.vue"
import { useRouter } from "vue-router";
import { ref } from "vue";
const router = useRouter()
const search = ref("")
const getDetailedInfo = () => {
  console.log(router)
  router.push("/pokemon/"+search.value)
}
</script>

<template>
  <header class="d-flex my-2">
    <input type="text" class="rounded shadow border-danger w-75 mx-auto" v-model="search" @blur="getDetailedInfo" placeholder="Use advanced search">
  </header>
  <main id="pokemon-list-container">
      <PokemonList/>
  </main>
</template>
