// Copyright 2018-2020 @paritytech/substrate-connect authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

// eslint-disable-next-line @typescript-eslint/camelcase
import init, { start_client } from '../generated/kusama_cc3/kusama_cc3';
import { LightClient, WasmRpcClient } from '../types';

const name = 'kusama_cc3';
const version = 'v0.7.20';
let client: WasmRpcClient;

/**
 * Create a light client by fetching the WASM blob from an URL.
 */
export function fromUrl(url: string): LightClient {
  return {
    name,
    network: 'Kusama', // Result from RPC system_chain
    async startClient(): Promise<WasmRpcClient> {
      if (client) {
        return client;
      }

      console.log(`Loading light client "${name}-${version}" from ${url}...`);
      await init(url);
      console.log('Successfully loaded WASM, starting client...');

      // Dynamic import, because the JSON is quite big.
      const { default: chainSpec } = await import('./kusama.json');

      client = await start_client(JSON.stringify(chainSpec), 'INFO');

      return client;
    },
    version,
  };
}
