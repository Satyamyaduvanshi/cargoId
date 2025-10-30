import React, { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Program, AnchorProvider, web3 } from '@project-serum/anchor';
import { useConnection } from '@solana/wallet-adapter-react';
import { IDL, PROGRAM_ID } from '../idl/supplychain';

// Map role strings to their enum values
const ROLE_MAP = {
  Admin: 0,
  Manufacturer: 1,
  Updater: 2
};

export const SelfAssignAdminPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const { connection } = useConnection();
  const { publicKey, signTransaction, signAllTransactions } = useWallet();

  const handleSelfAssignAdmin = async () => {
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

      // Find the user role PDA for your own wallet
      const [userRolePda] = web3.PublicKey.findProgramAddressSync(
        [Buffer.from('user_role'), publicKey.toBuffer()],
        program.programId
      );

      // Check if you're the program admin
      try {
        const adminAuthority = await program.account.adminAuthority.fetch(adminAuthorityPda);
        
        if (!adminAuthority.admin.equals(publicKey)) {
          setError('You are not the program admin. Only the admin who initialized the program can use this function.');
          setIsLoading(false);
          return;
        }
        
        console.log('You are the program admin. Proceeding to assign Admin role to yourself.');
        
        // Use type assertion to bypass TypeScript checks for the method signature
        const programMethodsAny = program.methods as any;
        
        // Assign the Admin role to yourself
        await programMethodsAny
          .assignRole(publicKey, ROLE_MAP.Admin)
          .accounts({
            userRole: userRolePda,
            user: publicKey,
            adminAuthority: adminAuthorityPda,
            admin: publicKey,
            systemProgram: web3.SystemProgram.programId,
          })
          .rpc();

        setSuccess('Successfully assigned Admin role to your wallet. You can now access the admin page.');
      } catch (err) {
        console.error('Error checking admin or assigning role:', err);
        setError('Failed to verify admin status or assign role. Make sure you initialized the program with this wallet.');
      }
    } catch (err) {
      console.error('Error:', err);
      setError(err instanceof Error ? err.message : 'Failed to assign admin role');
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
                <h1 className="text-2xl font-semibold text-gray-900 mb-8">Self-Assign Admin Role</h1>
                
                <p className="text-gray-600 mb-4">
                  If you are the program admin (the wallet that initialized the program), 
                  but don't have the Admin role assigned to your wallet, use this page to 
                  assign yourself the Admin role.
                </p>

                {error && (
                  <div className="text-red-600 text-sm mt-2">{error}</div>
                )}

                {success && (
                  <div className="text-green-600 text-sm mt-2">{success}</div>
                )}

                <button
                  onClick={handleSelfAssignAdmin}
                  disabled={isLoading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {isLoading ? 'Assigning...' : 'Assign Admin Role to Myself'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 