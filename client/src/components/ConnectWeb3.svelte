<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import settings from '../settings.json';
  import { connectedAddress } from '../stores';
  import { hexToDecimal } from '../utils'
  
  let web3: any
  let errorMessage: string = null
  let notificationMessage: string = null
  let currentChain: {name: string, id: string | number} = null

  onMount(async () => {
    if (!window['ethereum']) {
      return;
    }
    window['ethereum'].on('accountsChanged', handleAccountsChanged)
    window['ethereum'].on('connect', handleConnect);
    window['ethereum'].on('chainChanged', (chainId) => {
      console.log(chainId)
      window.location.reload()
    })

    // Get connected accounts to update the UI
    try {
      const accounts = await window['ethereum'].request({ method: 'eth_accounts' })
      if (accounts && accounts.length) {
        // connectedAddress = accounts[0]
        connectedAddress.set(accounts[0])
      }
    } catch (error) {
      console.log(error)
      errorMessage = `Couldn't retrieve account`
    }

    // Get current chainId
    try {
      const chainId = await window['ethereum'].request({ method: 'eth_chainId' })
      handleChainEnabled(chainId)
    } catch (error) {
      console.log(error)
      errorMessage = `Couldn\'t retrieve chain ID`
    }
	})

  onDestroy(() => {
    window['ethereum'].removeListener('accountsChanged', handleAccountsChanged)
    window['ethereum'].removeListener('chainChanged', handleAccountsChanged)
	})

	async function connectMetaMask(): Promise<void> {
    if (window['ethereum']) {
      try {
        const accounts = await window['ethereum'].request({ method: 'eth_requestAccounts' })
      } catch (error) {
        console.log(error)
        errorMessage = `Couldn\'t get connected address`
      }
     
    }
  }

  function handleAccountsChanged(accounts) {
    if (accounts.length > 0) {
      // connectedAddress = accounts[0]
      connectedAddress.set(accounts[0])
    } else {
      // connectedAddress = null
      connectedAddress.set(null)
    }
  }

  function handleConnect(connectInfo) {
    //@ts-ignore
    web3 = new Web3(window['ethereum'])
  }

  function handleChainEnabled(chainIdHex) {
    const chainId = hexToDecimal(chainIdHex)
    const found = settings.acceptedChainsHex.filter(item => {
      const itemStr = '' + Object.values(item)[0]
      return parseInt(itemStr) == chainId
    })
    if (found.length) {
      const name = Object.keys(found[0])[0]
      const id = Object.values(found[0])[0]
      currentChain = {name, id}
    } else {
      let acceptedChains = ''
      for (let index = 0; index < settings.acceptedChainsHex.length; index++) {
        acceptedChains += Object.keys(settings.acceptedChainsHex[index])[0]
        if (index < settings.acceptedChainsHex.length - 1) {
          acceptedChains += `, `
        }
      }
      notificationMessage = `Please select one from the supported chains: ${acceptedChains}`
    }
  }
</script>

{#if !$connectedAddress}
<button class="btn-cool-alt" on:click={connectMetaMask}>Connect MetaMask</button>
{/if}

{#if $connectedAddress}
<p><small><em>Connected address: {$connectedAddress}</em></small></p>
{/if}

{#if currentChain}
<p><small><em>MetaMask selected chain: {currentChain.name}</em></small></p>
{/if}

{#if errorMessage}
<p><small><em>Error: {errorMessage}</em></small></p>
{/if}

{#if notificationMessage}
<p><small><em>Notification: {notificationMessage}</em></small></p>
{/if}