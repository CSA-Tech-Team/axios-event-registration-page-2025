import { FC } from "react"

interface SigninBubbleComponentProps {
  active:number
}
export const SigninBubble:FC<SigninBubbleComponentProps> = ({active}) => {
  return (
    <div className="flex justify-evenly gap-8 px-14">
      <div className={ `${active==1?"bg-white text-black":"bg-[#414141] text-black"}  py-3 px-5 rounded-[50%] `}>1</div>
      <div className={ `${active==2?"bg-white text-black":"bg-[#414141] text-black"}  py-3 px-5 rounded-[50%] `}>2</div>
      <div className={ `${active==3?"bg-white text-black":"bg-[#414141] text-black"}  py-3 px-5 rounded-[50%] `}>3</div>
    </div>
  )
}
