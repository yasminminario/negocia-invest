const resolveTimestamp = (value: string | Date): number | null => {
    if (!value) return null;

    if (value instanceof Date) {
        const time = value.getTime();
        return Number.isNaN(time) ? null : time;
    }

    const parsed = new Date(value).getTime();
    return Number.isNaN(parsed) ? null : parsed;
};

export const NEGOTIATION_EXPIRATION_MS = 48 * 60 * 60 * 1000;

export const calculateRemainingTime = (
    createdAt: string | Date,
    referenceTime: number = Date.now(),
    expirationWindow: number = NEGOTIATION_EXPIRATION_MS,
): number | null => {
    const createdTimestamp = resolveTimestamp(createdAt);
    if (createdTimestamp == null) return null;

    return createdTimestamp + expirationWindow - referenceTime;
};

export const isExpired = (
    createdAt: string | Date,
    referenceTime: number = Date.now(),
    expirationWindow: number = NEGOTIATION_EXPIRATION_MS,
): boolean => {
    const remaining = calculateRemainingTime(createdAt, referenceTime, expirationWindow);
    return remaining != null && remaining <= 0;
};

export const formatTimeRemaining = (milliseconds: number): string => {
    if (!Number.isFinite(milliseconds) || milliseconds <= 0) {
        return 'Expirada';
    }

    const totalMinutes = Math.floor(milliseconds / 60000);
    if (totalMinutes <= 0) return '1m';

    const days = Math.floor(totalMinutes / (60 * 24));
    const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
    const minutes = totalMinutes % 60;

    if (days > 0) {
        return `${days}d ${hours}h`;
    }

    if (hours > 0) {
        return `${hours}h ${minutes}m`;
    }

    return `${minutes}m`;
};
