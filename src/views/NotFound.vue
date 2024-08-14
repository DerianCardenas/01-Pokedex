<template>
    <div class="mx-auto mt-5 d-block col-6 col-sm-12 p-5">
        <h3 class="text-center text-white w-100">It looks like we don't have what you were looking for </h3>
        <img src="https://pbs.twimg.com/tweet_video_thumb/FCplXBuXIAIPMh8.jpg" alt="" class="w-100 mx-aito">
        <div style="cursor: pointer;" @click="router.push('/')" class="m-5 col-sm-12 bg-danger mx-auto d-flex w-20 pt-2 rounded-pill text-white">
          <p class="mx-auto">
            <FontAwesomeIcon class=" px-1 " :icon="faArrowRotateLeft" />
            <strong class="ms-2">  Return to Pokedex</strong>
          </p>
        </div>
    </div>
</template>
<script setup>

import { useRouter } from 'vue-router';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faArrowRotateLeft } from '@fortawesome/free-solid-svg-icons';
const router = useRouter()
</script>