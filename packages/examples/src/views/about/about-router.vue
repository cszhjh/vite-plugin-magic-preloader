<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

import { Button as VarButton } from '@varlet/ui'
import '@varlet/ui/es/button/style/index.mjs'

import { normalizeToArray } from '@/utils/utils-array'
import { bigCamelize } from '@/utils/utils-string'

import TestComponent from './test'

defineOptions({
  name: 'AboutRouter'
})

const router = useRouter()

function navigateToHomePage() {
  router.push({
    path: '/'
  })
}

onMounted(() => {
  console.log('about')
  console.log(normalizeToArray('123'))
  console.log(bigCamelize('chouchouji'))
})
</script>

<template>
  <h1>about</h1>
  <VarButton type="primary" style="width: 150px" @click="navigateToHomePage"
    >go to home page</VarButton
  >
  <TestComponent />
</template>
