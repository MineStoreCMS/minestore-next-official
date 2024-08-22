import { joinClasses } from "@helpers/join-classes";
import { FC } from "react";

type LoaderProps = {
   className?: string
}

export const Loader: FC<LoaderProps> = ({ className }) => (
   <div className={joinClasses("w-full flex items-center justify-center py-40", className)}>
      <div className="loader" />
   </div>
)
