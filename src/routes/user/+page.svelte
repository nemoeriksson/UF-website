<head>
    <link rel="stylesheet" href="/style/userpage.css">
</head>
<script lang='ts'>
import { connectButton, generateGraph, updateGraph } from '$lib';
import type { Chart } from 'chart.js';
import { onMount } from 'svelte';
import { fly } from 'svelte/transition';

export let data;
export let form;

let showDropdown = false;
$: devices = data.devices;
const userId:string = data.userId;
let graphs:Chart[] = [];

let graphElements:HTMLCanvasElement[] = [];
onMount(()=>{
    graphElements.forEach((el:HTMLCanvasElement, i:number) => {
        graphs[i] = generateGraph(el, devices[i].data);
    });

    setInterval(updateAllGraphs, 1000);
});

export function updateAllGraphs(){
    graphs.forEach((graph, i) => {
        updateGraph(graph, devices[i].data);
    });
}

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
        <section class="addDevice">
            <div aria-hidden="true" on:click={()=>{connectButton(userId)}}>
                <p class="title">Your Devices</p>
                <p class="add">
                    Add Device
                    <span class="btIcon"></span>
                </p>
            </div>
            <hr>
        </section>
        
        <section class="devices">
            {#each devices as device, index}
                <div class="device">
                    <section class="head">
                        <div class="stats">
                            <p class="title">{device.name || `Plant ${index+1}`}</p>
                            <p class="description">{device.description || 'No description'}</p>
                            <p class="stat last-time">Time Since Water: {device.data.tsw || 'err'}</p>
                            <p class="stat">Estimated Watering time: {device.data.ewt || 'err'}</p>
                        </div>
                        <div class="statusIcon" class:low={device.data.graph.values[device.data.graph.values.length-1] <= device.data.lowAlert}></div>
                    </section>
                    <div class="graphContainer">
                        <canvas class="graph" on:load={()=>{
                            graphs[index] = generateGraph(graphElements[index], device.data);
                            console.log(`Graph nr${index+1} loaded`);
                        }} bind:this={graphElements[index]}></canvas>
                    </div>
                </div>
            {/each}
        </section>
    </main>
</section>