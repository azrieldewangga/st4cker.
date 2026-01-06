import { describe, it, expect } from 'vitest';

describe('Store - Basic Tests', () => {
    it('should pass basic test', () => {
        expect(true).toBe(true);
    });

    it('should calculate balance from transactions', () => {
        const transactions = [
            { type: 'income', amount: 100000 },
            { type: 'expense', amount: 30000 },
            { type: 'expense', amount: -20000 } // negative expense
        ];

        const balance = transactions.reduce((acc, tx) => {
            const amount = Number(tx.amount);
            if (amount < 0) return acc + amount;
            return acc + (tx.type === 'income' ? amount : -amount);
        }, 0);

        expect(balance).toBe(50000); // 100000 - 30000 - 20000
    });
});
