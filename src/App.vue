<template>
  <div id="app" v-cloak>
    <v-app dark>
      <router-view></router-view>
    </v-app>
  </div>
</template>

<script>
export default {
  name: 'MrtApplication'
}
</script>

<style>
  a {
    text-decoration: none;
  }
  :root {
    --blue: #42A5F5;
    --orange: #FFA726;
    --green: #00E676;
    --error: #EF5350;
    --light-gray: rgba(255, 255, 255, 0.7);
  }
  [v-cloak] {
     display: none;
  }
</style>

