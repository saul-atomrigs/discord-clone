import { useEffect, useState } from 'react';

/** Returns the origin of the current website's URL */
export default function useOrigin() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const origin =
    typeof window !== 'undefined' && window.location.origin
      ? window.location.origin
      : '';

  if (!mounted) {
    return '';
  }

  return origin;
}
