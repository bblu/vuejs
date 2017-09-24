<template>
    <Row>
        <i-col span="5">
            <router-view name="left"></router-view>
        </i-col>
        <i-col span="19">
            <div class="layout-content-main">
                <router-view></router-view>
            </div>
        </i-col>
    </Row>
</template>
<style scoped>
    .layout-content-main{
        padding: 10px;
    }
</style>
<script>
    export default {}
</script>