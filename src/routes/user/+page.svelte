<link rel="stylesheet" href="style/userpage.css">
<script lang='ts'>
import { fly } from 'svelte/transition';

export let data;

let showDropdown = false;
let devices = data.devices;

</script>

<nav>
    <a href="/" class="companyName">Screaming Plant UF</a>
    <div class="links nonMobile">
        <a href="/">Home</a>
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
        <a href="/">Home</a>
    </div>
{/if}

<section class="container">
    <section class="account">
        <p>_</p>
        <p>_</p>
        <p>_</p>
        <p>STILL UNDER PRODUCTION - PLEASE <a href="/" style="color: blue; text-decoration: underline;">RETURN</a> TO WORKING PAGE</p>
    </section>

    <section class="devices">
        {#each devices as device}
            <div class="device">
                <p class="title">{device.name}</p>
                <p class="category">{device.category}</p>
                <div class="stats">
                    <div class="short">
                        <span>Moisture: 0%</span>
                        <span>Time Since Water: 10h</span>
                        <button>View</button>
                    </div>
                </div>
            </div>
        {/each}
    </section>
</section>
