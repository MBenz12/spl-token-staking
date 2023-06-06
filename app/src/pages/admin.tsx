import { BN } from '@project-serum/anchor';
import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { TOKEN_MINT } from 'config';
import useProgram from 'hooks/useProgram';
import { drain, fund, initializeVault, updateVault } from 'libs/methods';
import { useState } from 'react';
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

const tokenMint = new PublicKey(TOKEN_MINT);

export default function Admin() {
  const wallet = useWallet();
  const program = useProgram();
  const [tokenMintAddress, setTokenMintAddress] = useState("");
  const [dailyPayoutAmount, setDailyPayoutAmount] = useState(0);
  const [amount, setAmount] = useState(0);

  const handleInitializeVault = async () => {
    if (!program) return;

    await initializeVault(wallet, program, new PublicKey(tokenMintAddress), new BN(dailyPayoutAmount * 1e9));
  }

  const handleUpdateVault = async () => {
    if (!program) return;

    await updateVault(wallet, program, new PublicKey(tokenMintAddress), new BN(dailyPayoutAmount * 1e9));
  }

  const handleFund = async () => {
    if (!program) return;

    await fund(wallet, program, tokenMint, new BN(amount * 1e9));
  }

  const handleDrain = async () => {
    if (!program) return;

    await drain(wallet, program, tokenMint, new BN(amount * 1e9));
  }
  return (
    <div className='flex flex-col gap-2'>
      <WalletMultiButton />
      Mint: <input value={tokenMintAddress} onChange={(e) => setTokenMintAddress(e.target.value)} type="text" />
      Daily Payout Amount: <input value={dailyPayoutAmount} onChange={(e) => setDailyPayoutAmount(parseFloat(e.target.value) || 0.0)} type="number" />
      <button onClick={handleInitializeVault}>Initialize</button>
      <button onClick={handleUpdateVault}>Update</button>
      Amount: <input value={amount} onChange={(e) => setAmount(parseFloat(e.target.value) || 0.0)} type="number" />
      <button onClick={handleFund}>Fund</button>
      <button onClick={handleDrain}>Drain</button>
    </div>
  )
}