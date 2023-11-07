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

// Loads image sources and descriptions from ´data.json´
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

/**
 * Handles mouse movement for transforming elements in the "about" tab when in the "development" section.
 * This function calculates and applies a horizontal transformation to elements when the mouse is dragged 
 * in the "development" section of the "about" tab.
 *
 * @param e - The MouseEvent object representing the mouse event.
 */
function moveTransform(e:MouseEvent){
    if(aboutTab == 'development' && mouseDown){
        // Calculate the percentage of movement based on mouse position and sensitivity.
        let movePercent = Math.min(Math.max((e.clientX - mouseDownX) / window.innerWidth * horizontalSensitivity, -100), 100);
        let fromPercent = transformPercent;
        
        // Update the transformation percentage while keeping it within specified range.
        transformPercent = Math.min(Math.max(movePercent + transformPercent, -100), 0);
        
        transformElement.animate([
            {transform: `translateX(${fromPercent}%)`},
            {transform: `translateX(${transformPercent}%)`}
        ], {
            duration: 100,
            fill: 'forwards'
        });

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
    currentStackIndex = (currentStackIndex + change + stackedImageElements.length) % stackedImageElements.length;
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
                    <span on:click={()=>{aboutTab='development'}} aria-hidden="true">Development</span>
                    <div class="dash" class:active={aboutTab=='development'} class:deactive={aboutTab=='idea'}></div>
                </span>
                <span>
                    <span on:click={()=>{aboutTab='idea';transformPercent=0}} aria-hidden="true">Our Idea</span>
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
                                <div draggable="false" class="image" style={
                                `background: url("images/${image.src}"); 
                                background-size: cover; 
                                background-position-x: ${typeof image.offset != 'undefined' ? image.offset : 50}%;`}>
                                </div>
                                <p class="description">{image.description}</p>
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
    <div class="footer">
        <div class="flexContent">
            <div class="mediaIcons">
                <a target="_blank" href="https://github.com/nemoeriksson/UF-website" class="github" title="Github"></a>
                <a target="_blank" href="https://www.instagram.com/screamingplantuf/" class="instagram" title="Instagram"></a>
            </div>
            <div class="links">
                <a href="#">Products</a>
                <a href="/login#register">Register</a>
                <a href="#">Privacy Policy</a>
                <a href="#">Terms & Services</a>
            </div>
            <span class="copyright">
                <span>Screaming Plant UF&copy; 2023 - All rights reserved</span>
                <span class="nonMobile">&nbsp;|&nbsp;</span>
                <span>Designed by Nemo Eriksson</span>
            </span>
        </div>
    </div>
</main>