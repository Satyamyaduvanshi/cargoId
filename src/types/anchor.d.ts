declare module '@project-serum/anchor' {
  export const web3: any;
  export class BN {
    constructor(number: number | string);
    toNumber(): number;
  }
  export class AnchorProvider {
    constructor(connection: any, wallet: any, opts: any);
  }
  export class Program {
    constructor(idl: any, programId: any, provider: any);
    methods: any;
    programId: any;
    account: {
      product: {
        fetch: (publicKey: any) => Promise<any>;
      };
    };
  }
  export function setProvider(provider: AnchorProvider): void;
} 