<head>
    <link rel="stylesheet" href="/style/login.css">
</head>
<title>Screaming Plant | {capitalize(tab)}</title>

<script lang="ts">
import { browser } from "$app/environment";
import { enhance } from "$app/forms";
import { fly } from "svelte/transition";
let showDropdown = false;

function capitalize(original:string){
    return original[0].toUpperCase() + original.slice(1);
}

function getTab(){
    let tab:string = 'login';
    if (browser){
        let url = window.location.href;
        let splits = url.split('/')
        let ending = splits[splits.length-1].split('#');
        try{
            tab = (ending[1]=='register') ? 'register' : 'login';
        } catch (error) {
            tab = 'login'; 
        }
    }
    return tab;
}

let tab = getTab();

export let form;
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

<div class="container">
    <div class="contentContainer">
        <div class="tabs nonMobile">
            <div class="tab logo nonMobile">
                <span class="font1">&nbsp;Screaming<br>Plant UF</span>
            </div>
            <div class="tab" class:active={tab=='login'} on:click={()=>{tab='login'}} on:keyup={()=>{tab='login'}} aria-hidden='true'>
                <div class="icon"></div>
                <span>Sign In</span>
            </div>
            <div class="tab" class:active={tab=='register'} on:click={()=>{tab='register'}} on:keyup={()=>{tab='register'}} aria-hidden='true'>
                <div class="icon register"></div>
                <span>Register</span>
            </div>
        </div>
        {#if tab == 'login'}
        <div class="formContainer login">
            <p class="title">Sign In</p>
            <p class="description">Welcome back to Screaming Plant UF. Sign in to your account to continue.</p>
            <form autocomplete="off" method="post" action="?/login" use:enhance>
                <div>
                    <div class="inputField">
                        {#if form?.email_login}
                            <span class="error">{form.email_login}</span>
                        {/if}
                        <div class="input">
                            <div class="icon"></div>
                            <input type="text" name="email" placeholder="Email" required>
                        </div>
                    </div>
                    <div class="inputField">
                        {#if form?.pw_login}
                            <span class="error">{form.pw_login}</span>
                        {/if}
                        <div class="input">
                            <div class="icon password"></div>
                            <input type="password" name="password" placeholder="Password" required>
                        </div>
                    </div>
                </div>
                <span class="remember">
                    <input type="checkbox" name="remember" id="remember">
                    <label for="remember">Remember this device</label>
                    <div class="helpIcon nonMobile" title="You wont have to login each time visiting the page for the next 14 days"></div>
                </span>
                <div> 
                    <button type="submit">Sign in</button>
                    <p class="mobileOnly">
                        Or <span on:click={()=>{tab='register'}} on:keyup={()=>{tab='register'}} aria-hidden='true'>register</span> a new account
                    </p> 
                </div>
            </form>
        </div>
        {/if}
        {#if tab == 'register'}
        <div class="formContainer register">
            <p class="title">Create an account</p>
            <p class="description">Already own one of our products? Make an account now for its full potential!</p>
            <form autocomplete="off" method="post" action="?/register" use:enhance>
                <div>
                    <div class="inputField">
                        {#if form?.email_reg}
                            <span class="error">{form.email_reg}</span>
                        {/if}
                        <div class="input">
                            <div class="icon"></div>
                            <input type="text" name="email" placeholder="Email" required>
                        </div>
                    </div>
                    <div class="inputField">
                        {#if form?.pw_reg}
                            <span class="error">{form.pw_reg}</span>
                        {/if}
                        <div class="input">
                            <div class="icon password"></div>
                            <input type="password" name="password" placeholder="Password" required>
                        </div>
                    </div>
                </div>
                <div class="requirements">
                    <p> - 8 Characters long</p>
                    <p> - Lower and uppcase letters</p>
                    <p> - Atleast 1 number</p>
                </div>
                <div> 
                    <button type="submit">Register</button>
                    <p class="mobileOnly">
                        Or <span on:click={()=>{tab='login'}} on:keyup={()=>{tab='register'}} aria-hidden='true'>sign in</span> to existing account
                    </p> 
                </div>
            </form>
        </div>
        {/if}
    </div>
</div>
