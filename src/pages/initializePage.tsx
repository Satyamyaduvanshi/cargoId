import React, { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Program, AnchorProvider, web3 } from '@project-serum/anchor';
import { useConnection } from '@solana/wallet-adapter-react';
import { IDL, PROGRAM_ID } from '../idl/supplychain';

export const InitializePage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const { connection } = useConnection();
  const { publicKey, signTransaction, signAllTransactions } = useWallet();

  const handleInitialize = async () => {
    if (!publicKey || !signTransaction || !signAllTransactions) {
      setError('Please connect your wallet');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const provider = new AnchorProvider(
        connection,
        {
          publicKey,
          signTransaction,
          signAllTransactions,
        },
        { commitment: 'confirmed' }
      );

      const program = new Program(IDL, PROGRAM_ID, provider);

      // Find the admin authority PDA
      const [adminAuthorityPda] = web3.PublicKey.findProgramAddressSync(
        [Buffer.from('admin_authority')],
        program.programId
      );

      // Initialize the program
      await program.methods
        .initialize()
        .accounts({
          adminAuthority: adminAuthorityPda,
          admin: publicKey,
          systemProgram: web3.SystemProgram.programId,
        })
        .rpc();

      setSuccess('Program initialized successfully! You are now the admin.');
    } catch (err) {
      console.error('Error initializing program:', err);
      setError(err instanceof Error ? err.message : 'Failed to initialize program');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="relative px-4 py-10 bg-white mx-8 md:mx-0 shadow rounded-3xl sm:p-10">
          <div className="max-w-md mx-auto">
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <h1 className="text-2xl font-semibold text-gray-900 mb-8">Initialize Program</h1>
                
                <p className="text-gray-600 mb-4">
                  This will initialize the program and set your wallet as the admin.
                  Only do this once when first setting up the program.
                </p>

                {error && (
                  <div className="text-red-600 text-sm mt-2">{error}</div>
                )}

                {success && (
                  <div className="text-green-600 text-sm mt-2">{success}</div>
                )}

                <button
                  onClick={handleInitialize}
                  disabled={isLoading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {isLoading ? 'Initializing...' : 'Initialize Program'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 