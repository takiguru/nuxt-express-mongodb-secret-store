<template>
  <v-container fill-height>
    <v-row justify="center" align-content="center">
      <v-progress-circular
        v-if="loading"
        :size="70"
        :width="7"
        indeterminate
      ></v-progress-circular>
      <div
        v-else-if="errorMessage"
        class="d-flex justify-center align-center flex-column"
      >
        <div class="text-h2">{{ errorMessage }}</div>
        <v-btn class="mt-5" color="info" to="/">Back to main page</v-btn>
      </div>
      <div v-else>
        <p>Hash: {{ secretData.hash }}</p>
        <p>Text: {{ secretData.secretText }}</p>
        <p v-if="Number.isInteger(secretData.remainingViews)">
          Remaining views: {{ secretData.remainingViews }}
        </p>
        <p v-if="secretData.expiresAt">Expire date: {{ formatExpireDate() }}</p>
        <v-btn class="mt-5" color="info" to="/">Back to main page</v-btn>
      </div>
    </v-row>
  </v-container>
</template>

<script>
import dayjs from 'dayjs'

export default {
  data() {
    return {
      loading: false,
      errorMessage: '',
      secretData: false,
    }
  },
  async mounted() {
    this.loading = true
    const response = await fetch(`/api/secret${window.location.pathname}`)
    const body = await response.json()
    this.loading = false
    if (response.status !== 200) {
      this.errorMessage = body.message
      return
    }
    this.secretData = body
  },
  methods: {
    formatExpireDate() {
      return dayjs(this.secretData.expiresAt).format('YYYY / MM / DD - HH : mm')
    },
  },
}
</script>

<style scoped></style>
