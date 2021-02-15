<template>
  <v-app dark>
    <Snackbar></Snackbar>
    <Nuxt />
  </v-app>
</template>

<script>
import Snackbar from '~/components/Snackbar.vue'

export default {
  components: { Snackbar },
}
</script>

<style>
html {
  overflow-y: auto;
}
</style>
