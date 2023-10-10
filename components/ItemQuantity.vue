<template>
    <div class="flex">
        <button class="btn" @click="cartStore.decQuantity(book)">-</button>
        <p class="py-1 px-4 mx-1 rounded-sm text-lg bg-gray-200">
            {{ book.quantity }}
        </p>
        <button class="btn" @click="cartStore.incQuantity(book)">+</button>
    </div>
</template>

<script setup>
    import { useCartStore } from '@/stores/cartStore';
    const cartStore = useCartStore();
    const {book} = defineProps(['book']);
</script>

<style scoped>

</style>