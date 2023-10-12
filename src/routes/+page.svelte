<link rel="stylesheet" href="/style/homepage.css">

<script lang="ts">
import { fly } from "svelte/transition";
let showDropdown = false;
</script>

<nav>
    <a href="/" class="companyName">Screaming Plant UF</a>
    <div class="links nonMobile">
        <a href="#">About Us</a>
        <a href="#">Products</a>
        <a href="/login">Login</a>
    </div>
    <div class="hamburgerMenu mobileOnly" aria-hidden="true"
        on:click={()=>{showDropdown=!showDropdown}} 
        on:keyup={()=>{showDropdown=!showDropdown}}>
        <span class="menuText">menu</span>
        <div class="hamburgerContainer" class:rotated={showDropdown}>
            <span class="bar"></span>
            <span class="bar"></span>
        </div>
    </div>
</nav>
{#if showDropdown}
    <div class="dropdown mobileOnly"
        transition:fly={{y:-150, duration: 350}}>
        <a href="#">About Us</a>
        <a href="#">Products</a>
        <a href="/login">Login</a>
    </div>
{/if}

<div class="container">
    <div class="contentContainer">
        <p class="title">Giving voices to plants</p>
        <p class="description">Never forget to water your plants again, with the help of Screaming Plants UF. Keep you plants alive by signing up today</p>
    </div>
    <div class="scrollContainer">
        <span class="scrollText">Read More</span>
        <div class="scrollIcon"></div>
    </div>
</div> 
