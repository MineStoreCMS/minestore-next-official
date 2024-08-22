import axios from "axios"
import { cookies } from "next/headers"
import { config } from "../config"

export const fetcher = axios.create(config)

fetcher.interceptors.request.use((request) => {
   request.headers.Authorization = `Bearer ${cookies().get("token")?.value}`
   return request
})
