"use client";

import { useState } from "react";
import { DEFAULT_AVATAR } from "@/lib/avatar";

type AvatarImageProps = {
  src: string;
  alt: string;
  className?: string;
};

export default function AvatarImage({
  src,
  alt,
  className,
}: AvatarImageProps) {
  const resolvedSrc = src || DEFAULT_AVATAR;
  const [failedSrc, setFailedSrc] = useState("");
  const currentSrc = failedSrc === resolvedSrc ? DEFAULT_AVATAR : resolvedSrc;

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={className}
      referrerPolicy="no-referrer"
      onError={() => {
        if (resolvedSrc !== DEFAULT_AVATAR) {
          setFailedSrc(resolvedSrc);
        }
      }}
    />
  );
}
