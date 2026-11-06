import { AlertCircle, RefreshCw } from 'lucide-react';

export default function ErrorState({ message = 'Something went wrong.', onRetry }) {
    return (
        <div role="alert" className="rounded-xl border border-red-900/80 bg-red-950/40 p-6 text-center text-red-200">
            <AlertCircle className="mx-auto mb-2 h-8 w-8 text-red-400" />
            <p className="text-sm">{message}</p>
            {onRetry && (
                <button
                    type="button"
                    onClick={onRetry}
                    className="mt-4 inline-flex items-center gap-2 rounded-lg bg-red-900/60 px-3 py-2 text-xs font-semibold text-red-100 hover:bg-red-900"
                >
                    <RefreshCw className="h-3.5 w-3.5" /> Try again
                </button>
            )}
        </div>
    );
}
