<template>
  <div class="section">
    <div class="container">
      <div class="columns">
        <div class="column is-full-mobile is-8-tablet is-offset-2-tablet is-4-desktop is-offset-4-desktop">
          <b-field>
            <b-input placeholder="your name..."
                     type="text"
                     required
                     validation-message="Cannot be empty">
            </b-input>
          </b-field>
        </div>
      </div>
      <div class="columns">
        <div class="column is-full-mobile is-8-tablet is-offset-2-tablet is-4-desktop is-offset-4-desktop has-text-centered">
          <b-button type="is-danger">Next!</b-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    methods: {
      clickMe() {
        this.$buefy.notification.open('Clicked!!')
      }
    }
  }
</script>