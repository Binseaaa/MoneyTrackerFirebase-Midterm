import { computed } from 'vue';
import { expTracker, incTracker } from '@/components/Expense.vue';
import { totalIncome, totalExpenses } from '@/components/Income.vue';

export const totalExpenses = computed(() => {
    let total = 0;
    expTracker.value.forEach(exp => {
        total += parseFloat(exp.data.Amount);
    });
    return total;
});

export const totalIncome = computed(() => {
    let total = 0;
    incTracker.value.forEach(inc => {
        total += parseFloat(inc.data.Amount);
    });
    return total;
});