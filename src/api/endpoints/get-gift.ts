import { AxiosInstance } from "axios"

type ReturnType = {
   status: boolean
   message?: string
   start_balance?: number
   end_balance?: number
}

export const getGift = (fetcher: AxiosInstance) =>
   async (gift: string) => {
      const url = `/cart/getGift`
      const body = { gift }
      return (await fetcher.post<ReturnType>(url, body)).data
   }
