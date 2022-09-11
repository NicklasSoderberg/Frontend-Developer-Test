<script>
    import { goto } from '$app/navigation';
    import { 
        getAuth, 
        signOut
    } from 'firebase/auth'; 

    const auth = getAuth()
    function signOutUser() {
         signOut(auth).then(() => {
            localStorage.removeItem('uid');
            goto('/login')
         })
    }
</script>

<div id="logout--button" on:click={() => signOutUser()}>
    <svg id="logout--icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
    </svg>
</div>

<style>
    #logout--button {
        position: fixed;
        top: 2rem;
        right: 2rem;
        cursor: pointer;
        z-index: 0;
    }

    #logout--icon {
        width: 50px;
        height: 50px;
        color: white;
        cursor: pointer;
        transition: 200ms ease-in-out;
    }

    #logout--icon:hover {   
        color: gray;
        cursor: pointer;
        transition: 200ms ease-in-out;
    }
</style>
  