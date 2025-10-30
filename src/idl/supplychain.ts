import { PublicKey } from '@solana/web3.js';

export const PROGRAM_ID = new PublicKey("GTWXVtN4JSHbF4syxcov4chVmod6EKYTFd9yyKmoKqML");

export const IDL = {
  "version": "0.1.0",
  "name": "supplychain",
  "instructions": [
    {
      "name": "initialize",
      "accounts": [
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "registerProduct",
      "accounts": [
        {
          "name": "product",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "manufacturer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "updater",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "productId",
          "type": "string"
        },
        {
          "name": "location",
          "type": "string"
        }
      ]
    },
    {
      "name": "updateProduct",
      "accounts": [
        {
          "name": "product",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "updater",
          "isMut": true,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "location",
          "type": "string"
        },
        {
          "name": "delivered",
          "type": "bool"
        }
      ]
    },
    {
      "name": "verifyProduct",
      "accounts": [
        {
          "name": "product",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "product",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "productId",
            "type": "string"
          },
          {
            "name": "manufacturer",
            "type": "publicKey"
          },
          {
            "name": "updater",
            "type": "publicKey"
          },
          {
            "name": "location",
            "type": "string"
          },
          {
            "name": "delivered",
            "type": "bool"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "UnauthorizedUpdater",
      "msg": "Only the authorized updater can update this product"
    }
  ]
};

export type SupplyChain = typeof IDL;

export default IDL; 