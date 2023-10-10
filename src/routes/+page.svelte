<link rel="stylesheet" href="/style/homepage.css">

<script lang="ts">
    import { fly } from "svelte/transition";

let showDropdown = false;
</script>

<nav>
    <span class="companyName">Screaming Plant UF</span>
    <div class="links nonMobile">
        <a href="#">Products</a>
        <a href="#">Login</a>
        <a href="#">Register</a>
    </div>
    <div class="hamburgerMenu mobileOnly" aria-hidden="true"
        on:click={()=>{showDropdown=!showDropdown}} 
        on:keyup={()=>{showDropdown=!showDropdown}}>
        <span class="bar"></span>
        <span class="bar"></span>
        <span class="bar"></span>
    </div>
</nav>
{#if showDropdown}
    <div class="dropdown mobileOnly"
        transition:fly={{y:-150, duration: 350}}>
        <a href="#">Products</a>
        <a href="#">Login</a>
        <a href="#">Register</a>
    </div>
{/if}

<div class="welcomeSection">
    <div class="contentContainer">
        <p class="title">Lorem, ipsum dolor.</p>
        <p class="description">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Provident maxime tenetur laboriosam.</p>
    </div>
    <div class="scrollDownIcon"></div>
</div>
