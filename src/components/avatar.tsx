import {
  Avatar as Av,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"

type Props = {
  src?: string;
  fallbackWord?: string;
}

export default function Avatar({src, fallbackWord='?'}: Props) {
  return (
    <Av>
      {src ? (
        <AvatarImage
          src={src}
          alt={fallbackWord}
        />
      ) : null}
      <AvatarFallback>{fallbackWord}</AvatarFallback>
    </Av>
  )
}
