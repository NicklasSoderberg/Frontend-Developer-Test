<script lang="ts">
    import { onDestroy } from 'svelte'
    import { timer, openModal } from '../../../stores.js'

    let timeout: number = 0;
    const unsubscribe_timer = timer.subscribe((value: number) => timeout = value)
    onDestroy(unsubscribe_timer)

    let open: boolean = false;
    const unsubscribe_openModal = openModal.subscribe((value: boolean) => open = value)
    onDestroy(unsubscribe_openModal)

    timer.set(15000);

    function save() {
        timer.set(timeout)
        openModal.set(false)
    }
</script>

{#if open}
    <div>
        <div class="overlay" on:click={() => openModal.set(false)} />
        <div class="container">
            <div class="setting--wrapper">
                <div class="flex--spacebetween">
                    <label id="settings--label" for="settings--input">Time for bubble timeout(ms): </label>
                    <input bind:value={timeout} id="settings--input" type="text">
                </div>
                <div class="settings--btn--container">
                    <button on:click={() => save()}>Save</button>
                    <button on:click={() => openModal.set(false)}>Cancel</button>
                </div>
            </div>
        </div>
    </div>
{/if}

<style>
    .overlay {
        background-color: rgba(0, 0, 0, 0.5);
        position: fixed;
        height: 100vh;
        width: 100vw;
        left: 0;
        top: 0;
        z-index: 15;
    }

    .container {
        background-color: white;
        padding: 20px;
        width: 370px;
        border-radius: 5px;
        margin: auto;
        z-index: 20;
        position: relative;
    }

    .flex--spacebetween {
        display: flex;
        justify-content: space-between; 
    }

    #settings--label {
        color: black;
        font-size: 1.5rem;
        font-family: 'Times New Roman', Times, serif;
    }

    #settings--input {
        width: 70px;
        font-size: 1.5rem;
    }

    .settings--btn--container {
        display: flex;
        justify-content: center;
        gap: 10px;
        margin-top: 10px;
    }

    .settings--btn--container > button {
        font-size: 1.3rem;
    }
</style>