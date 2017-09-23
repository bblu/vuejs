<template>
<div id="app">
    <div class="banner">
        <img src="./assets/logo-sm.png">
        <h1 class="banner-txt">地图更新工具</h1>
    </div>
    <router-view></router-view>
</div>
</template>

<script>
export default {
    name: 'app'
}
</script>

<style>
#app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 120px;
}
.banner{
        padding: 5px 10px;
        background-color: #080;
        color: #fff;
        font-size: 16px;
        line-height: 20px;
    }
.logo {
    position: relative;
    width: 30%;
    margin-bottom: 40px;
}
</style>
