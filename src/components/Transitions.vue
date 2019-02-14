<template>
  <component 
		:is="type" 
		:tag="tag"
    @before-enter="beforeEnter"
		@enter="enter"
		@after-enter="afterEnter"
		@before-leave="beforeLeave"
		@leave="leave"
		@after-leave="afterLeave"
		:css="false">
			<slot></slot>
  </component>  
</template>

<script>

export default {
  props: {
    group: {
      type: Boolean,
      default: false
    },
    tag: {
      type: String,
      default: "div"
    }
  },
  computed: {
    type() {
      return this.group ? "transition-group" : "transition";
    }
  },
  methods: {

		/**
		 * Order in which things get called
		 */
		beforeEnter(el) {
			console.log('Before Enter ' + el.className)
		},

		beforeLeave(el) {
			console.log('Before Leave ' + el.className)
		},

		leave(el, done) {
			
		},

		afterLeave(el) {
			console.log('After Leave ' + el.className)
		},

		enter(el, done) {
			
		},

		afterEnter(el) {
			console.log('After Enter ' + el.className)
		},
	}
}
</script>

<style>

</style>
