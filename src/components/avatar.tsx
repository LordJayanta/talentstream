import {
  Avatar as Av,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"

type Props = {
  src?: string;
  fallbackWord?: string;
}

export default function Avatar({src="https://github.com/shadcn.png", fallbackWord='CN'}: Props) {
  return (
    <Av>
      <AvatarImage
        src={src}
        alt="@shadcn"
        className="grayscale"
      />
      <AvatarFallback>{fallbackWord}</AvatarFallback>
    </Av>
  )
}
