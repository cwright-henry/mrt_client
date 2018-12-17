<template>
	<v-container fluid>
    <transition name="fade" mode="out-in" appear>
		  <keep-alive>
				<router-view></router-view>
		  </keep-alive>
    </transition>
	</v-container>
</template>

<script>
export default {
  name: 'MrtHome'
}
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition-duration: 0.2s;
  transition-property: opacity;
  transition-timing-function: ease;
}

.fade-enter,
.fade-leave-active {
  opacity: 0
}

.slide-leave-active,
.slide-enter-active {
  transition: .1s;
}
.slide-enter {
  transform: translate(100%, 0);
}
.slide-leave-to {
  transform: translate(-100%, 0);
}

.slide-in-left-leave-active {
  -webkit-animation: slide-in-left .5s cubic-bezier(0.250, 0.460, 0.450, 0.940);
          animation: slide-in-left .5s cubic-bezier(0.250, 0.460, 0.450, 0.940);
}

.slide-in-left-enter-active {
  -webkit-animation: slide-in-right .5s cubic-bezier(0.250, 0.460, 0.450, 0.940) ;
          animation: slide-in-right .5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
}

@keyframes slide-in-left {
  from { 
    
  }
  to {
    -webkit-transform: translateX(-100%); transform: translateX(-100%); 
  }
}
@keyframes slide-in-right {
  from { 
    -webkit-transform: translateX(100%); transform: translateX(100%); 
  }
	to { 
    
  }
}
</style>