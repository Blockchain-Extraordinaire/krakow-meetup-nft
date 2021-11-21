<script lang="ts">
  import { onMount } from 'svelte';
  import KrakowMeetupAddress from '../contracts/KrakowMeetupAddress.json';
  import KrakowMeetup from '../contracts/KrakowMeetup.json';
  import { connectedAddress } from '../stores';
  import { addressTokenId } from '../stores';

  let web3: any
  let errorMessage: string = null
  let notificationMessage: string = null

  onMount(async () => {
    try {
      //@ts-ignore
      web3 = new Web3(window['ethereum'])
      checkMyTokens()
    } catch (error) {
      notificationMessage = `Couldn\'t get connected Web3 instance`
      console.log(error)
    }

  })

  async function checkMyTokens(): Promise<any> {
    console.log(`Checking for address ${$connectedAddress}`)

    // 1. Check balance of
    
    //@ts-ignore
    const contract = new web3.eth.Contract(KrakowMeetup['abi'], KrakowMeetupAddress['contractAddress'])
    const result = await contract.methods.balanceOf($connectedAddress).call()

    // 2. Get token ID

    if (result) {
      const tokenIdResult = await contract.methods.tokenOfOwnerByIndex($connectedAddress, 0).call()
      addressTokenId.set(tokenIdResult)
    }
  }

  async function copyToClipboard(value): Promise<any> {
    const textArea = document.getElementById('contract-address-textarea');

    textArea.focus()
    //@ts-ignore
    textArea.select()
    document.execCommand('copy')

    try {
      const result = navigator.clipboard.writeText(value)
      if (result) {
        alert("Copied!")
      }
    } catch (error) {
      console.error('Async: Could not copy text: ', error);
    }



  }
</script>

{#if !$addressTokenId}
<button on:click={checkMyTokens}>Check my token ID</button>
{/if}

{#if $addressTokenId}
<div class="token-id-notification">
  <p><small>Yout token ID:</small></p>
  <h2 class="token-id">{$addressTokenId}</h2>
  <p><small>You can import your NFT in MetaMask mobile app. Use the above token ID and the contract address:</small></p>
  <p><textarea id="contract-address-textarea" rows="2" readonly>{KrakowMeetupAddress['contractAddress']}</textarea></p>
  <p><button on:click={() => copyToClipboard(KrakowMeetupAddress['contractAddress'])}>Copy address</button></p>
</div>
{/if}
