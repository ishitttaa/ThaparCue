import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import useLockBodyScroll from '../hooks/useLockBodyScroll'; // 👈 NAYA

export default function ModalShell({
  title,
  subtitle,
  onClose,
  footer,
  children,
}) {
  useLockBodyScroll(); // 👈 NAYA: peeche ka page lock

  const panelRef = useRef(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    panelRef.current?.focus();

    const onKey = (e) => {
      if (e.key === 'Escape') {
        closeRef.current?.();
      }
    };

    document.addEventListener('keydown', onKey);

    return () => {
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  return createPortal(
    <div
      className="modal-shell-backdrop"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          closeRef.current?.();
        }
      }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(30, 12, 12, 0.55)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--space-4)',
        overscrollBehavior: 'contain',
      }}
    >
      <div
        className="modal-shell-panel"
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        style={{
          width: '100%',
          maxWidth: 560,
          maxHeight: '90vh',
          position: 'relative',
          zIndex: 10000,
          display: 'flex',
          flexDirection: 'column',
          background: 'var(--modal-bg, #ffffff)',
          borderRadius: 20,
          borderTop: '4px solid #c9a227',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.35)',
          outline: 'none',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: 'var(--space-5) var(--space-5) var(--space-3)',
            flexShrink: 0,
          }}
        >
          <h2
            className="font-display"
            style={{
              fontSize: 'var(--text-xl)',
              marginBottom: 2,
            }}
          >
            {title}
          </h2>

          {subtitle && (
            <p
              className="text-muted"
              style={{ fontSize: 'var(--text-sm)' }}
            >
              {subtitle}
            </p>
          )}
        </div>

        {/* Scrollable content */}
        <div
          style={{
            flex: '1 1 auto',
            minHeight: 0,
            overflowY: 'auto',
            overscrollBehavior: 'contain', // 👈 NAYA: scroll peeche leak nahi hoga
            padding: '0 var(--space-5) var(--space-4)',
          }}
        >
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div
            style={{
              padding: 'var(--space-3) var(--space-5) var(--space-4)',
              borderTop: '1px solid rgba(128, 128, 128, 0.2)',
              display: 'flex',
              gap: 'var(--space-2)',
              flexShrink: 0,
              justifyContent: 'flex-end',
            }}
          >
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}