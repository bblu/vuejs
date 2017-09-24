<template scope='scope'>
<table class="hello" width="100%" style="height: 100%;" cellpadding="0" cellspacing="0" border="0">
    <tr>
        <td width="20%" valign="top" bgcolor="#999f8e">
            <Left></Left>
        </td>
        <td width="80%" valign="top" bgcolor="#d2d8c7" style="position: relative">
            <Leafmap></Leafmap>
        </td>
    </tr>
</table>
</template>

<script>
/**
 * @author: weakgoldfish
 */
import Left from '@/components/Left.vue'
import Leafmap from '@/components/Leafmap.vue'
import * as types from '../store/types'
import api from '../axios'
export default {
    name: 'hello',
    components: {
        Left,
        Leafmap
    },
    data() {
        return {
            msg: 'Welcome to Vue-login',
            user: '',
            username: ''
        }
    },
    mounted() {
        this.get_User()
        this.username = localStorage.getItem('username')
    },
    methods: {
        get_User() {
            setTimeout(() => {
                api.getUser().then(({
                    data
                }) => {
                    if (data.code == 401) {
                        console.log('token')
                        this.$router.push('/login')
                        this.$store.dispatch('UserLogout')
                        console.log(localStorage.token)
                    } else {
                        this.user = data
                    }
                })
            }, 100)
        },
        logout() {
            this.$store.dispatch('UserLogout')
            if (!this.$store.state.token) {
                this.$router.push('/login')
                this.$message({
                    type: 'success',
                    message: '登出成功'
                })
            } else {
                this.$message({
                    type: 'info',
                    message: '登出失败'
                })
            }
        },
        del_user(id) {
            let opt = {
                id: this.user[id]._id
            };
            api.delUser(opt).then(response => {
                console.log(response)
                this.$message({
                    type: 'success',
                    message: '删除成功'
                })
                this.get_User()
            }).catch((err) => {
                console.log(err);
            })
        }
    }
}
</script>

<style scoped>
html,body{margin:0; padding: 0;}
.left,.right,.center {
    line-height:60px; 
    text-align:center;
}

.left {
    position:absolute; 
    top:58; left:2; 
    width: 300px; 
    height:auto;
    background-color: #ccc;}
.right {
    position:absolute; 
    top:0; right:0;  
    width: 300px; 
    background-color: #ccc;}
.map { 
    margin: 0px 0px 0px 300px; 
    background-color: #666;}
h1,
h2 {
    font-weight: normal;
}

ul {
    list-style-type: none;
    padding: 0;
}

li {
    /*display: inline-block;*/
    margin: 10px 0;
}

a {
    color: #42b983;
}

.list-complete-item {
    transition: all 1s;
    display: inline-block;
    margin-right: 10px;
}

.list-complete-enter,
.list-complete-leave-to {
    opacity: 0;
    transform: translateY(30px);
}

.list-complete-leave-active {
    position: absolute;
}
</style>
