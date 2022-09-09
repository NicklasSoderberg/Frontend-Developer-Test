<script lang="ts">
	import { capitalizeFirstLetter } from '../lib/helpers';
    import Settings from './settings.svelte'
    import { onDestroy } from 'svelte'
    import { timer, openModal } from '../stores.js'

    let settings_timeout: number = 0;
    const unsubscribe = timer.subscribe((value: number) => settings_timeout = value)
    onDestroy(unsubscribe)
    timer.set(15000);

	/** @type {import('./$types').PageData} */
	export let data;

    // getNewJoke fetches a new joke from the API and sets the variables along the way. 
	async function getNewJoke() {
		loading = true;
		const uri = category.length > 0 ? '?category=' + category : '';
		const response = await fetch('https://api.chucknorris.io/jokes/random' + uri).then((res) => {
			if (res.status != 200) {
				throw new Error(`expected status 200, got ${res.status}`);
			}
			return res.json();
		}).catch(err => {
            console.log(err)
            return null;
        });
		loading = false;
		if (response && response.value) {
			openBubble = true;
			timerID = setTimeout(() => {
				openBubble = false;
			}, settings_timeout);
			joke = response.value;
		}
	}

    function openSettings() {
        openModal.set(true)
    }

    // Sets the ID for NodeJS.Timeout which sets openBubble = false after 15secs
    let timerID: NodeJS.Timeout;

    // Controls the showings of the loading animation -> ***, loading = true also hide the button/select
	let loading = false;

    // Two-way binded variable with categories <select>
	let category = '';

    // Categories from the api
    let categories: string[] = [];
    if (data.categories) {
        categories = data.categories;
    }

    // Variable holding the latest fetched joke.
	let joke = '';

    // Controls the showings of the bubble + bubbletext(joke variable), openBubble = true will also hide the button/select
	let openBubble = false;
</script>

<div class="container">
	<div class="hero--container">
		<img
			class="hero--image"
			src="https://img.icons8.com/plasticine/400/chuck-norris.png"
			alt="Chuck Norris head cartoon"
			title="Chuck Norris"
		/>
        <img
			class="bubble"
			class:show={openBubble}
			src="https://static.vecteezy.com/system/resources/previews/001/195/458/original/speech-bubble-png.png"
			alt="Talkbubble for Chuck Norris"
			title="Bubble"
		/>
		<p class="bubble--text" class:show={openBubble}>{joke}</p>
	</div>
	<h1 class="title--text">Chuck Norris</h1>
	<div class="generate--container">
        {#if loading}
        <div>
            <p>Fetching new joke..</p>
            <div class="loader"/>
        </div>
        {/if}

        <!-- If the bubble is rendered, show shut up button. -->
        {#if openBubble}
            <button class="bubble--btn--reset" on:click={() => {clearTimeout(timerID); openBubble = false}}>Shut up! New joke!</button>
        {/if}

        <!-- 
            Use case: Renders <Select ~categories> & new joke button
            
            Renders if all conditions match,
            1. Bubble not showing(openBubble === false)
            2. Not currently fetching from API(loading === false)
            3. Our categories[string] is populated with categories
         -->
        {#if !openBubble && !loading && categories.length > 0}
		<select bind:value={category}>
			<option selected value="">All</option>
			{#each categories as data_category}
				<option value={data_category}> {capitalizeFirstLetter(data_category)} </option>
			{/each}
		</select>
		<button on:click={() => getNewJoke()}>Open new joke</button>
        <button id="settings--btn" on:click={() => openSettings()}>Settings</button>
        {/if}

        <!-- Most likely API is broken as we cannot fetch categories. -->
        {#if categories.length === 0}
            <p>Chuck Norris joke seems to have broken the API..</p>
        {/if}
	</div>
    <Settings />
</div>

<style>
	.container {
		margin: 0 auto;
		width: 400px;
	}

	.title--text {
		text-align: center;
		font-size: 3rem;
		margin-top: 0;
        color: white;
	}

	.hero--image {
		position: relative;
	}

	.hero--container {
		position: relative;
	}

	.hero--container > .show {
		opacity: 1;
		transition: all 200ms ease-in-out;
	}

	.bubble {
		opacity: 0;
		width: 400px;
		position: absolute;
		left: 20rem;
		top: 2rem;
		transform: rotate(40deg);
		z-index: 5;
		transition: all 200ms ease-in-out;
	}

	.bubble--text {
		opacity: 0;
		width: 239px;
        height: 225px;
		position: absolute;
		left: 27rem;
		top: 6rem;
        font-size: 1.3rem;
		transform: rotate(40deg);
		z-index: 10;
		color: black;
		transition: all 200ms ease-in-out;
        overflow-y: auto;
	}

	.generate--container {
		display: flex;
		justify-content: center;
        color: white;
	}

    #settings--btn {
        margin-left: 10px;
    }

	.loader,
	.loader:before,
	.loader:after {
		border-radius: 50%;
		width: 2.5em;
		height: 2.5em;
		-webkit-animation-fill-mode: both;
		animation-fill-mode: both;
		-webkit-animation: load 1.8s infinite ease-in-out;
		animation: load 1.8s infinite ease-in-out;
	}

	.loader {
		color: #ffffff;
		font-size: 10px;
		margin: 8px auto;
		position: relative;
		text-indent: -9999em;
		-webkit-transform: translateZ(0);
		-ms-transform: translateZ(0);
		transform: translateZ(0);
		-webkit-animation-delay: -0.16s;
		animation-delay: -0.16s;
	}

	.loader:before,
	.loader:after {
		content: '';
		position: absolute;
		top: 0;
	}

	.loader:before {
		left: -3.5em;
		-webkit-animation-delay: -0.32s;
		animation-delay: -0.32s;
	}

	.loader:after {
		left: 3.5em;
	}

	@-webkit-keyframes load {
		0%,
		80%,
		100% {
			box-shadow: 0 2.5em 0 -1.3em;
		}
		40% {
			box-shadow: 0 2.5em 0 0;
		}
	}

	@keyframes load {
		0%,
		80%,
		100% {
			box-shadow: 0 2.5em 0 -1.3em;
		}
		40% {
			box-shadow: 0 2.5em 0 0;
		}
	}
</style>
