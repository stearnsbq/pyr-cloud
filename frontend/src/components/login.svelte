<script lang="ts">
  import { TextInput, Button } from "carbon-components-svelte";
  import { createForm } from "svelte-forms-lib";

const { form, handleChange, handleSubmit } = createForm({
  initialValues: {
    username: "",
    password: ""
  },
  onSubmit: values => {
    alert(JSON.stringify(values));
  }
});


</script>


<form on:submit={handleSubmit}>
    <TextInput labelText="Username" placeholder="Enter your username" bind:value={$form.username}></TextInput>
    <TextInput labelText="Password" placeholder="Enter your password" bind:value={$form.password} type="password"></TextInput>

    <Button type="submit">Login</Button>

</form>



<style lang="scss">
    form{
        display: flex;
        flex-direction: column;

        gap: 25px;
    }

    
</style>