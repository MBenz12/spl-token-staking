/* eslint-disable react-hooks/exhaustive-deps */
import { BN } from '@project-serum/anchor';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import useProgram from 'hooks/useProgram';
import { stake, unstake } from 'libs/methods';
import { useEffect, useState } from 'react';
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import useFetchVault from 'hooks/useFetchVault';
import { getMint } from '@solana/spl-token';
import useEarnedReward from 'hooks/useEarnedReward';
import { UserData, VaultData } from 'types';

export default function Home() {
  const wallet = useWallet();
  const { connection } = useConnection();
  const program = useProgram();
  const [amount, setAmount] = useState(0);
  const [reload, setReload] = useState({});
  const { vault, user, balance } = useFetchVault(reload);
  const [decimals, setDecimals] = useState(1);
  const fetchMint = async (mint: PublicKey) => {
    const { decimals } = await getMint(connection, mint);
    setDecimals(Math.pow(10, decimals));
  }


  const handleStake = async () => {
    if (!program || !vault) return;

    await stake(wallet, program, vault.tokenMint, new BN(amount * decimals));
    setReload({});
  }

  const handleUnstake = async () => {
    if (!program || !vault) return;

    await unstake(wallet, program, vault.tokenMint, new BN(amount * decimals), false);
  }

  const handleClaim = async () => {
    if (!program || !vault) return;

    await unstake(wallet, program, vault.tokenMint, new BN(0), true);
  }

  useEffect(() => {
    if (vault) {
      fetchMint(vault.tokenMint);
    }
  }, [vault]);
  return (
    <div className='flex flex-col gap-2'>
      <WalletMultiButton />
      Amount: <input value={amount} onChange={(e) => setAmount(parseFloat(e.target.value) || 0.0)} type="number" />
      <button onClick={handleStake}>Stake</button>
      <button onClick={handleUnstake}>Unstake</button>
      <button onClick={handleClaim}>Claim</button>
      <div>
        My Token Balance: {balance}
      </div>
      <div>
        Staked Amount: {user ? user.stakedAmount.toNumber() / decimals : 0}
      </div>
      <div>
        APY: {vault ? vault.dailyPayoutAmount.toNumber() * 365 * 100 / vault.totalStakedAmount.toNumber() : 0}%
      </div>
      <div>
        Reward: <Reward user={user} vault={vault} decimals={decimals} />
      </div>
    </div>
  )
}

const Reward = ({ user, vault, decimals }: { user?: UserData, vault?: VaultData, decimals: number }) => {
  const earned = useEarnedReward(user, vault);

  return <>{(earned / decimals).toLocaleString('en-us', { maximumFractionDigits: 4 })}</>;
}