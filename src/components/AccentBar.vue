<template>
  <div :class="styleClass">
    <a href="javascript:void(0)"
    v-for= "(symbol, i) in symbols" v-bind:key="i"
    class="accent-bar-style"
    v-bind:class="{ 'text-uppercase':symbolUpper }"
    @click="addSymbol">{{ symbol }}</a>
    <div class="text-right">
      <a class="tag-style default-highlight text-lowercase"
      v-bind:class="{ 'text-uppercase':symbolUpper }"
      href="javascript:void(0)" v-on:click="symbolUpper = !symbolUpper">
        abc
      </a>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    styleClass: String,
    targetElement: String
  },
  data () {
    return {
      symbolUpper: false,
      symbols: ['°','←','→','↑','↓','↔','⇌','∆','⁺','₊','⁻','∙','⁰','₀','¹','₁','²','₂','³','₃','⁴','₄','⁵','₅','⁶','₆','⁷','₇','⁸','₈','⁹','₉','ⁿ','ₙ','ε','‖','%','∀','∃','∅','∈','∉','∋','∑','+','±','÷','×','<','=','≠','>','|','−','⁻','√','∞','∠','∧','∨','∩','∪','∫','∴','∵','∼','≅','≈','≡','≤','≥','⊂','⊄','⊃','⊆','⊇','⊕','⊗','⊥','⌒','½','¼','¾','ƒ','α','β','γ','δ','η','θ','ι','κ','λ','µ','π','σ','ω','ℵ']
    }
  },
  methods: {
    typeInTextarea(el, newText) {
      var start = el.selectionStart
      var end = el.selectionEnd
      var text = el.value
      var before = text.substring(0, start)
      var after  = text.substring(end, text.length)
      el.value = (before + newText + after)
      el.selectionStart = el.selectionEnd = start + newText.length
      el.focus()
    },
    addSymbol (event) {
      if (this.targetElement) {
        this.typeInTextarea(document.getElementById(this.targetElement), event.target.innerText)
      }
    }
  }
}
</script>
