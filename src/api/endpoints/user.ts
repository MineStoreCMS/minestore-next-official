import { AxiosInstance } from "axios"
import { TUser } from "@/types/user"

type ReturnType = TUser

export const getUser = (fetcher: AxiosInstance) =>
   async () => {
      const url = "/user"
      return (await fetcher.post<ReturnType>(url)).data
   }
