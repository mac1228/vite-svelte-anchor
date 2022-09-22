<script lang="ts">
  import {
    WalletProvider,
    WalletMultiButton,
  } from "@svelte-on-solana/wallet-adapter-ui";
  import {
    AnchorConnectionProvider,
    workSpace,
  } from "@svelte-on-solana/wallet-adapter-anchor";
  import idl from "./idl.json";
  import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
  import { walletStore } from "@svelte-on-solana/wallet-adapter-core";
  import Counter from "./lib/Counter.svelte";
  import { bs58 } from "@project-serum/anchor/dist/cjs/utils/bytes";
  import svelteLogo from "./assets/svelte.svg";

  const localStorageKey = "walletAdapter";
  const network = "https://api.mainnet-beta.solana.com";
  const wallets = [new PhantomWalletAdapter()];

  let raffles: any[] = [];
  let isFetching = false;

  // get all raffles where total prizes are equal to 1
  const getRaffles = async () => {
    isFetching = true;
    const discriminator = 8;
    const creatorPublicKey = 32;
    try {
      const { program } = $workSpace;
      raffles = await program.account.raffle.all([
        {
          memcmp: {
            offset: discriminator + creatorPublicKey,
            bytes: bs58.encode(Buffer.from([0x01])), // base58 encoding of 1
          },
        },
      ]);
      console.log(raffles);
    } catch (error) {
      alert(error);
      console.log(error);
    }
    isFetching = false;
  };
</script>

<WalletProvider {localStorageKey} {wallets} />
<AnchorConnectionProvider {network} {idl} />

<div class="main">
  <div>
    <img src="/vite.svg" class="logo" alt="Vite Logo" />
    <img src={svelteLogo} class="logo svelte" alt="Svelte Logo" />
  </div>
  <Counter />
  <WalletMultiButton />

  {#if $walletStore?.connected}
    <div>My wallet is connected</div>
    <button style="" on:click={getRaffles}
      >{isFetching ? "fetching..." : "fetch draffle raffles"}</button
    >
  {/if}
  {#if raffles.length}
    <div class="title">
      <span
        ><a
          href="https://www.apr.dev/program/dRafA7ymQiLKjR5dmmdZC9RPX4EQUjqYFB3mWokRuDs"
          target="_blank">draffle</a
        ></span
      >
      raffles with total prize equal to 1: {raffles.length}
    </div>
    {#each raffles as raffle (raffle.publicKey.toBase58())}
      <div>{raffle.account.creator.toBase58()}</div>
    {/each}
  {/if}
</div>

<style>
  .main {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .title {
    font-weight: bolder;
    font-size: x-large;
    margin: 20px 0;
  }

  button {
    border: solid black 2px;
    margin-top: 10px;
  }
</style>
