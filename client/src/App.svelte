<script lang="ts">
	export let date: string;

	import Footer from './components/Footer.svelte';
	import Header from './components/Header.svelte';
	import Home from './pages/Home.svelte';
</script>

<Header/>
<main>
	<Home date={date} />
</main>
<Footer/>

<style>
	main {
		text-align: center;
		padding: 1em;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		align-items: center;
		flex-grow: 2;
	}
</style>