import { PublicKey } from '@solana/web3.js';
import { BN } from '@project-serum/anchor';

export type VaultData = {
  authority: PublicKey,
  tokenMint: PublicKey,
  totalRewardAmount: BN,
  totalStakeAmount: BN,
  dailyPayoutAmount: BN,
  bump: number,
}
