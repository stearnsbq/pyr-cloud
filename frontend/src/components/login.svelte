<script lang="ts">
  import { TextInput, Button, PasswordInput  } from "carbon-components-svelte";
  import { createForm } from "svelte-forms-lib";
  import {login} from '../services/auth.svelte'
  import { goto } from '$app/navigation';

const { form, handleChange, handleSubmit } = createForm({
  initialValues: {
    username: "",
    password: ""
  },
  onSubmit: values => {
    

    login(values.username, values.password).then((result) => {
      
      goto("/console/dashboard")

    })


  }
});


</script>


<form on:submit={handleSubmit}>
    <TextInput required labelText="Username" placeholder="Enter your username" bind:value={$form.username}></TextInput>
    <PasswordInput  required labelText="Password" placeholder="Enter your password" bind:value={$form.password} type="password"></PasswordInput>

    <Button type="submit">Login</Button>

</form>



<style lang="scss">
    form{
        display: flex;
        flex-direction: column;

        gap: 25px;
    }

    
</style>