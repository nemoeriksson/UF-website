<link rel="stylesheet" href="/style/homepage.css">
<title>Screaming Plant | Homepage</title>

<script lang="ts">
import { onMount } from "svelte";
import { fly } from "svelte/transition";
import { swipe } from "svelte-gestures";
import type { PageData } from "./$types";

export let data:PageData;

let aboutSectionElement:HTMLElement;
let productSectionElement:HTMLElement;
let showDropdown = false;
let aboutTab = 'development';
let imageElements:HTMLElement[] = [];
let stackedImageElements:HTMLElement[] = [];
let mouseDownX:number;
let mouseDown:boolean = false;
let transformPercent = 0;
let transformElement:HTMLElement;
let horizontalSensitivity = 5;
let currentStackIndex = 0;
let favorites:string[] = [];
let members = data.members;

$: products = data.products;
$: images = data.images;

// Loads image sources, descriptions and products from ´data.json´
onMount(async()=>{
    let storedFavorites = localStorage.getItem('favorites');
    if(storedFavorites){
        favorites = JSON.parse(storedFavorites);
    }
});

function scrollToAbout(){
    aboutSectionElement.scrollIntoView({behavior: "smooth"});
}

function scrollToProducts(){
    productSectionElement.scrollIntoView({behavior: "smooth"});
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

function favorite(item:any){
    if(favorites.includes(item.name)){
        favorites = favorites.filter(el => el != item.name);
    }else{
        favorites.push(item.name);
    }
    localStorage.setItem('favorites', JSON.stringify(favorites));
    favorites = favorites;
}

</script>

<nav>
    <a href="/" class="companyName">Screaming Plant UF</a>
    <div class="links nonMobile">
        <a href="#" on:click={scrollToAbout}>About Us</a>
        <a href="#" on:click={scrollToProducts}>Products</a>
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
        <a href="#" on:click={()=>{scrollToProducts();showDropdown=false}}>Products</a>
        <a href="/login">Login</a>
    </div>
{/if}

<main>
    <div class="container">
        <div class="contentContainer">
            <p class="title font1">Giving voices to plants</p>
            <p class="description">Never forget to water your plants again, with the help of Screaming Plants UF. Keeping your plants alive with technology</p>
        </div>
        <div class="scrollContainer" on:click={scrollToAbout} aria-hidden="true">
            <span class="scrollText">Read More</span>
            <div class="scrollIcon"></div>
        </div>
    </div> 

    <div id="about" bind:this={aboutSectionElement}>
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
                        <div class="ourProgress nonMobile">
                            <p class="title font1">Development Progress</p>
                            <p class="description">Our development is split into two parts: The hardware and the website. The website has been in development since October 2023. The hardware has been a bit slower to develop due to more research being needed and budget contraints but it will become reality shortly. Hover the images to read more details (click & drag to slide).</p>
                        </div>
                        {#if images}
                        {#each images as image, index}
                            <div draggable="false" class="image" bind:this={imageElements[index]} style={`background: url("images/${image.imageURL}"); background-size: cover;`}>
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
                                `background: url("images/${image.imageURL}"); 
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
                <section class="ideaContainer">
                    <div class="idea">
                        <p class="title font1">Our Idea</p>
                        <p class="description">We are creating an easy to use device that reminds users to water their plants with audio and digital notifications. You as the user will be able to see all the details about your plants and their moisture to make sure they live as long as possible. Custom reminders and intervals can also be set to gain more control over notifications</p>
                    </div>
                    <div class="people nonMobile">
                        <p class="title font1">Who We Are</p>
                        <div class="us">
                            {#each members as member}
                                <div class="person">
                                    <div class="portrait">
                                        <div class="portrait" 
                                            style="background: url('{member.image}');
                                            background-position: 50 50;
                                            background-size: cover;
                                            background-repeat: no-repeat;">
                                        </div>
                                    </div>
                                    <div>
                                        <p>
                                            <span class="name">{member.name} &Tab;&nbsp;</span>
                                            <span class="role">{member.role}</span>
                                        </p>
                                        <p class="text">{member.text}</p>
                                    </div>
                                </div>
                            {/each}
                        </div>    
                    </div>
                    <div class="future">
                        <p class="title font1">The Future Ahead</p>
                        <p class="description">Every day we are continuing to develop and improve our systems, both the website and the hardware, to make sure our users get the best product possible. Right now our focus is on the hardware and connecting it to the website to users can see data about their plants whenever and where ever they are.</p>
                    </div>
                </section>
            {/if}
        </div>
        <div class="scrollContainer" on:click={scrollToProducts} aria-hidden="true">
            <span class="scrollText">Our Product</span>
            <div class="scrollIcon"></div>
        </div>
    </div>

    <div id="products" bind:this={productSectionElement}>
        <div></div>
        <div class="highlight">
            <div class="content">
                <div class="flexContainer">
                    <p class="title">Devices for your House Plants</p>
                    <p class="description">Priced at</p>
                    <p class="price"> 
                        <span class="font1">$</span>
                        <span class="font1">TBD</span>
                    </p>
                </div>
            </div>
            <div class="plant"></div>
        </div>
        
        <div class="productContainer nonMobile">
            <p class="title">Our Product</p>
            <div class="product">
                <img src='/images/prodPlaceholder.png' alt='Moisture Sensor'>
                <div class="description">
                    <p class="name">Moisture Sensor</p>
                    <div>
                        <p class="description">Category: Sensor</p>
                        <p class="price font1">$TBD</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="features">
            <p class="title font1 nonMobile">Product Details & Features</p>
            <div>
                <div class="featPoint">
                    <p class="title">Functionality & Purpose</p>
                    <p class="text">Our product is a small device that you as the user can put on the side of you flower pot which outputs moisture data for you to see both on a small display and here on the website.</p>
                </div>
                <div class="featPoint">
                    <p class="title">Use Cases</p>
                    <p class="text">This device can be used both by consumers and by companies. With this product we offer statistical control over your plants which helps them have a longer life and saving you money in the process. This product can also be used in office settings and similar to save your company man hours spent on watering plants when not needed, increasing productivity and decreasing wasted time.</p>
                </div>
                <div class="featPoint">
                    <p class="title">Features</p>
                    {#each [
                        ' - Moisture sensor',
                        ' - Custom reminders',
                        ' - Water low alerts',
                        ' - Easy to understand data'
                    ] as text}
                        <p class="text">{text}</p>
                    {/each}
                </div>
            </div>
        </div>

    </div>

    <div class="footer">
        <div class="flexContent">
            <div class="mediaIcons">
                <a target="_blank" href="mailto:screamingplantuf@gmail.com?subject=Customer Contact" rel="noopener noreferrer" class="mail" title="ScreamingPlantUF@gmail.com"></a>
                <a target="_blank" href="https://github.com/nemoeriksson/UF-website" rel="noopener noreferrer" class="github" title="Github"></a>
                <a target="_blank" href="https://www.instagram.com/screamingplantuf/" rel="noopener noreferrer" class="instagram" title="Instagram"></a>
            </div>
            <div class="links">
                <a target="_blank" href="mailto:screamingplantuf@gmail.com?subject=Customer Contact">Contact Us</a>
                <a href="/login#register">Register</a>
                <a href="#" title="We dont steal data">Privacy Policy</a>
                <a href="#" title="Be reasonable">Terms of Service</a>
            </div>
            <span class="copyright">
                <span>Screaming Plant UF&copy; 2023 - All rights reserved</span>
                <span class="nonMobile">&nbsp;|&nbsp;</span>
                <span>Designed by Nemo Eriksson</span>
            </span>
        </div>
    </div>
</main>