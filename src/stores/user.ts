import { TUser } from "@/types/user";
import { create } from "zustand";

type UserStore = {
   user?: TUser
   setUser(user?: TUser): void
   loading: boolean
   setLoading(loading: boolean): void
}

export const useUserStore = create<UserStore>((set) => ({
   user: undefined,
   setUser: (user) => set({ user }),
   loading: true,
   setLoading: (loading: boolean) => set({ loading })
}))
