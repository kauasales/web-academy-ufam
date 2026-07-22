import axios from "axios";

export const productsApi = axios.create({
    baseURL: 'https://ranekapi.origamid.dev/json/api'
})