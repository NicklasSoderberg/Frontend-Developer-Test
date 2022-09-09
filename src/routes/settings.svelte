<script lang="ts">
    import { onDestroy } from 'svelte'
    import { timer, openModal } from '../stores.js'

    let settings_timeout: number = 0;
    let open: boolean = false;

    const unsubscribe_timer = timer.subscribe((value: number) => settings_timeout = value)
    onDestroy(unsubscribe_timer)

    const unsubscribe_openModal = openModal.subscribe((value: boolean) => open = value)
    onDestroy(unsubscribe_openModal)

    timer.set(15000);

    function save() {
        timer.set(settings_timeout)
        openModal.set(false)
    }

    function cancel() {
        openModal.set(false)
    }
</script>

{#if open}
    <div>
        <div class="overlay" on:click={() => cancel()} />
        <div class="container">
            <div class="setting--wrapper">
                <div class="flex--spacebetween">
                    <label id="settings--label" for="settings--input">Time for bubble timeout(ms): </label>
                    <input bind:value={settings_timeout} id="settings--input" type="text">
                </div>
                <div class="settings--btn--container">
                    <button on:click={() => save()}>Save</button>
                    <button on:click={() => cancel()}>Cancel</button>
                </div>
            </div>
        </div>
    </div>
{/if}

<style>
    .overlay {
        background-color: rgba(0, 0, 0, 0.2);
        position: fixed;
        height: 100vh;
        width: 100vw;
        left: 0;
        top: 0;
        z-index: 0;
    }

    .container {
        background-color: rgb(220, 220, 220);
        padding: 10px;
        width: 250px;
        border-radius: 10px;
        margin: auto;
        z-index: 10;
        position: relative;
    }

    .flex--spacebetween {
        display: flex;
        justify-content: space-between; 
    }

    #settings--label {
        color: black;
    }

    #settings--input {
        width: 50px;
    }

    .settings--btn--container {
        display: flex;
        justify-content: center;
        gap: 10px;
        margin-top: 10px;
    }
</style>