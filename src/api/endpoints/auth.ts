import { AxiosInstance } from "axios"

type ReturnType = string

export const auth = (fetcher: AxiosInstance) =>
   async (username: string) => {
      const url = "/auth/username"
      const body = { username }
      return (await fetcher.post<ReturnType>(url, body)).data
   }
