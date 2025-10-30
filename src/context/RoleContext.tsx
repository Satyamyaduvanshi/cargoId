import React, { createContext, useContext, useState, useEffect } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Program, AnchorProvider, web3 } from '@project-serum/anchor';
import { IDL, PROGRAM_ID } from '../idl/supplychain';

// Define Role type manually since it's not exported from IDL
type Role = "Admin" | "Manufacturer" | "Updater" | "Verifier";

// Hardcoded admin address
const ADMIN_ADDRESS = "F8wFKqeCasALkvJ5tyaJxvvoAeSv94R5DcTfBwR2qp61";

interface RoleContextType {
  role: Role | null;
  isLoading: boolean;
  error: string | null;
  refreshRole: () => Promise<void>;
}

const RoleContext = createContext<RoleContextType>({
  role: null,
  isLoading: false,
  error: null,
  refreshRole: async () => {},
});

export const useRole = () => useContext(RoleContext);

export const RoleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<Role | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { connection } = useConnection();
  const { publicKey, signTransaction, signAllTransactions } = useWallet();

  const fetchRole = async () => {
    if (!publicKey || !signTransaction || !signAllTransactions) {
      setRole(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Check if the connected wallet is the hardcoded admin
      if (publicKey.toString() === ADMIN_ADDRESS) {
        console.log("Hardcoded admin wallet detected. Setting Admin role.");
        setRole("Admin");
        setIsLoading(false);
        return;
      }

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

      // Find the user role PDA
      const [userRolePda] = web3.PublicKey.findProgramAddressSync(
        [Buffer.from('user_role'), publicKey.toBuffer()],
        program.programId
      );

      try {
        // Fetch the user role account
        const userRole = await program.account.userRole.fetch(userRolePda);
        // Convert the role to the correct type
        const roleValue = userRole.role.toString() as Role;
        setRole(roleValue);
      } catch (err) {
        // If account doesn't exist, user has no role
        console.log('No role assigned to user');
        setRole(null);
        setError('No role assigned');
      }
    } catch (err) {
      console.error('Error fetching role:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch role');
      setRole(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRole();
  }, [publicKey, connection]);

  const refreshRole = async () => {
    await fetchRole();
  };

  return (
    <RoleContext.Provider value={{ role, isLoading, error, refreshRole }}>
      {children}
    </RoleContext.Provider>
  );
}; 