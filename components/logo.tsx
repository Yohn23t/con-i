"use client"

import Image from "next/image"

export function Logo() {
  return (
    <div className="flex items-center gap-2">
      <div className="relative w-10 h-10 rounded-full overflow-hidden">
        <Image
          src="/logo.jpg"
          alt="Con-I Logo"
          width={40}
          height={40}
          priority
          className="w-full h-full object-cover"
        />
      </div>
      <span className="font-bold text-lg hidden sm:inline text-foreground">Con-I</span>
    </div>
  )
}
