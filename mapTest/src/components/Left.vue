<template>
    <div>
        {{message}}
    </div>
</template>
<script>
    export default {
        name: 'User',
        data () {
            return {
                message: 'a user vue',
            };
        },
        mounted () {
            console.log('i am user vue');
        }
    }
</script>