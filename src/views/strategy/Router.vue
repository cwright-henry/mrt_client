<template>
	<v-container>
		<transition>
			<keep-alive>
				<router-view></router-view>
			</keep-alive>
		</transition>
	</v-container>
</template>

<script>
export default {
	name: "MrtHome"
};
</script>