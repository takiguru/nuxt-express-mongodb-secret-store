<template>
  <v-container fill-height>
    <v-row justify="center" align-content="center">
      <v-col>
        <div class="text-h3 mb-5">Secret Store</div>
      </v-col>
      <v-col>
        <v-text-field
          v-model="secretValue"
          label="Give me your secret here"
          :append-icon="'mdi-magnify'"
          @click:append="submitSecretHash"
        >
        </v-text-field>
        <v-btn to="/create">Create a new secret</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      secretValue: '',
    }
  },
  methods: {
    submitSecretHash() {
      if (this.secretValue.length === 0) {
        this.$notifier.showMessage({
          content: "That's not a secret",
          color: 'warning',
        })
      }
      this.$router.push(`/${this.secretValue}`)
    },
  },
}
</script>
