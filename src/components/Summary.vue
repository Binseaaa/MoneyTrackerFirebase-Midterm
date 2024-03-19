<script setup>
import {onSnapshot, collection, doc, query, where} from 'firebase/firestore'
import db from '../firebase/config'
import { ref, onMounted } from 'vue';

const track = ref([])

const getTracker = async () => {
    onSnapshot(collection(db, 'expenseTracker'), querySnap => {
        const tmp = []

        querySnap.forEach((doc) => {
            const dataT = {
                id: doc.id,
                data: doc.data()
            }
            tmp.push(dataT)
        })
        track.value = tmp

    })
}

// const total = () => {
//     let total = 0;
//     track.value.forEach(exp => {
//         total += parseFloat(exp.data.Amount)
//     })
//     return total
// }

const totExpense = () => {
    return track.value.reduce((total, dataT) => {
        if (dataT.data.Type === 'Expense') {
            return total + dataT.data.Amount;
        } else {
            return total;
        }
    }, 0);
};

const totIncome = () => {
    return track.value.reduce((total, dataT) => {
        if (dataT.data.Type === 'Income') {
            return total + dataT.data.Amount;
        } else {
            return total;
        }
    }, 0);
};

const balance = () => {
    return totIncome() - totExpense();
};

onMounted(() => {
    getTracker()
})
</script>

<template>
    <div class="text-center text-green-600 text-5xl font-bold">Summary</div>
    <div class="flex justify-center">
      <div class="w-2/6">
        <div class="border rounded-lg bg-white shadow-md m-5 transition hover:scale-125 duration-500">
          <div class="p-5">
            <h1 class="text-xl font-bold text-green-600 mb-3">Total Income</h1>
            <h1 class="text-3xl font-bold">₱{{ totIncome() }}</h1>
          </div>
        </div>
  
        <div class="border rounded-lg bg-white shadow-md m-5 transition hover:scale-125 duration-500">
          <div class="p-5">
            <h1 class="text-xl font-bold text-red-600 mb-3">Total Expenses</h1>
            <h1 class="text-3xl font-bold">₱{{ totExpense() }}</h1>
          </div>
        </div>
  
        <div class="border rounded-lg bg-white shadow-md m-5 transition hover:scale-125 duration-500">
          <div class="p-5">
            <h1 class="text-xl font-bold mb-3">Balance</h1>
            <h1 class="text-3xl font-bold">₱{{ balance() }}</h1>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  

        <!-- <div class="relative border-2 border-black m-5 rounded-2xl overflow-x-auto shadow-md">
                <div class="h-96 overflow-x-auto" ref="tableContainer">
                    <table class="w-full text-sm text-left rtl:text-right mb-16">
                        <thead class="text-lg text-gray-700 uppercase dark:bg-green-700 text-slate-50">
                            <tr>
                                <th scope="col" class="px-6 py-3">Id</th>
                                <th scope="col" class="px-6 py-3">Name</th>
                                <th scope="col" class="px-6 py-3">Type</th>
                                <th scope="col" class="px-6 py-3">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr class="relative odd:bg-white odd:dark:bg-green-100 even:bg-green-200 text-1xl" v-for="tracker in track" :key="tracker.id">
                                <td class="px-6 py-4">{{ tracker.id }}</td>
                                <td class="px-6 py-4">{{ tracker.data.Name || tracker.data.Item }}</td>
                                <td class="px-6 py-4">{{ tracker.data.Type }}</td>
                                <td class="px-6 py-4">₱ {{ tracker.data.Amount }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div> -->