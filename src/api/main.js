import axios from "axios";
import { useRouter } from "vue-router";
const router = useRouter()
const baseUrl = 'https://pokeapi.co/api/v2/'
const getPaginatedPokemon =  async (offset,limit) => {
    try{
        const resp = await axios.get(baseUrl + 'pokemon/?offset='+offset+'&limit='+limit)
        return resp;
    }catch(error){
        console.log(Object.entries(error));
        return null;
    }
}
const getDetailedPokemon = async (search) => {
    try{
        const resp = await axios.get(baseUrl + 'pokemon/'+search)
        return resp;
    }catch(error){
        return {data:null};
    }
}
const getUrl = async (url) =>{
    try{
        const resp = await axios.get(url)
        return resp;
    }catch(error){
        return null;
    }
}
export default {
    getPaginatedPokemon,
    getDetailedPokemon,
    getUrl
}