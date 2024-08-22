import { FC } from "react"
import { ReactSVG } from "react-svg"
import { joinClasses } from "@helpers/join-classes"

type CountryFlagProps = {
   lang: string
   className?: string
}

export const CountryFlag: FC<CountryFlagProps> = ({ lang, className }) => (
   <ReactSVG src={`/flags/${lang}.svg`} className={joinClasses("w-6 h-4", className)} />
)
