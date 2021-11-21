<script lang="ts">
	import ConnectWeb3 from '../components/ConnectWeb3.svelte';
	import Mint from '../components/Mint.svelte';
	import CheckTokenOwnership from '../components/CheckTokenOwnership.svelte';
  import { connectedAddress } from '../stores';
	
	export let date: string;

	// This does nothing, just to remember you can pass
	// props in Svelte like that
	console.log(date)

</script>

<h1 class="home-title">Krakow Blockchain NFT</h1>

<div>
	<ConnectWeb3/>
</div>

{#if $connectedAddress}
<div>
	<Mint/>
</div>
<div>
	<CheckTokenOwnership/>
</div>
{/if}

<style>
  h1.home-title {
		font-size: 3em;
		text-transform: uppercase;
		color: #ff3e00;
		font-weight: 100;
		margin-bottom: 1rem;
	}
	@media only screen and (max-width: 480px) {
    h1.home-title {
      font-size: 2em;
    }
  }
</style>