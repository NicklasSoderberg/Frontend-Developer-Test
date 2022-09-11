<script lang="ts">
    import App from "../firebase"
    import {onMount} from 'svelte'
    import {getAuth, onAuthStateChanged } from 'firebase/auth'
    import {goto} from '$app/navigation';

    onMount(() => {
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
            if(!user) {
                goto('/login')
            }
        })
    })

</script>

<div>
    <main>
        <slot />
    </main>
</div>
