<script lang="ts" setup>
import { useGoToRouter } from '../utility/router';

const { back } = useGoToRouter();


</script>

<template>
    <h1>
        关于我们
    </h1>
    <button @click="back">返回</button>
</template>