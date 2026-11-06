const technicalPatterns = [
    /database/i,
    /supabase/i,
    /postgres/i,
    /row[- ]level/i,
    /violates/i,
    /relation .* does not exist/i,
];

export function userFacingError(error, fallback = 'Something went wrong. Please try again.') {
    const message = error?.message;
    if (!message || technicalPatterns.some((pattern) => pattern.test(message))) return fallback;
    return message;
}

export function logError(context, error) {
    if (import.meta.env.DEV) console.error(context, error);
}
