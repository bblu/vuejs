<template>
<div id="app" class="layout">
    <table width="100%" style="height: 100%;" cellpadding="0" cellspacing="0" border="0">
        <tr>
            <td style="height: 50px" background-color="#008040">
                <Banner></Banner>
            </td>
        </tr>
        <tr>
            <td>
                <router-view></router-view>
            </td>
        </tr>
    </table>
</div>
</template>

<script>
import Banner from '@/components/Header.vue'

export default {
    name: 'app',
    components: {
        Banner
    }
}
</script>

<style>
#app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: left;
    color: #2c3e50;
    margin-top: 0px;
}
html,body{
    width:99.5%; 
    height:99%;
} 
.layout{
    height:100%;
    border: 1px solid #d7dde4;
    background: #f5f7f9;
}
.layout-content{
        min-height: 200px;
        margin: 15px;
        overflow: hidden;
        background: #fff;
        border-radius: 4px;
    }

</style>
