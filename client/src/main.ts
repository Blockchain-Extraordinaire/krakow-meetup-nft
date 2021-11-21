import App from './App.svelte';

const app = new App({
	target: document.body,
	props: {
		date: '10 Nov 2021'
	}
})

export default app;