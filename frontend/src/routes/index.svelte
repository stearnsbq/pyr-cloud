<script lang="ts">
    import LoginForm from '../components/login.svelte'
    import {Tile} from 'carbon-components-svelte'
</script>

<div class="login-content">

    <Tile>
        <div class="login-box">
            <h2>Pyr-Cloud Console</h2>
            <LoginForm></LoginForm>
        </div>
    </Tile>

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