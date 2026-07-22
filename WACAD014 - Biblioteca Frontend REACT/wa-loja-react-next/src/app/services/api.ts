import axios from "axios";

export const productsApi = axios.create({
    baseURL: 'https://ranekapi.origamid.dev/json/api'
})

export const getProducts = async () => {
    const response = await productsApi.get('/produto');
    console.log(response.data)
    return response.data;
}