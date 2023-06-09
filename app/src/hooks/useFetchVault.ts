import { useState, useEffect, useCallback } from 'react';
import { UserData, VaultData } from 'types';
import useProgram from './useProgram';
import { getUserPda, getVaultPda } from 'libs/utils';
import { useWallet } from '@solana/wallet-adapter-react';
import { getAssociatedTokenAddressSync } from '@solana/spl-token';

const useFetchVault = (reload: {}) => {
  const [vault, setVault] = useState<VaultData>();
  const [user, setUser] = useState<UserData>();
  const [balance, setBalance] = useState(0);
  const program = useProgram();
  const { publicKey } = useWallet();

  const fetchVault = useCallback(async () => {
    if (!program || !publicKey) return;
    try {
      const [vault] = getVaultPda();
      const vaultData = await program.account.vault.fetchNullable(vault);
      setVault(vaultData as VaultData);

      if (vaultData) {
        const ata = getAssociatedTokenAddressSync(vaultData.tokenMint, publicKey);
        const { value: { uiAmount } } = await program.provider.connection.getTokenAccountBalance(ata);
        setBalance(uiAmount || 0);
      }

      const [user] = getUserPda(publicKey);
      const userData = await program.account.user.fetchNullable(user);
      setUser(userData as UserData);
    } catch (error) {
      console.log(error);
    }
  }, [program, publicKey]);

  useEffect(() => {
    fetchVault();
  }, [program, fetchVault, reload]);

  return { vault, user, balance };
};

export default useFetchVault;