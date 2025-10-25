import { useEffect, useState } from 'react';

export function useDarkMode() {
  const [dark, setDark] = useState(true);

  // Apply dark mode class to body
  useEffect(() => {
    document.body.classList.toggle('app--dark', dark);
  }, [dark]);

  const toggleDarkMode = () => setDark(prev => !prev);

  return {
    dark,
    toggleDarkMode
  };
}
