import { useCallback, useRef, useState } from 'react';

/**
 * Small hook powering the <Toast /> component.
 *
 *   const { toast, showToast } = useToast();
 *   showToast('Team member saved successfully!');
 *   showToast('Save failed: …', 'error');
 *   showToast(null); // dismiss
 *
 * The toast dismisses itself after 3.2s; calling showToast again
 * resets the timer.
 */
export function useToast(duration = 3200) {
  const [toast, setToast] = useState(null);
  const timer = useRef(null);

  const showToast = useCallback(
    (message, type = 'success') => {
      if (timer.current) clearTimeout(timer.current);
      if (!message) {
        setToast(null);
        return;
      }
      setToast({ message, type });
      timer.current = setTimeout(() => setToast(null), duration);
    },
    [duration]
  );

  return { toast, showToast };
}
