import axios from 'axios'

const API_URL = process.env.EXPO_PUBLIC_API_URL

const createAxiosInstance = (token?:string) => {
  const axiosInstance = axios.create({
    baseURL:API_URL!,
    headers: {
      "Content-Type": "application/json",
      ...( token && {"Authorization":`Bearer ${token}`})
    }
  })
  return axiosInstance
} 


export default createAxiosInstance