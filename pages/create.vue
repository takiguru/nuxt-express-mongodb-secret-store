<template>
  <v-container fill-height>
    <v-row justify="center" align-content="center">
      <div class="text-h3 mb-5">Create a new secret</div>
      <v-row justify="center">
        <v-col cols="12">
          <v-textarea
            v-model="secretForm.secret"
            name="input-7-1"
            label="Secret text"
            value="Write your secret text here"
          ></v-textarea>
        </v-col>
        <v-col cols="12">
          <v-switch
            v-model="switchExpiresAfterCount"
            :label="`Expires after view count`"
            @change="resetExpiresAfterCount"
          ></v-switch>
          <v-text-field
            v-if="switchExpiresAfterCount"
            v-model="secretForm.expireAfterViews"
            type="number"
            :label="`Expire after view count`"
          ></v-text-field>
        </v-col>
        <v-col cols="12">
          <v-switch
            v-model="switchExpiresAfterDate"
            :label="`Expires at date`"
            @change="resetExpiresAfterDate"
          ></v-switch>
          <v-row v-show="switchExpiresAfterDate" justify="space-around">
            <v-date-picker v-model="expireDate.date"></v-date-picker>
            <v-time-picker
              v-model="expireDate.time"
              format="24hr"
            ></v-time-picker>
          </v-row>
        </v-col>
        <v-col cols="12" class="d-flex justify-space-around mt-10">
          <v-btn to="/" color="error">Cancel</v-btn>
          <v-btn color="primary" @click="createSecret">Create</v-btn>
        </v-col>
        <v-alert v-if="secretUrl" color="info" class="mt-10">
          <p>Your secret url:</p>
          {{ secretUrl }}
        </v-alert>
      </v-row>
    </v-row>
  </v-container>
</template>

<script>
import dayjs from 'dayjs'

export default {
  data() {
    return {
      switchExpiresAfterCount: false,
      switchExpiresAfterDate: false,
      expireDate: {},
      secretUrl: '',
      secretForm: {
        secret: '',
      },
    }
  },
  methods: {
    getExpireDate() {
      const expireTimeArray = this.expireDate.time.split(':')
      const expireDate = dayjs(this.expireDate.date, 'YYYY-MM-DD')
        .hour(expireTimeArray[0])
        .minute(expireTimeArray[1])
      return expireDate
    },
    async createSecret() {
      const requestBody = this.secretForm
      if (requestBody.secret.length === 0) {
        this.$notifier.showMessage({
          content: 'Your secret text is empty',
          color: 'error',
        })
        return
      }
      if (this.switchExpiresAfterDate) {
        requestBody.expiresAfter = this.getExpireDate()
      }
      let response, body
      try {
        response = await fetch('/api/secret', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        })
        body = await response.json()
      } catch (err) {
        this.$notifier.showMessage({
          content: 'Failed to create secret',
          color: 'error',
        })
        return
      }
      if (response.status !== 200) {
        this.$notifier.showMessage({
          content: response.message,
          color: 'error',
        })
        return
      }
      this.$notifier.showMessage({ content: 'Secret created', color: 'info' })
      this.secretUrl = `${window.location.origin}/${body.hash}`
    },
    resetExpiresAfterCount() {
      if (this.switchExpiresAfterCount) {
        this.$set(this.secretForm, 'expireAfterViews', 0)
      } else {
        delete this.secretForm.expireAfterViews
      }
    },
    resetExpiresAfterDate() {
      if (this.switchExpiresAfterDate) {
        const currentDate = dayjs()
        this.$set(this, 'expireDate', {
          date: currentDate.format('YYYY-MM-DD'),
          time: currentDate.format('HH:mm'),
        })
        // this.expireDate.date = currentDate.format('YYYY-MM-DD')
        // this.expireDate.time = currentDate.format('HH:mm')
      }
    },
  },
}
</script>

<style scoped></style>
