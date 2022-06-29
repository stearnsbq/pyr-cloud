<script lang="ts" context="module">
  import { browser } from "$app/env";
  import jwt_decode from "jwt-decode";
  import { writable } from "svelte/store";

  export const loggedIn = writable(null);


  export function login(username: string, password: string) {
    return fetch(`${import.meta.env.VITE_API_URL}auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    })
      .then((resp) => resp.json())
      .then((response) => {
        loggedIn.set(jwt_decode(response.data))
        localStorage.setItem("access_token", response.data);
        return response;
      });
  }


  export function isLoggedIn() {
    if(!browser){
        return false;
    }

    const token = localStorage.getItem("access_token") ?? "";

    const decoded = jwt_decode(token) as any;

    const now = Date.now().valueOf() / 1000

    if(!decoded.exp || decoded.exp < now){
        loggedIn.set(null)
        return false
    }

    loggedIn.set(decoded)

    return true;
  }
</script>
