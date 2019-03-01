<template>
  <div class="col-auto align-self-center">
    <div class="go-back-arrow" v-on:click="goBack">
      <svg viewBox="0 0 240.823 240.823" v-bind:style="{ width: width, height: height, fill: arrowColor }" xml:space="preserve">
        <g>
          <path d="M57.633,129.007L165.93,237.268c4.752,4.74,12.451,4.74,17.215,0c4.752-4.74,4.752-12.439,0-17.179
          l-99.707-99.671l99.695-99.671c4.752-4.74,4.752-12.439,0-17.191c-4.752-4.74-12.463-4.74-17.215,0L57.621,111.816
          C52.942,116.507,52.942,124.327,57.633,129.007z"/>
        </g>
      </svg>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    arrowColor: {
      default: '#fff',
      type: String
    }
  },
  data () {
    return {
      height: '25px',
      width: '25px',
    }
  },
  methods: {
    goBack () {
      this.$router.go(-1)
    },
  }
}
</script>
