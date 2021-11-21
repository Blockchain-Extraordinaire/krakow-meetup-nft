<script lang="ts">
  import { onMount } from 'svelte';
  import { decimalToHex } from '../utils'
  import settings from '../settings.json';
  import KrakowMeetupAddress from '../contracts/KrakowMeetupAddress.json';
  import { connectedAddress } from '../stores';
  import { addressTokenId } from '../stores';

  let web3: any
  let errorMessage: string = null
  let notificationMessage: string = null
  let success: boolean = false

  onMount(async () => {
    try {
      //@ts-ignore
      web3 = new Web3(window['ethereum'])
    } catch (error) {
      notificationMessage = `Couldn\'t get connected Web3 instance`
      console.log(error)
    }
  })

  async function mint(): Promise<any> {
    console.log("Mint!")
    
    const gasLimit = settings['transactionSettings'].gasLimit
    const gasLimitHex = decimalToHex(gasLimit)
    
    const price = settings['transactionSettings'].price
    const priceHex = decimalToHex(price)

    const contractAddress = KrakowMeetupAddress.contractAddress

    const functionName = "mint()"
    const functionNameHex = web3.eth.abi.encodeFunctionSignature(functionName)

    const functionParams = {
      name: 'mint',
      type: 'function',
      inputs: [{
          type: 'address',
          name: '_to'
      }]
    }
    const functionParamsHex = web3.eth.abi.encodeFunctionCall(functionParams, [$connectedAddress])

    const callParameters = {
      from: $connectedAddress,
      to: contractAddress, // contract address
      value: priceHex,
      gasLimit: gasLimitHex,
      data: functionParamsHex,
    }

    try {
      let txHash = await window['ethereum'].request({method:"eth_sendTransaction", params: [callParameters]})
      notificationMessage = `Transaction success! Hash: ${txHash}`
      success = true
    } catch (error) {
      errorMessage = `Transaction error.`
      notificationMessage = ``
      console.log(error)
    }


  }
</script>

{#if !success && !$addressTokenId}
<button class="btn-cool" on:click={mint}>Mint</button>
{/if}

{#if errorMessage}
<p><small><em>Error: {errorMessage}</em></small></p>
{/if}

{#if notificationMessage}
<p><small><em>Notification: {notificationMessage}</em></small></p>
{/if}