"use client";

import Image, { ImageLoader, ImageLoaderProps } from "next/image";

const imageLoader: ImageLoader = (config: ImageLoaderProps) => {
  const { src, quality, width } = config;
  const srcPaths = src.split("upload/");
  const urlStart = srcPaths[0];
  const urlEnd = srcPaths[1];
  const transformations = `q_${quality},w_${width}`;

  return `${urlStart}upload/${transformations}/${urlEnd}`;
};

type BaseProps = {
  src: string;
  alt: string;
  className?: string;
};

type WithSize = {
  height: number;
  width: number;
  fill?: never;
};

type WithFill = {
  fill: boolean;
  height?: never;
  width?: never;
};

type Props = BaseProps & (WithSize | WithFill);

export default function ExternalImage(props: Props) {
  const { src, alt, className = "" } = props;

  return (
    <Image
      loader={imageLoader}
      src={src}
      alt={alt}
      quality={75}
      className={className}
      {...("fill" in props
        ? { fill: props.fill }
        : {
            width: props.width ?? 200,
            height: props.height ?? 200,
          })}
    />
  );
}
