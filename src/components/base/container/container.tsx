import { joinClasses } from "@helpers/join-classes"
import { FC, PropsWithChildren } from "react"

type ContainerProps = PropsWithChildren<{
   className?: string
}>

export const Container: FC<ContainerProps> = ({ children, className }) => {
   return (
      <div className={joinClasses("px-5 max-w-[1520px] mx-auto", className)}>
         {children}
      </div>
   )
}
