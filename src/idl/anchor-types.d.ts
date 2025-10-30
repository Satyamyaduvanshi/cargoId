declare module '@project-serum/anchor' {
  import { AccountInfo, PublicKey } from '@solana/web3.js';

  interface Program {
    account: {
      product: {
        fetch: (publicKey: PublicKey) => Promise<any>;
      };
      adminAuthority: {
        fetch: (publicKey: PublicKey) => Promise<{
          admin: PublicKey;
          bump: number;
        }>;
      };
      userRole: {
        fetch: (publicKey: PublicKey) => Promise<{
          authority: PublicKey;
          role: number;
          bump: number;
        }>;
      };
    };
    methods: {
      initialize: () => {
        accounts: (accounts: any) => { rpc: () => Promise<string> };
      };
      assignRole: (role: number) => {
        accounts: (accounts: any) => { rpc: () => Promise<string> };
      };
      registerProduct: (id: string, createdAt: number) => {
        accounts: (accounts: any) => { rpc: () => Promise<string> };
      };
      addStatusUpdate: (location: string, timestamp: number, metadata: string) => {
        accounts: (accounts: any) => { rpc: () => Promise<string> };
      };
      markDelivered: () => {
        accounts: (accounts: any) => { rpc: () => Promise<string> };
      };
    };
    programId: PublicKey;
  }
} 