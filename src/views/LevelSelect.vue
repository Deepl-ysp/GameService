<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { getLevelList,LevelSelect } from '../utility/level';
import { useGoToRouter } from '../utility/router';

const { goToRouter,back } = useGoToRouter();
let data = ref<LevelSelect[]>([]);

onMounted(async () => {
    data.value = await getLevelList();
});

async function runLevel(val:LevelSelect): Promise<void> {
    goToRouter({name:'Levels',query:{
        data:JSON.stringify(val)
    }})
}

</script>

<template>
  <div class="container">
    <button @click="back">X</button>
    <div class="levelSelect" v-for="value in data">
      <button @click="runLevel(value)">
        <span> {{  value.levelName  }} </span>
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.levelSelect {
  button {
    background-color: #fafafa;
    border: 3px solid #eaeaea;
    border-radius: 15px;
    padding: 0.5rem;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    &:hover {
      color: #ffffff;
      background-color: #eaeaea03;
    }
  }
}
</style>
