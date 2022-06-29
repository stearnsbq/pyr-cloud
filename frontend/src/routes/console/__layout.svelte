<script lang="ts">
import {page} from "$app/stores";
import { browser } from '$app/env';

import { goto } from '$app/navigation';

import {Header, SideNav, SideNavLink, SideNavItems, Content, HeaderNav, HeaderNavItem, SkipToContent  } from 'carbon-components-svelte'

import {loggedIn} from '../../services/auth.svelte'

let isSideNavOpen = true;

if(browser && $page.routeId === "console"){
    goto("/console/dashboard")
}

loggedIn.subscribe((login) => {
    if(!login && browser){
        goto("/")
    }
})


</script>

<Header  company="Pyr-Cloud" platformName="Console">
    <svelte:fragment slot="skip-to-content">
        <SkipToContent />
      </svelte:fragment>
</Header>

<SideNav bind:isOpen={isSideNavOpen}>

    <SideNavItems>
        <SideNavLink href="/console/dashboard" text="Dashboard"/>
        <SideNavLink href="/console/api-gateway" text="API Gateway"/>
        <SideNavLink href="/console/functions" text="Functions"/>
        <SideNavLink href="/console/database" text="Database"/>
    </SideNavItems>

</SideNav>

<Content>
    <slot></slot>
</Content>

