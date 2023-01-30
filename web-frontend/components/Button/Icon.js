import Image from "next/image";

const Icon = (props) => {
  return (
    <Image src={props.src} alt="icon" height={16} width={16} className={`cursor-pointer ${props.className}`}/>
  )
}

export default Icon