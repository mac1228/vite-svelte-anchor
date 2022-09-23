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
  import * as bs58 from "bs58";
  import svelteLogo from "./assets/svelte.svg";
  import { Metaplex } from "@metaplex-foundation/js";
  import { web3 } from "@project-serum/anchor";
  import { Buffer } from "buffer";
  window.Buffer = Buffer;

  const localStorageKey = "walletAdapter";
  const network = "https://api.mainnet-beta.solana.com";
  const wallets = [new PhantomWalletAdapter()];

  let raffles: any[] = [];
  let isFetching = false;

  // get metadata for USDC Coin
  const getMetadata = async () => {
    try {
      const { provider } = $workSpace;
      const metaplex = new Metaplex(provider.connection);

      const metadata = await metaplex
        .nfts()
        .findByMint({
          mintAddress: new web3.PublicKey(
            "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
          ),
        })
        .run();

      alert(
        `Token Metadata\n\nName: ${metadata.name}\nSymbol: ${
          metadata.symbol
        }\nMint Address: ${metadata.address.toBase58()}`
      );
      console.log(metadata);
    } catch (error) {
      alert(error);
      console.log(error);
    }
  };

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

  const openSolscan = () => {
    const url =
      "https://solscan.io/token/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";
    window.open(url, "_blank");
  };
</script>

<WalletProvider {localStorageKey} {wallets} />
<AnchorConnectionProvider {network} {idl} />

<div class="flex flex-col items-center space-y-4">
  <div class="flex">
    <img src="/vite.svg" class="logo" alt="Vite Logo" />
    <img src={svelteLogo} class="logo svelte" alt="Svelte Logo" />
  </div>
  <Counter />
  <WalletMultiButton />

  {#if $walletStore?.connected}
    <div>My wallet is connected</div>
    <button
      class="p-2 hover:border-purple-500 focus:outline-purple-800 focus-visible:outline-purple-800 cursor-pointer rounded-lg"
      on:click={getRaffles}
      >{isFetching ? "fetching..." : "fetch draffle raffles"}</button
    >
    <button
      class="p-2 hover:border-purple-500 focus:outline-purple-800 focus-visible:outline-purple-800 cursor-pointer rounded-lg"
      on:click={getMetadata}
      >Get <a
        class="font-bold text-blue-400 hover:text-blue-600"
        href="https://solscan.io/token/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
        on:click|stopPropagation|preventDefault={openSolscan}>USDC</a
      > token metadata</button
    >
  {/if}
  {#if raffles.length}
    <div class="text-xl font-bold">
      <span
        ><a
          class="font-bold text-purple-400 hover:text-purple-600"
          href="https://www.apr.dev/program/dRafA7ymQiLKjR5dmmdZC9RPX4EQUjqYFB3mWokRuDs"
          target="_blank">draffle</a
        ></span
      >
      raffles with total prize equal to 1: {raffles.length}
    </div>
    <div>
      {#each raffles as raffle (raffle.publicKey.toBase58())}
        <div>{raffle.account.creator.toBase58()}</div>
      {/each}
    </div>
  {/if}
</div>

<style global lang="postcss">
  @tailwind base;
  @tailwind components;
  @tailwind utilities;

  button {
    border: solid black 2px;
    margin-top: 10px;
  }
</style>
