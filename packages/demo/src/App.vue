<template>
    <main class="container">
        <router-view/>
    </main>
</template>

<script lang="ts">
    import { defineComponent } from 'vue';

    export default defineComponent({
        name: 'App',
    });
</script>
