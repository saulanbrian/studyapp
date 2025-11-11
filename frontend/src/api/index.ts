import axios, { CreateAxiosDefaults } from "axios"
import { ENV } from "../constants/Env"

export default function createAxiosInstance({
  token,
}: { token?: string | null }) {

  return axios.create({
    baseURL: ENV.apiUrl,
    headers: {
      "Content-Type": "application/json",
      ...(token ? {
        Authorization: `Bearer ${token}`
      } : {}),
    }
  })

}

