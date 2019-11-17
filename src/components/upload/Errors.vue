<template>
	<div :errors="errors" class="error-table">
		<ul>
			<li class="header">
				<div>Line</div>
				<div>Date</div>
				<div>Value</div>
			</li>
			<li v-for="item in errors" :key="item.line">
				<div class="date-error--line">{{item.line | number}}</div>
				<div class="data-error">{{item.date}}</div>
				<div class="data-error">{{item.value}}</div>
			</li>
			<li class="no--data" v-if="errors.length == 0">
				<div></div>
			</li>
		</ul>
	</div>
</template>

<script>
export default {
	props: {
		errors: {
			type: Array,
			default: function() {
				return [];
			}
		}
	}
};
</script>

<style scoped lang="less">
.error-table {
	overflow-y: auto;
	width: 100%;
	margin: 8px 0;
	background-color: rgba(0, 0, 0, 0.1);
	ul {
		list-style: none;
		padding: 0;
		display: flex;
		flex-direction: column;
		li {
			display: flex;
			flex-direction: row;
			border: solid #616161;
			border-width: 0 0 1px 0;
			background-color: rgba(0, 0, 0, 0.1);
			padding: 4px 8px;
			overflow: hidden;
			> div {
				flex: 33%;
				padding: 0px;
			}
			&.header {
				background-color: #90caf9;
				border-radius: 2px 2px 0 0;
				color: #333;
				border: solid #bdbdbd;
				border-width: 0 0 1px;
			}
			&.no--data {
				height: 50px;
				> div {
					text-align: center;
				}
			}
			div.data-error {
				color: #ff5722;
			}
			div.date-error--line {
				font-size: 13px;
			}
		}
	}
}
h1 {
	font-size: 20px;
	font-weight: 600;
}
p {
	font-size: 14px;
	font-weight: 400;
}
</style>
