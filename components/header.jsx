"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Building, Plus, Ticket } from "lucide-react";
import { Show, SignInButton, useAuth, UserButton } from "@clerk/nextjs";
import { BarLoader } from "react-spinners";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import OnboardingModal from "./onboarding-modal";
import { useOnboarding } from "@/lib/useOnboarding";

export default function Header() {
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const { isLoaded } = useAuth();

  const { showOnboarding, handleOnboardingComplete, handleOnboardingSkip } = useOnboarding();

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
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowUpgradeModal(true)}
              className="font-bold text-1xl"
            >
              Pricing
            </Button>

            <Button variant="ghost" size="sm" asChild className="mr-2 font-bold text-1xl">
              <Link href="/explore">Explore</Link>
            </Button>

            <Show when="signed-out">
              <SignInButton mode="modal">
                <Button size="sm">Sign In</Button>
              </SignInButton>
            </Show>

            <Show when="signed-in">
              {/* Create Event Button */}
              <Button size="sm" asChild className="flex gap-2 mr-4">
                <Link href="/create-event">
                  <Plus className="w-4 h-4" />
                  <span className="hidden font-bold sm:inline">Create Event</span>
                </Link>
              </Button>

              {/* User Button */}
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: "w-9 h-9",
                  },
                }}
              >
                <UserButton.MenuItems>
                  <UserButton.Link
                    label="My Tickets"
                    labelIcon={<Ticket size={16} />}
                    href="/my-tickets"
                  />
                  <UserButton.Link
                    label="My Events"
                    labelIcon={<Building size={16} />}
                    href="/my-events"
                  />
                  <UserButton.Action label="manageAccount" />
                </UserButton.MenuItems>
              </UserButton>
            </Show>
          </div>
        </div>

        {/* Loading Bar */}
        {!isLoaded && (
          <div className="absolute bottom-0 left-0 w-full">
            <BarLoader width={"100%"} color="#a855f7" />
          </div>
        )}
      </nav>

      {/* Onboarding Modal */}
      <OnboardingModal
        isOpen={showOnboarding}
        onClose={handleOnboardingSkip}
        onComplete={handleOnboardingComplete}
      />

    </>
  );
}