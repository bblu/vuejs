<template lang="html">
    <div class="banner">
        <div class="logop"> <img src="../assets/logo-sm.png"></div>
        <h1 class="banner-txt">地图更新工具</h1>
    </div>
</template>

<script>
export default {
    name: 'banner',
    data() {
        return {
            dynamicValidateForm: {
                email: 'worker',
                password: '123'
            }
        }
    },
    components: {
        //Register
    },
    methods: {
    }
}
</script>

<style lang="scss">
.h1{
    display:block;
}
.banner{
    padding: 1px 1px;
    background-color: #084;
    color: #fff;
    font-size: 16px;
    line-height: 20px;
}
.logop {
    position: relative;
    top:8px;
    float:left;
}
.banner-txt1{
    position: absolute;
    top: 0;
    left: 70px;
    font-weight: 300;
}
</style>
