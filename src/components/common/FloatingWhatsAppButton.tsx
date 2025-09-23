import React from 'react';

type Props = {
  inviteLink: string;
  ariaLabel?: string;
  size?: number;
};

export default function FloatingWhatsAppButton({
  inviteLink,
  ariaLabel = 'Join our WhatsApp community',
  size = 56,
}: Props) {
  const px = `${size}px`;

  return (
    <a
      href={inviteLink}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      title={ariaLabel}
      className="fixed right-4 bottom-[calc(56px+1rem)] md:right-8 md:bottom-8 z-50"
    >
      <div
        style={{ width: px, height: px }}
        className="flex items-center justify-center rounded-full shadow-lg p-2 ring-0 hover:scale-105 transform transition-transform duration-150 bg-gradient-to-br from-green-500 to-green-600"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width={Math.round(size * 0.56)}
          height={Math.round(size * 0.56)}
          aria-hidden="true"
          focusable="false"
        >
          <path fill="none" d="M0 0h24v24H0z" />
          <path
            fill="#fff"
            d="M20.52 3.48A11.94 11.94 0 0 0 12 0C5.373 0 0 5.373 0 12c0 2.11.553 4.08 1.6 5.83L0 24l6.44-1.66A11.94 11.94 0 0 0 12 24c6.627 0 12-5.373 12-12 0-3.2-1.25-6.15-3.48-8.52zM12 22.06c-1.8 0-3.56-.46-5.08-1.33l-.36-.2-3.82.98.98-3.72-.23-.37A9.94 9.94 0 0 1 2 11.98C2 6.48 6.48 2 12 2s10 4.48 10 9.98S17.52 22 12 22.06z"
          />
          <path
            fill="#fff"
            d="M17.24 14.06c-.29-.14-1.71-.84-1.98-.94-.27-.1-.47-.14-.67.14-.2.29-.78.94-.96 1.13-.18.19-.36.21-.66.07-.3-.14-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.18-.29-.02-.45.13-.6.13-.12.29-.31.43-.47.14-.16.18-.27.28-.45.1-.18.05-.34-.03-.48-.08-.14-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51l-.57-.01c-.18 0-.47.07-.72.35-.25.28-.96.94-.96 2.29 0 1.35.98 2.66 1.12 2.84.14.18 1.94 3.13 4.7 4.38 3.27 1.47 3.27 0.98 3.86 0.92.59-.06 1.7-.69 1.94-1.35.24-.66.24-1.22.17-1.35-.07-.13-.27-.2-.57-.34z"
          />
        </svg>
      </div>
    </a>
  );
}