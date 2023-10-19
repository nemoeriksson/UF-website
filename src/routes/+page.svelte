<link rel="stylesheet" href="/style/homepage.css">
<title>Screaming Plant | Homepage</title>

<script lang="ts">
import { onMount } from "svelte";
import { fly } from "svelte/transition";
import { swipe } from "svelte-gestures";

let aboutSectionElement:HTMLElement;
let showDropdown = false;
let aboutTab = 'development';
let images:any;
let imageElements:HTMLElement[] = [];
let stackedImageElements:HTMLElement[] = [];
let mouseDownX:number;
let mouseDown:boolean = false;
let transformPercent = 0;
let transformElement:HTMLElement;
let horizontalSensitivity = 5;
let currentStackIndex = 0;

onMount(async()=>{
    await fetch('/data.json').then(response=>response.json()).then(json => {images = json['imageData'];});
});

function scrollToAbout(){
    aboutSectionElement.scrollIntoView({behavior: "smooth"});
}

function mousePressStart(e:MouseEvent){
    if(aboutTab=='development' && window.innerWidth > 600){
        mouseDownX = e.clientX;
        mouseDown = true;
    }
}

function moveTransform(e:MouseEvent){
    if(aboutTab == 'development' && mouseDown){
        let movePercent = Math.min(Math.max((e.clientX - mouseDownX) / window.innerWidth * horizontalSensitivity, -100), 100);
        let fromPercent = transformPercent;
        transformPercent = Math.min(Math.max(movePercent + transformPercent, -100), 0);
        transformElement.animate([
            {transform: `translateX(${fromPercent}%)`},
            {transform: `translateX(${transformPercent}%)`}
        ], {
            duration: 100,
            fill: 'forwards'
        })
        imageElements.forEach(img=>{
            img.animate([
                {backgroundPositionX: `${-transformPercent}%`}
            ], {
                duration: 100,
                fill: 'forwards'
            });
        });
    }
}

function swipeImage(e:any){
    let direction = e.detail.direction;
    let change = direction == 'left' ? 1 : -1;
    currentStackIndex = (currentStackIndex+change+stackedImageElements.length)%stackedImageElements.length;
}
</script>

<nav>
    <a href="/" class="companyName">Screaming Plant UF</a>
    <div class="links nonMobile">
        <a href="#" on:click={scrollToAbout}>About Us</a>
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
        <a href="#" on:click={()=>{scrollToAbout();showDropdown=false}}>About Us</a>
        <a href="#">Products</a>
        <a href="/login">Login</a>
    </div>
{/if}

<main>
    <div class="container">
        <div class="contentContainer">
            <p class="title font1">Giving voices to plants</p>
            <p class="description">Never forget to water your plants again, with the help of Screaming Plants UF. Keep you plants alive by signing up today</p>
        </div>
        <div class="scrollContainer" on:click={scrollToAbout} aria-hidden="true">
            <span class="scrollText">Read More</span>
            <div class="scrollIcon"></div>
        </div>
    </div> 

    <div class="about" id="about" bind:this={aboutSectionElement}>
        <p class="title font1">About Us</p>
        <div class="underline mobileOnly"></div>
        <div class="content" on:mousedown={mousePressStart}     
        on:mousemove={moveTransform}
        on:mouseup={()=>{mouseDown=false}}  
        aria-hidden="true">
            <header draggable="false" unselectable="on">
                <span>
                    <span on:click={()=>{aboutTab='development'}}>Development</span>
                    <div class="dash" class:active={aboutTab=='development'} class:deactive={aboutTab=='idea'}></div>
                </span>
                <span>
                    <span on:click={()=>{aboutTab='idea';transformPercent=0}}>Our Idea</span>
                    <div class="dash" class:active={aboutTab=='idea'} class:deactive={aboutTab=='development'}></div>
                </span>
            </header>
            {#if aboutTab=='development'}
                <div class="transformContainer nonMobile" bind:this={transformElement}>
                    <div class="horizontalScrollContainer">
                        {#if images}
                        {#each images as image, index}
                            <div draggable="false" class="image" bind:this={imageElements[index]} style={`background: url("images/${image.src}"); background-size: cover;`}>
                                <p class="description">
                                    {#each image.description.split(' ') as word, index}
                                        <span style={`animation-delay: ${40*index}ms;`}>{word} </span>
                                    {/each}
                                </p>
                            </div>
                        {/each}
                        {/if}
                    </div>
                </div>
                <div class="stackedContainer mobileOnly">
                    {#if images}
                        {#each images as image, index}
                            <div class="visibleContainer" bind:this={stackedImageElements[index]} class:hidden={index!=currentStackIndex}
                                use:swipe={{timeframe:300, minSwipeDistance:50, touchAction: 'pan-y'}} 
                                on:swipe={swipeImage}>
                                <div draggable="false" class="image" style={`background: url("images/${image.src}"); background-size: cover; background-position-x: 50%;`}></div>
                                <p class="description">[img{index}] {image.description}</p>
                                <div class="sliderContainer">
                                    {#each {length: images.length} as _, index2}
                                        <span class="dot" class:full={index==index2}></span>
                                    {/each}
                                </div>
                            </div>
                        {/each}
                    {/if}
                </div>
            {/if}
            {#if aboutTab=='idea'}
                placeholder
            {/if}
        </div>
    </div>
</main>