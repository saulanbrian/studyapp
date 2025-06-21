import axios from 'axios'

import { ENV } from '@/constants/Env'

const createAxiosInstance = (token?: string) => {
  const axiosInstance = axios.create({
    baseURL: ENV.API_URL,
    headers: {
      "Content-Type": "application/json",
      ...(token && { "Authorization": `Bearer ${token}` })
    }
  })
  return axiosInstance
}


export default createAxiosInstance
