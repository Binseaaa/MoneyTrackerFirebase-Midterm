<script setup>
import { onMounted, ref } from 'vue'
import db from '../firebase/config'
import { collection, doc, onSnapshot, addDoc, updateDoc, deleteDoc, query, where } from 'firebase/firestore'
import { computed } from 'vue'

const incTracker = ref([])
const isEditing = ref(false)
const editId = ref(null)
const name = ref('')
const amount = ref('')
const date = ref('')

const btnText = computed(() => {
    return isEditing.value ? 'Save Income' : 'Add Income';
})

const totInc = computed(() => {
    let total = 0;
    incTracker.value.forEach(inc => {
        total += parseFloat(inc.data.Amount)
    })
    return total
})

const scrollToBottom = () => {
    if (tableContainer.value) {
        tableContainer.value.scrollTop = tableContainer.value.scrollHeight;
    }
}

const getTracker = async () => {
    onSnapshot(query(collection(db, 'expenseTracker'), where('Type', '==', 'Income')), querySnap => {
        const tmp = []
        querySnap.forEach(doc => {
            const incT = {
                id: doc.id,
                data: doc.data()
            }
            tmp.push(incT)
        })
        incTracker.value = tmp

        // Sort by date if you want
        incTracker.value.sort((a, b) => a.data.Date - b.data.Date)
    })
}

const addIncome = async () => {
    const datetime = new Date();

    if (!name.value || isNaN(amount.value) || !date.value || parseFloat(amount.value) < 0) {
        alert("Please enter valid values for Name, Amount (non-negative), Date.");
        return;
    }

    try {
        const incomeData = {
            Date: datetime,
            Name: name.value,
            Amount: amount.value,
            Type: "Income"
        }

        if (isEditing.value) {
            await updateDoc(doc(db, 'expenseTracker', editId.value), incomeData);
            isEditing.value = false;
            editId.value = null;
        } else {
            await addDoc(collection(db, 'expenseTracker'), incomeData);
        }

        // Clear inputs after adding/editing
        name.value = '';
        amount.value = '';
        date.value = '';
        scrollToBottom(); 

    } catch (error) {
        console.error("Error adding/updating document: ", error);
    }
}

const formatDateTime = (timestamp) => {
    try {
        if (!timestamp || !timestamp.toDate) {
            return 'Invalid Date';
        }
        const date = timestamp.toDate();
        // Format date and time
        const formattedDate = date.toLocaleDateString('en-US');
        const formattedTime = date.toLocaleTimeString('en-US');
        return `${formattedDate} ${formattedTime}`;
    } catch (error) {
        console.error('Error formatting date:', error);
        return 'Invalid Date';
    }
}

const onEdit = async (id) => {
    const inc = incTracker.value.find(inc => inc.id === id);

    name.value = inc.data.Name;
    amount.value = inc.data.Amount;
    date.value = inc.data.Date;
    isEditing.value = true;
    editId.value = id;
}

const onDelete = async (id, index) => {
    const income = incTracker.value.find(inc => inc.id === id)
    const confirmDelete = confirm("Are you sure you want to delete " + income.data.Name + "?")
    if (confirmDelete) {
        await deleteDoc(doc(db, 'expenseTracker', id))
        incTracker.value.filter(inc => inc.id !== id)
    }
}

onMounted(() => {
    getTracker()
})
</script>

<template>
    <body class="h-screen">
        <div class="text-center text-green-600 text-5xl font-bold">Income Tracker</div>
        <div class="h-5/6 border m-5 rounded-2xl w-auto bg-slate-100 flex">
            <div class="border-2 border-black m-5 rounded-2xl w-2/5">
                <form class="max-w-sm m-5 space-y-10" @submit.prevent="addIncome">
                    <div class="mb-5">
                        <label for="name" class="block mb-2 text-lg font-medium">Name</label>
                        <input type="text" v-model="name" id="name" class="border border-black text-sm rounded-lg block w-full p-2.5" required />
                    </div>
                    <div class="mb-5">
                        <label for="amount" class="block mb-2 text-lg font-medium">Amount</label>
                        <input type="number" v-model="amount" id="amount" oninput="this.value = Math.max(0, this.value.replace(/\D/g, ''))" class="border border-black text-sm rounded-lg block w-full p-2.5" required />
                    </div>
                    <div class="mb-5">
                        <label for="date" class="block mb-2 text-lg font-medium">Date</label>
                        <input type="datetime-local" v-model="date" id="date" class="border border-black text-sm rounded-lg block w-full p-2.5" required />
                    </div>
                    <button type="submit" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">{{btnText}}</button>
                </form>
            </div>
            <div class="relative border-2 border-black m-5 rounded-2xl w-full overflow-x-auto shadow-md">
                <div class="h-full overflow-y-auto" ref="tableContainer">
                    <table class="w-full text-sm text-left rtl:text-right overflow-y-auto mb-16">
                        <thead class="text-lg text-gray-700 uppercase dark:bg-green-700 text-slate-50">
                            <tr>
                                <th scope="col" class="px-6 py-3">Date</th>
                                <th scope="col" class="px-6 py-3">Name</th>
                                <th scope="col" class="px-6 py-3">Amount</th>
                                <th scope="col" class="px-6 py-3">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr class="relative odd:bg-white odd:dark:bg-green-100 even:bg-green-200 text-1xl" v-for="(inc, index) in incTracker" :key="inc.id">
                                <th scope="row" class="px-6 py-4 font-medium">{{ formatDateTime(inc.data.Date) }}</th>
                                <td class="px-6 py-4">{{ inc.data.Name }}</td>
                                <td class="px-6 py-4">₱ {{ inc.data.Amount }}</td>
                                <td class="px-6 py-4 flex items-center">
                                    <button @click="onEdit(inc.id)">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                        </svg>  
                                    </button>
                                    <button @click="onDelete(inc.id, index)">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                        </svg> 
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                        <tfoot class="absolute bottom-0">
                            <tr>
                                <th scope="row" class="px-6 py-3 text-lg dark:bg-green-700 w-screen">Total Income: ₱ {{ totInc }}</th>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>
    </body>
</template>
