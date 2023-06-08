/* eslint-disable react-hooks/exhaustive-deps */
import { BN } from '@project-serum/anchor';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { TOKEN_MINT } from 'config';
import useProgram from 'hooks/useProgram';
import { drain, fund, initializeVault, updateVault } from 'libs/methods';
import { useEffect, useState } from 'react';
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import useFetchVault from 'hooks/useFetchVault';
import { getMint } from '@solana/spl-token';

export default function Admin() {
  const wallet = useWallet();
  const program = useProgram();
  const [tokenMintAddress, setTokenMintAddress] = useState(TOKEN_MINT);
  const [dailyPayoutAmount, setDailyPayoutAmount] = useState(0);
  const [amount, setAmount] = useState(0);
  const [reload, setReload] = useState({});
  const vault = useFetchVault(reload);
  const { connection } = useConnection();
  const [decimals, setDecimals] = useState(1);

  const fetchMint = async (mint: PublicKey) => {
    const { decimals } = await getMint(connection, mint);
    setDecimals(Math.pow(10, decimals));
  }

  const handleInitializeVault = async () => {
    if (!program) return;

    await initializeVault(wallet, program, new PublicKey(tokenMintAddress), new BN(dailyPayoutAmount * decimals));
    setReload({});
  }

  const handleUpdateVault = async () => {
    if (!program) return;

    await updateVault(wallet, program, new PublicKey(tokenMintAddress), new BN(dailyPayoutAmount * decimals));
    setReload({});
  }

  const handleFund = async () => {
    if (!program || !vault) return;

    await fund(wallet, program, vault.tokenMint, new BN(amount * decimals));
    setReload({});
  }

  const handleDrain = async () => {
    if (!program || !vault) return;

    await drain(wallet, program, vault.tokenMint, new BN(amount * decimals));
    setReload({});
  }

  useEffect(() => {
    const tokenMint = new PublicKey(tokenMintAddress);
    fetchMint(tokenMint);
  }, [tokenMintAddress]);
  
  useEffect(() => {
    if (vault) {
      setTokenMintAddress(vault.tokenMint.toString());
      setDailyPayoutAmount(vault.dailyPayoutAmount.toNumber());
      fetchMint(vault.tokenMint);
    }
  }, [vault]);

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