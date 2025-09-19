// WhatsAppLink.tsx
import React, { useCallback, useRef, useEffect } from "react";

type Props = {
  phone: string;                // international form: e.g. "+919876543210" or "919876543210"
  message?: string;             // optional prefilled message
  children?: React.ReactNode;   // link text / content
  className?: string;
  ariaLabel?: string;
};

function sanitizePhone(input: string) {
  // Remove non-digit characters, keep leading + removed for wa.me
  return input.replace(/\D+/g, "");
}

export default function WhatsAppLink({
  phone,
  message = "",
  children,
  className,
  ariaLabel,
}: Props) {
  const sanitized = sanitizePhone(phone);
  const encodedMsg = encodeURIComponent(message || "");
  const webUrl = `https://wa.me/${sanitized}${encodedMsg ? `?text=${encodedMsg}` : ""}`;
  const appUrl = `whatsapp://send?phone=${sanitized}${encodedMsg ? `&text=${encodedMsg}` : ""}`;

  const fallbackTimer = useRef<number | null>(null);

  // Clear timer on unmount
  useEffect(() => {
    return () => {
      if (fallbackTimer.current) {
        window.clearTimeout(fallbackTimer.current);
      }
    };
  }, []);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      // Allow default for modifier-clicks (open in new tab) or if user uses middle-click
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return;

      e.preventDefault();

      const isMobile = /Mobi|Android/i.test(navigator.userAgent);

      // On desktop prefer WhatsApp Web directly
      if (!isMobile) {
        window.location.href = webUrl;
        return;
      }

      // On mobile: try opening the native app first, then fallback to web after a short delay.
      // Use visibilitychange to detect if user left the page (likely app opened) and cancel fallback.
      const onVisibilityChange = () => {
        if (document.hidden) {
          if (fallbackTimer.current) {
            window.clearTimeout(fallbackTimer.current);
            fallbackTimer.current = null;
          }
          document.removeEventListener("visibilitychange", onVisibilityChange);
        }
      };

      document.addEventListener("visibilitychange", onVisibilityChange);

      // Try to open the app URI
      // Some browsers allow setting location to app scheme, others block — we handle fallback.
      try {
        // Using location.assign so it works in many browsers; window.open may produce popup blockers.
        window.location.href = appUrl;
      } catch {
        // ignore; next we set timer for fallback
      }

      // After ~800ms, if app didn't open, go to web URL
      fallbackTimer.current = window.setTimeout(() => {
        window.location.href = webUrl;
        document.removeEventListener("visibilitychange", onVisibilityChange);
      }, 800);
    },
    [appUrl, webUrl]
  );

  return (
    <a
      href={webUrl}                 // fallback and progressive enhancement
      onClick={handleClick}
      className={className}
      aria-label={ariaLabel}
      rel="noopener noreferrer"
    >
      {children ?? webUrl}
    </a>
  );
}
