<template>
    <div class="sltp-parameters">
        <div>
            <v-text-field
              v-model="optSLValue"
              label="Stop Loss"
              box
              readonly
              maxlength="10"
              placeholder="-">
						</v-text-field>
        </div>
        <div>
            <v-text-field
              v-model="optTPValue"
              label="Take Profit"
              box
              readonly
              maxlength="10"
              placeholder="-">
						</v-text-field>
        </div>
        <div>
            <v-text-field
              v-model="optIRValue"
              label="Information Ratio"
              box
              readonly
              maxlength="10"
              placeholder="-">
						</v-text-field>
        </div>
        <div>
            <v-text-field
              v-model="optHorizonValue"
              label="Horizon"
              box
              suffix="days"
              readonly
              maxlength="10"
              placeholder="-">
						</v-text-field>
        </div>
        <div>
            <v-text-field
              v-model="optTradPLValue"
              label="Trad PL Ratio"
              box
              readonly
              maxlength="10"
              placeholder="-">
						</v-text-field>
        </div>
    </div>
</template>

<script>
import {mapState} from 'vuex'

export default {
  computed: {
    ...mapState('fit', ['optSLValue' ,'optTPValue', 'optIRValue', 'optHorizonValue', 'optTradPLValue'])
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
