import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import type { ToastNotification } from '../../types/index.js';

interface ToastProps {
  toasts: ToastNotification[];
  onDismiss: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';

        return (
          <div
            key={toast.id}
            className="toast"
            style={{
              borderLeftColor: isSuccess
                ? '#10B981'
                : isError
                ? '#EF4444'
                : 'var(--yellow-primary)',
            }}
          >
            <div style={{ marginTop: '2px' }}>
              {isSuccess ? (
                <CheckCircle2 size={20} color="#10B981" />
              ) : isError ? (
                <AlertCircle size={20} color="#EF4444" />
              ) : (
                <Info size={20} color="var(--yellow-primary)" />
              )}
            </div>
            <div style={{ flex: 1 }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#F8FAFC' }}>
                {toast.title}
              </h4>
              <p style={{ fontSize: '0.825rem', color: '#94A3B8', marginTop: '2px' }}>
                {toast.message}
              </p>
            </div>
            <button
              onClick={() => onDismiss(toast.id)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#64748B',
                cursor: 'pointer',
                padding: '2px',
              }}
            >
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
