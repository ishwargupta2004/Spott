"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";

const ATTENDEE_PAGES = ["/explore", "/events", "/my-tickets", "/profile"];

export function useOnboarding() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  // Session mein onboarding complete hua ya nahi — MongoDB se independent
  const [completedInSession, setCompletedInSession] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { isSignedIn } = useAuth();

  const fetchUser = async () => {
    try {
      const res = await fetch("/api/users/current-user");
      const data = await res.json();
      setCurrentUser(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isSignedIn) {
      // Logout hone par sab reset karo
      setCurrentUser(null);
      setShowOnboarding(false);
      setCompletedInSession(false); // ← next login pe phir dikhega
      setIsLoading(false);
      return;
    }
    fetchUser();
  }, [isSignedIn]);

  useEffect(() => {
    if (isLoading || !currentUser || completedInSession) return;

    // Sirf ATTENDEE_PAGES pe dikhao
    const requiresOnboarding = ATTENDEE_PAGES.some((page) =>
      pathname.startsWith(page)
    );

    if (requiresOnboarding) {
      setShowOnboarding(true);
    }
  }, [currentUser, pathname, isLoading, completedInSession]);

  const handleOnboardingComplete = async () => {
    setShowOnboarding(false);
    setCompletedInSession(true); // ← is session mein dobara mat dikhao
    await fetchUser();
    router.refresh();
  };

  const handleOnboardingSkip = () => {
    setShowOnboarding(false);
    setCompletedInSession(true); // ← skip kiya toh bhi session mein dobara mat dikhao
    router.push("/");
  };

  return {
    showOnboarding,
    setShowOnboarding,
    handleOnboardingComplete,
    handleOnboardingSkip,
    needsOnboarding: currentUser && !completedInSession,
  };
}