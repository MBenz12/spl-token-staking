import { BN } from '@project-serum/anchor';
import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { TOKEN_MINT } from 'config';
import useProgram from 'hooks/useProgram';
import { stake, unstake } from 'libs/methods';
import { useState } from 'react';
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

const tokenMint = new PublicKey(TOKEN_MINT);

export default function Home() {
  const wallet = useWallet();
  const program = useProgram();
  const [amount, setAmount] = useState(0);

  const handleStake = async () => {
    if (!program) return;

    await stake(wallet, program, tokenMint, new BN(amount * 1e9));
  }

  const handleUnstake = async () => {
    if (!program) return;

    await unstake(wallet, program, tokenMint, new BN(amount * 1e9), false);
  }

  const handleClaim = async () => {
    if (!program) return;

    await unstake(wallet, program, tokenMint, new BN(0), true);
  }
  return (
    <div className='flex flex-col gap-2'>
      <WalletMultiButton />
      Amount: <input value={amount} onChange={(e) => setAmount(parseFloat(e.target.value) || 0.0)} type="number" />
      <button onClick={handleStake}>Stake</button>
      <button onClick={handleUnstake}>Unstake</button>
      <button onClick={handleClaim}>Claim</button>

    </div>
  )
}