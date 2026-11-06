import { useCallback, useEffect, useRef, useState } from 'react';
import { CheckCircle, Info, X, XCircle } from 'lucide-react';
import { ToastContext } from './toast';

const TOAST_DURATION = 4000;
const icons = { success: CheckCircle, warning: Info, error: XCircle };

export default function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);
    const timers = useRef(new Map());
    const dismiss = useCallback((id) => {
        setToasts((current) => current.filter((toast) => toast.id !== id));
        const timer = timers.current.get(id);
        if (timer) {
            clearTimeout(timer);
            timers.current.delete(id);
        }
    }, []);
    const notify = useCallback(({ type = 'success', message, key = message, duration = TOAST_DURATION }) => {
        if (!message) return;
        const id = key || `${type}:${message}`;
        setToasts((current) => current.some((toast) => toast.id === id)
            ? current
            : [...current, { id, type, message }]);
        const timer = setTimeout(() => dismiss(id), duration);
        timers.current.set(id, timer);
    }, [dismiss]);
    useEffect(() => () => timers.current.forEach((timer) => clearTimeout(timer)), []);
    return (
        <ToastContext.Provider value={{ notify, dismiss }}>
            {children}
            <div className="fixed right-4 top-20 z-[70] flex w-[min(24rem,calc(100vw-2rem))] flex-col gap-2" aria-label="Notifications">
                {toasts.map((toast) => {
                    const Icon = icons[toast.type] || Info;
                    const color = toast.type === 'error'
                        ? 'border-red-700 bg-red-950 text-red-100'
                        : toast.type === 'warning'
                            ? 'border-amber-700 bg-amber-950 text-amber-100'
                            : 'border-emerald-700 bg-emerald-950 text-emerald-100';
                    return (
                        <div key={toast.id} role={toast.type === 'error' ? 'alert' : 'status'} aria-live={toast.type === 'error' ? 'assertive' : 'polite'} className={`flex items-start gap-2 rounded-lg border p-3 text-sm shadow-lg ${color}`}>
                            <Icon className="mt-0.5 h-4 w-4 shrink-0" />
                            <span className="flex-1">{toast.message}</span>
                            <button type="button" onClick={() => dismiss(toast.id)} aria-label="Dismiss notification">
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    );
                })}
            </div>
        </ToastContext.Provider>
    );
}
