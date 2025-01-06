<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import * as echarts from 'echarts'

import { Button as VarButton } from '@varlet/ui'
import '@varlet/ui/es/button/style/index.mjs'

import HelloWorld from '@/views/home/components/HelloWorld.vue'
import TheWelcome from '@/views/home/components/TheWelcome.vue'

import { isNotEmptyArray } from '@/utils/utils-array'
import { clamp } from '@/utils/utils-number'
import { camelize } from '@/utils/utils-string'

defineOptions({
  name: 'HomeRouter'
})

const arr = ref([1])

const router = useRouter()

function navigateToAboutPage() {
  router.push({
    path: '/about'
  })
}

onMounted(() => {
  const chartDom = document.getElementById('main')
  const myChart = echarts.init(chartDom)

  const option = {
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        data: [120, 200, 150, 80, 70, 110, 130],
        type: 'bar'
      }
    ]
  }

  option && myChart.setOption(option)

  console.log(clamp(4, 3, 5))
  console.log(camelize('chouchouji'))
})
</script>

<template>
  <h1 v-if="isNotEmptyArray(arr)">hhhhh</h1>
  <VarButton type="primary" style="width: 150px" @click="navigateToAboutPage"
    >go to about page</VarButton
  >
  <div id="main" style="width: 600px; height: 400px"></div>
  <header>
    <img alt="Vue logo" class="logo" src="../../assets/logo.svg" width="125" height="125" />

    <div class="wrapper">
      <HelloWorld msg="You did it!" />
    </div>
  </header>

  <main>
    <TheWelcome />
  </main>
</template>

<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
