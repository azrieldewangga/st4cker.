/**
 * Exchange Rate Service
 * Fetches and caches IDR to USD exchange rate from ExchangeRate-API
 */

import { EXCHANGE_RATES, STORAGE_KEYS, isDev } from '@/lib/constants';

const FALLBACK_RATE = EXCHANGE_RATES.FALLBACK_IDR_TO_USD;
const CACHE_KEY = STORAGE_KEYS.EXCHANGE_RATE;
const CACHE_DURATION = EXCHANGE_RATES.CACHE_DURATION;

interface CachedRate {
    rate: number;
    lastUpdated: number;
}

// In-memory flag to prevent concurrent fetches (race condition)
let isFetching = false;
let fetchPromise: Promise<number> | null = null;

/**
 * Get cached exchange rate from localStorage
 */
const getCachedRate = (): CachedRate | null => {
    try {
        const cached = localStorage.getItem(CACHE_KEY);
        if (!cached) return null;

        const data: CachedRate = JSON.parse(cached);
        const now = Date.now();

        // Check if cache is still valid (within 168 hours)
        if (now - data.lastUpdated < CACHE_DURATION) {
            return data;
        }

        // Cache expired, remove it
        localStorage.removeItem(CACHE_KEY);
        return null;
    } catch (error) {
        console.error('[ExchangeRate] Error reading cache:', error);
        return null;
    }
};

/**
 * Save exchange rate to localStorage
 */
const setCachedRate = (rate: number): void => {
    try {
        const data: CachedRate = {
            rate,
            lastUpdated: Date.now()
        };
        localStorage.setItem(CACHE_KEY, JSON.stringify(data));
    } catch (error) {
        console.error('[ExchangeRate] Error saving cache:', error);
    }
};

/**
 * Fetch current exchange rate from API
 */
const fetchRateFromAPI = async (): Promise<number> => {
    try {
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/IDR', {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }

        const data = await response.json();

        if (!data.rates || !data.rates.USD) {
            throw new Error('Invalid API response: USD rate not found');
        }

        // Rate is IDR to USD (e.g., 0.0000625)
        // We need USD to IDR, so we invert it
        const usdRate = 1 / data.rates.USD;

        if (isDev) console.log('[ExchangeRate] Fetched rate from API:', usdRate);
        return usdRate;
    } catch (error) {
        console.error('[ExchangeRate] API fetch failed:', error);
        throw error;
    }
};

/**
 * Get USD exchange rate (main function)
 * Returns cached rate if available and valid, otherwise fetches from API
 * Falls back to hardcoded rate if all else fails
 */
export const getUSDRate = async (): Promise<number> => {
    // Try to get cached rate first
    const cached = getCachedRate();
    if (cached) {
        if (isDev) console.log('[ExchangeRate] Using cached rate:', cached.rate);
        return cached.rate;
    }

    // If already fetching, wait for the existing promise
    if (isFetching && fetchPromise) {
        if (isDev) console.log('[ExchangeRate] Fetch already in progress, waiting...');
        return fetchPromise;
    }

    // No valid cache, try to fetch from API
    isFetching = true;
    fetchPromise = (async () => {
        try {
            const rate = await fetchRateFromAPI();
            setCachedRate(rate);
            return rate;
        } catch (error) {
            console.warn('[ExchangeRate] Failed to fetch rate, using fallback:', FALLBACK_RATE);
            return FALLBACK_RATE;
        } finally {
            isFetching = false;
            fetchPromise = null;
        }
    })();

    return fetchPromise;
};

/**
 * Force refresh the exchange rate (bypasses cache)
 */
export const refreshExchangeRate = async (): Promise<number> => {
    // Clear any ongoing fetch
    isFetching = false;
    fetchPromise = null;

    // Clear cache to force fresh fetch
    clearCachedRate();

    // Use getUSDRate which will fetch fresh since cache is cleared
    return getUSDRate();
};

/**
 * Clear cached exchange rate
 */
export const clearCachedRate = (): void => {
    localStorage.removeItem(CACHE_KEY);
    if (isDev) console.log('[ExchangeRate] Cache cleared');
};
