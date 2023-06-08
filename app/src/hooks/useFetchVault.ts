import { useState, useEffect, useCallback } from 'react';
import { VaultData } from 'types';
import useProgram from './useProgram';
import { getVaultPda } from 'libs/utils';

const useFetchVault = (reload: {}) => {
    const [vault, setVault] = useState<VaultData>();
    const program = useProgram();

    const fetchVault = useCallback(async () => {
      if (!program) return;
      try {
        const [vault] = getVaultPda();
        const vaultData = await program.account.vault.fetch(vault);
        // @ts-ignore
        setVault(vaultData);
      } catch (error) {
        console.log(error);
      }
    }, [program]);

    useEffect(() => {
        fetchVault();
    }, [program, fetchVault, reload]);
    
    return vault;
};

export default useFetchVault;