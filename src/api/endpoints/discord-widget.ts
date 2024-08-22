import { AxiosInstance } from "axios"

type ReturnType = {
   presence_count: number
}

export const discordWidget = (fetcher: AxiosInstance) =>
   async (discordId: string) => {
      const url = `https://discordapp.com/api/guilds/${discordId}/widget.json`
      return (await fetcher.get<ReturnType>(url)).data
   }
