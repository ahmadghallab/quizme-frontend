<template>
<transition name="dialog">
  <div>
    <div class="dialog-mask">
      <div class="dialog-wrapper" v-bind:style="{ width: width}">
        <div class="dialog-container">
          <!-- Header -->
          <div class="dialog-header">
            <slot name="header"></slot>
          </div>
          <!-- Body -->
          <div class="dialog-body">
            <slot name="body"></slot>
          </div>
          <!-- Footer -->
          <div class="dialog-footer">
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    </div>
  </div>
</transition>
</template>
<script>
export default {
  props: {
    width: {
      default: '720px',
      type: String
    }
  }
}
</script>
<style lang="css" scoped>
.dialog-mask {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1050;
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  background-color: rgba(100,107,131,.4);
  transition: opacity .3s ease;
}
.dialog-wrapper {
  position: relative;
  margin: 2.75rem auto;
  pointer-events: none;
}
.dialog-container {
  position: relative;
  width: 100%;
  pointer-events: auto;
  transition: all .3s ease;
  /* box-shadow: 0 12px 48px 0 rgba(96,101,123,.24); */
}
.dialog-enter {
  opacity: 0;
}
.dialog-leave-active {
  opacity: 0;
}
.dialog-enter .dialog-container,
.dialog-leave-active .dialog-container {
  -webkit-transform: translate(0, 5px);
  -ms-transform: translate(0, 5px);
  transform: translate(0, 5px);
}
</style>
