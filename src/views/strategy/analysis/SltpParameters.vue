<template>
    <div class="sltp-parameters">
        <div>
            <v-text-field
								v-model="stopLoss"
								label="Stop Loss"
								box
								maxlength="10"
								placeholder="-">
						</v-text-field>
        </div>
        <div>
            <v-text-field
								v-model="stopLoss"
								label="Take Profit"
								box
								maxlength="10"
								placeholder="-">
						</v-text-field>
        </div>
        <div>
            <v-text-field
								v-model="stopLoss"
								label="Information Ratio"
								box
								maxlength="10"
								placeholder="-">
						</v-text-field>
        </div>
        <div>
            <v-text-field
								v-model="stopLoss"
								label="Date"
								box
								maxlength="10"
								placeholder="-">
						</v-text-field>
        </div>
    </div>
</template>

<script>
export default {
  data() {
    return {
      stopLoss: null
    }
  }
}
</script>

<style lang="less">
.sltp-parameters {
  display: flex;
  > div {
    margin: 0 16px;
    max-width: 180px;
  }
}
</style>
