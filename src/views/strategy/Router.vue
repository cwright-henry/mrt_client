<template>
	<v-container fluid>
    <transition appear name="fade" mode="out-in">
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