<script lang="ts">
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { getAuth } from 'firebase/auth';
	import { onDestroy } from 'svelte';
	import { timer } from '../stores.js';
	import { capitalizeFirstLetter } from '../lib/helpers';

	import SettingsModal from '../lib/components/settings/settingsmodal.svelte';
	import SettingsButton from '../lib/components/settings/settingsbutton.svelte';
	import Logoutbutton from '$lib/components/login/logoutbutton.svelte';
	
	/** @type {import('./$types').PageData} */
	export let data;

	const auth = getAuth();
	if (browser) {
		if (!auth.currentUser) {
			goto('/login');
		}
	};

	let settings_timeout: number = 0;
	const unsubscribe = timer.subscribe((value: number) => (settings_timeout = value));
	onDestroy(unsubscribe);
	timer.set(15000);

	let timerID: NodeJS.Timeout;
	let loading = false;
	let category = '';
	let categories: string[] = [];
	if (data.categories) {
		categories = data.categories;
	}
	let joke = '';
	let openBubble = false;

	function showJoke(newJoke: string) {
		openBubble = true;
		timerID = setTimeout(() => {
			openBubble = false;
		}, settings_timeout);
		joke = newJoke;
	}

	async function getJoke() {
		loading = true;
		const uri = category.length > 0 ? '?category=' + category : '';
		const response = await fetch('https://api.chucknorris.io/jokes/random' + uri)
			.then((res) => {
				if (res.status != 200) {
					throw new Error(`expected status 200, got ${res.status}`);
				}
				return res.json();
			})
			.catch((err) => {
				console.log(err);
				return null;
			});
		loading = false;
		if (response && response.value) {
			showJoke(response.value);
		}
	}
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
				<div class="loader" />
			</div>
		{/if}

		{#if openBubble}
			<button
				class="bubble--btn--reset"
				on:click={() => {
					clearTimeout(timerID);
					openBubble = false;
				}}>Shut up! New joke!</button
			>
		{/if}

		{#if !openBubble && !loading && categories.length > 0}
			<select bind:value={category}>
				<option selected value="">All</option>
				{#each categories as data_category}
					<option value={data_category}> {capitalizeFirstLetter(data_category)} </option>
				{/each}
			</select>
			<button on:click={() => getJoke()}>Open new joke</button>
		{/if}

		{#if categories.length === 0}
			<p>Chuck Norris joke seems to have broken the API..</p>
		{/if}
	</div>

	<SettingsButton />
	<SettingsModal />
	<Logoutbutton />
</div>

<style>
	.container {
		margin: 0 auto;
		height: 100vh;
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

	select {
		width: 100%;
		min-width: 15ch;
		max-width: 30ch;
		border: 1px solid black;
		border-top-left-radius: 0.25em;
		border-bottom-left-radius: 0.25em;
		padding: 0.25em 0.5em;
		font-size: 1rem;
		cursor: pointer;
		line-height: 1.1;
		background-color: #fff;
		background-image: linear-gradient(to top, #f9f9f9, #fff 33%);
	}

	button {
		width: 100%;
		min-width: 15ch;
		max-width: 30ch;
		border: 1px solid black;
		border-top-right-radius: 0.25em;
		border-bottom-right-radius: 0.25em;
		padding: 0.25em 0.5em;
		font-size: 1rem;
		cursor: pointer;
		line-height: 1.1;
		background-color: #fff;
		background-image: linear-gradient(to top, #f9f9f9, #fff 33%);
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
		height: 215px;
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

	.bubble--text::-webkit-scrollbar-track {
		box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
		-webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
		border-radius: 10px;
		background-color: #f5f5f5;
	}

	.bubble--text::-webkit-scrollbar {
		width: 12px;
		background-color: #f5f5f5;
	}

	.bubble--text::-webkit-scrollbar-thumb {
		border-radius: 10px;
		box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
		-webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
		background-color: #adadad;
	}

	.generate--container {
		display: flex;
		justify-content: center;
		color: white;
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
