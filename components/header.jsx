"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";

import React from 'react'
import { Show, SignInButton, UserButton } from "@clerk/nextjs";

const header = () => {
  return (
    <>
      <nav className="fixed top-0 left-0 right-0 bg-background/80 backdrop-blur-xl z-20 border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/spott.png"
              alt="Spott logo"
              width={500}
              height={500}
              className="w-full h-11"
              priority
            />
          </Link>

          {/* Right Side Actions */}
          <div className="flex items-center">
             <Show when="signed-out">
              <SignInButton mode="modal">
                <Button size="sm">Sign In</Button>
              </SignInButton>
              
            </Show>
            <Show when="signed-in">
              <UserButton />
            </Show>
          </div>

        </div>
      </nav>

    </>
  )
}

export default header