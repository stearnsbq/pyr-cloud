<script lang="ts">
    import "carbon-components-svelte/css/g80.css";
    import LoginForm from '../components/login.svelte'

</script>

<div class="login-content">

    <div class="login-box">
        <h2>Pyr-Cloud Console</h2>
        <LoginForm></LoginForm>
    </div>



</div>

<style lang="scss">

    .login-box{
        width: 350px;
        padding: 25px;
        display: flex;
        flex-direction: column;
        gap: 25px;

    }
    

    .login-content{
        display: flex;
        justify-content: center;
        align-items: center;

        height: 100vh;
        width: 100%;
    }

</style>