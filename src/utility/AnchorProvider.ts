import { Connection } from "@solana/web3.js";
import { AnchorProvider, Program, setProvider } from "@project-serum/anchor";
import { IDL } from "../idl/supplychain";
import { PROGRAM_ID } from "../idl/supplychain";

// Function to initialize the program
export const getProgram = async (wallet: any) => {
  // Ensure wallet is connected and its public key is available
  if (!wallet || !wallet.publicKey) {
    throw new Error("Wallet not connected.");
  }

  // Establish a connection to the Solana network (Devnet in this case)
  const connection = new Connection("https://api.devnet.solana.com", "confirmed");

  // Create an Anchor provider using the wallet and connection
  const provider = new AnchorProvider(
    connection,
    {
      publicKey: wallet.publicKey,
      signTransaction: wallet.signTransaction,
      signAllTransactions: wallet.signAllTransactions,
    },
    {
      commitment: "confirmed",
      preflightCommitment: "confirmed",
    }
  );

  // Set the provider globally
  setProvider(provider);

  // Initialize the Program object using the IDL and Program ID
  const program = new Program(IDL, PROGRAM_ID, provider);
  
  return { program, provider, connection };
};

// Function to get all products from the blockchain
export const getAllProducts = async (wallet: any) => {
  try {
    const { program, connection } = await getProgram(wallet);
    
    // Get all accounts of type Product
    const accounts = await connection.getProgramAccounts(PROGRAM_ID);
    
    // Parse the accounts
    const products = [];
    
    for (const account of accounts) {
      try {
        // Try to fetch and decode the account as a Product
        const productData = await program.account.product.fetch(account.pubkey);
        
        products.push({
          address: account.pubkey.toString(),
          id: productData.productId,
          manufacturer: productData.manufacturer.toString(),
          updater: productData.updater.toString(),
          location: productData.location,
          delivered: productData.delivered,
          // Add createdAt and statusLogs for backward compatibility
          createdAt: Date.now(),
          statusLogs: []
        });
      } catch (e) {
        // Skip accounts that aren't Product accounts
        console.log("Not a product account:", account.pubkey.toString());
      }
    }
    
    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};

