<script lang="ts">
	import { goto } from '$app/navigation';
	import {
		getAuth,
		signInWithEmailAndPassword,
		createUserWithEmailAndPassword
	} from 'firebase/auth';

	let failed: boolean = false;
	let errorMessage: string = '';
	let tryLogin: boolean = true;

	let email: string;
	let password: string;

	const auth = getAuth();
	async function login() {
		let response;
		if (tryLogin) {
			response = await signInWithEmailAndPassword(auth, email, password)
				.then(() => {
					goto('/');
				})
				.catch((error) => {
					return error.code;
				});
		} else {
			response = await createUserWithEmailAndPassword(auth, email, password)
				.then(() => {
					goto('/');
				})
				.catch((error) => {
					return error.code;
				});
		}
		if (response) {
			failed = response.length > 0;
			errorMessage = response;
		}
	}
</script>

<div class="container">
	<div class="form--container">
		<div class="tabs--container">
			<div on:click={() => (tryLogin = true)} class="tab--container" class:fade={!tryLogin}>
				<span>Login</span>
			</div>
			<div on:click={() => (tryLogin = false)} class="tab--container" class:fade-reg={tryLogin}>
				<span>Register</span>
			</div>
		</div>

		<h1 class="title--text">
			face <br /><span class="highlight">Chuck Norris</span>
		</h1>

		<form on:submit|preventDefault={() => login()}>
			<input bind:value={email} type="email" id="email" autocomplete="email" required placeholder="Email" />
			<input bind:value={password} type="password" id="password" autocomplete="password" required placeholder="*******" />
			{#if tryLogin}
				<button type="submit">Login</button>
			{:else}
				<button type="submit">Register</button>
			{/if}
		</form>

		{#if failed}
			<p id="error--text">{errorMessage}</p>
		{/if}
	</div>
</div>

<style>
	.title--text {
		text-align: center;
		color: black;
		font-family: 'Permanent Marker';
		line-height: 2.5rem;
	}

	.highlight {
		/* background-color: #4c5575; */
		font-size: 4rem;
		margin: 0 50px;
		color: black;
	}

	.container {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100vh;
		margin: auto;
	}

	#error--text {
		color: red;
		text-align: center;
	}

	.form--container {
		background-color: white;
		padding: 0, 1rem;
		border-radius: 5px;
		box-shadow: 9px 10px 15px -3px rgba(0, 0, 0, 0.3);
	}

	.tabs--container {
		grid-template-columns: repeat(2, minmax(0, 1fr));
		display: grid;
	}

	.tab--container {
		background-color: transparent;
		padding: 15px;
		font-size: 1.5rem;
		display: flex;
		justify-content: center;
		cursor: pointer;
	}

	.tab--container > span {
		font-weight: 800;
		color: black;
	}

	.fade {
		background-color: #cecece;
		border-bottom: none;
		border-top-left-radius: 5px;
		border-right: solid 1px black;
		border-bottom: solid 1px black;
		transition: 200ms ease-in-out;
	}

	.fade:hover {
		background-color: #b6b6b6;
	}

	.fade-reg {
		background-color: #cecece;
		border-bottom: none;
		border-top-right-radius: 4px;
		border-left: solid 1px black;
		border-bottom: solid 1px black;
		transition: 200ms ease-in-out;
	}

	.fade-reg:hover {
		background-color: #b6b6b6;
	}

	button {
		width: 50%;
		margin: 30px auto;
		display: block;
		padding: 10px;
		font-size: 1rem;
		font-weight: 600;
	}

	input {
		width: 50%;
		padding: 12px 20px;
		margin: 0 auto;
		display: block;
		border: 1px solid #ccc;
		border-radius: 4px;
		box-sizing: border-box;
		margin-top: 10px;
	}
</style>
