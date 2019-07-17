<template>
	<div>
		<v-breadcrumbs :items="items">
			<template slot="item" slot-scope="props">
				<a
					@click="$router.go(-1)"
					:class="[props.item.disabled && 'disabled']"
				>{{ props.item.text.toUpperCase() }}</a>
			</template>
		</v-breadcrumbs>
	</div>
</template>

<script>
export default {
	data: () => ({
		items: [
			{
				text: "Strategy",
				disabled: false,
				href: "/strategy"
			},
			{
				text: "Fit",
				disabled: true,
				href: "fit"
			}
		]
	})
};
</script>

<style>
</style>
