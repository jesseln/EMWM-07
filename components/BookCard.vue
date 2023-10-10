<template>
    <div class="card flex items-center gap-8">
        <nuxt-img preset="bookImage" :src="`/img/${book.Size}.jpg`" :alt="book.Size" loading="lazy" />
        <div>
            <p class="text-2xl text-secondary">{{ book.Title }}</p>
            <p class="text-xl text-gray-50">{{ book.Author }}</p>
            <p class="text-lg text-secondary my-3">circa {{ book["Date of publication"]}}</p>
            <button class="btn" @click="selectToCart()" :disabled="isPending">
                <span v-show="!isPending">Add to Basket</span>
                <span v-show="isPending">Adding...</span>
            </button>
        </div>
    </div>
</template>

<script setup>
    import { useCartStore } from '@/stores/cartStore';

    const cartStore = useCartStore();
    const isPending = ref(false);
    const {book} = defineProps(['book']);
    const selectToCart = async () => {
        isPending.value = true;
        await cartStore.addToCart(book)
        setTimeout(() => {
            isPending.value = false;
        }, 1000)
    }
</script>

<style scoped>

</style>