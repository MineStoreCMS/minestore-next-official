import { joinClasses } from "@helpers/join-classes"
import { FC, PropsWithChildren } from "react"

type ModalProps = {
   show: boolean
   onClickOutside(): void
   className?: string
   backgroundColor?: string
} & PropsWithChildren

export const Modal: FC<ModalProps> = ({ show, onClickOutside, className, children, backgroundColor }) => {

   if (!show) return <></>

   return (
      <>
         <div onClick={onClickOutside} className="fixed w-full h-full left-0 top-0 z-40" style={{ backgroundColor }} />
         <div className={joinClasses("z-50", className)}>
            {children}
         </div>
      </>
   )
}
