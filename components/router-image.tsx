import React from "react";
type Props = React.ImgHTMLAttributes<HTMLImageElement> & { fill?: boolean; priority?: boolean; unoptimized?: boolean; sizes?: string };
export default function RouterImage({ fill, priority, unoptimized, sizes, style, ...props }: Props) {
  return <img {...props} style={fill ? { ...style, position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" } : style} loading={priority ? "eager" : "lazy"} />;
}
