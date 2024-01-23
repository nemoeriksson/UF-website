<head>
    <link rel="stylesheet" href="style/userpage.css">
</head>
<script lang='ts'>
import { enhance } from '$app/forms';
import { fly } from 'svelte/transition';

export let data;
export let form;

let showDropdown = false;
$: devices = data.devices;

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
    <main>
        <section class="account">
            <p>_</p>
            <p>_</p>
            <a href="/">STILL PAGE IS STILL IN DEVELOPMENT, PRESS THIS LINK TO GO BACK</a>
            </section>

        <section class="devices">
            {#each devices as device}
                <div class="device">
                    <p class="title">{device.name}</p>
                    <p class="category">
                        {#if device.description}
                            {device.description}
                        {/if}
                    </p>
                    <div class="stats">
                        <div class="short">
                            <p class="stat">Moisture: 0%</p>
                            <p class="stat">Time Since Water: 10h</p>
                            <p class="stat">Estimated Watering time: 7d</p>
                            <button>View</button>
                        </div>
                    </div>
                </div>
            {/each}
            <div class="addDevice">
                <p class="title">Add new device</p>
                <form action="?/addDevice" method="post" use:enhance>
                    <div class="inputField">
                        <input required type="text" placeholder="Device ID" name="deviceID">
                        {#if form?.deviceID}
                            <span class="error">{form.deviceID}</span>
                        {/if}
                        </div>
                    <div class="inputField">
                        <input required type="text" placeholder="Name" name="deviceName">
                    </div>
                    <div class="inputField">
                        <input type="text" placeholder="Description (optional)" name="deviceContext">
                    </div>
                    <button>Add Device</button>
                </form>
            </div>
        </section>
    </main>
</section>
