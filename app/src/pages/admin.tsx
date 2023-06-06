import { BN } from '@project-serum/anchor';
import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import useProgram from 'hooks/useProgram';
import { initializeVault, updateVault } from 'libs/methods';
import { useState } from 'react';

export default function Admin() {
  const wallet = useWallet();
  const program = useProgram();
  const [tokenMintAddress, setTokenMintAddress] = useState("");
  const [dailyPayoutAmount, setDailyPayoutAmount] = useState(0);

  const handleInitializeVault = async () => {
    if (!program) return;

    await initializeVault(wallet, program, new PublicKey(tokenMintAddress), new BN(dailyPayoutAmount * 1e9));
  }

  const handleUpdateVault = async () => {
    if (!program) return;

    await updateVault(wallet, program, new PublicKey(tokenMintAddress), new BN(dailyPayoutAmount * 1e9));
  }
  return (
    <div>
      Admin
    </div>
  )
}