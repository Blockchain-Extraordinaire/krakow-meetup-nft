<script lang="ts">
	import { TwitterIcon } from 'svelte-feather-icons'
  import KrakowMeetupAddress from '../contracts/KrakowMeetupAddress.json';
</script>

<footer>
  <p class="social">
    <a href="https://twitter.com/BlockchainExtra"><TwitterIcon size="24" /></a>
    <a href="https://www.meetup.com/krakow-blockchain-nft-and-web3-meetup-group/">
      <img class="meetup-icon" src="/img/meetup-logo.png" alt="Metup">
    </a>
  </p>
  <p><span>Contract address: <a class="underline" href="https://polygonscan.com/address/{KrakowMeetupAddress.contractAddress}">{KrakowMeetupAddress.contractAddress}</a></span></p>
  <p><span>© <a class="underline" href="https://blockchainextraordinaire.io/">Blockchain Extraordinaire</a> 2021</span></p>
</footer>

<style>
  a {
    color: white;
  }
  .underline {
    text-decoration: underline;
  }
  footer {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    background-color: #353535;
    color: whitesmoke;
    text-align: center;
  }
  p {
    margin: 0.3rem 0 0;
  }
  .social {
    margin: 0;
  }
  .social a {
    display: inline-block;
    margin: 0 0.2rem;
  }
  span {
    font-size: 0.8rem;
  }
  .meetup-icon {
    max-width: 28px;
  }
</style>