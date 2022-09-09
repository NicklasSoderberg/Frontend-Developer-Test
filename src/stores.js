import { writable } from 'svelte/store'

export const timer = writable(0)
export const openModal = writable(false)