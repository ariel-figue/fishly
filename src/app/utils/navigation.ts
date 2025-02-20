import { useRouter } from "next/navigation";

/**
 * Handles client-side navigation with a 0.5s delay.
 *
 * @param {ReturnType<typeof useRouter>} router - Next.js App Router instance.
 * @param {string} url - Destination URL.
 * @param {(loading: boolean) => void} setLoading - Function to update loading state.
 */
export const handleNavigation = (
  router: ReturnType<typeof useRouter>,
  url: string,
  setIsNavigating: (value: boolean) => void
) => {
  setIsNavigating(true);

  setTimeout(() => {
    router.push(url);
  }, 500);
};
