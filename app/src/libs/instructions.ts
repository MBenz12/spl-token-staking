import { BN, Program } from '@project-serum/anchor';
import { PublicKey, SYSVAR_RENT_PUBKEY, SystemProgram } from '@solana/web3.js';
import { SplStaking } from 'idl/spl_staking';
import { getRewardVaultPda, getUserPda, getVaultPda } from './utils';
import { ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID, getAssociatedTokenAddressSync } from '@solana/spl-token';

export const getInitializeVaultInstruction = async (
  program: Program<SplStaking>,
  authority: PublicKey,
  tokenMint: PublicKey,
  dailyPayoutAmount: BN,
) => {
  const [vault] = getVaultPda();
  const [, rewardBump] = getRewardVaultPda();

  return await program.methods
    .initializeVault(
      tokenMint,
      dailyPayoutAmount,
      rewardBump,
    )
    .accounts({
      authority,
      vault,
      systemProgram: SystemProgram.programId,
    })
    .instruction();
};

export const getUpdateVaultInstruction = async (
  program: Program<SplStaking>,
  authority: PublicKey,
  tokenMint: PublicKey,
  dailyPayoutAmount: BN,
) => {
  const [vault] = getVaultPda();

  return await program.methods
    .updateVault(
      tokenMint,
      dailyPayoutAmount
    )
    .accounts({
      authority,
      vault,
    })
    .instruction();
};

export const getCreateUserInstruction = async (
  program: Program<SplStaking>,
  authority: PublicKey,
) => {
  const [user] = getUserPda(authority);

  return await program.methods
    .createUser()
    .accounts({
      authority,
      user,
      systemProgram: SystemProgram.programId,
    })
    .instruction();
}

export const getFundInstruction = async (
  program: Program<SplStaking>,
  authority: PublicKey,
  tokenMint: PublicKey,
  amount: BN,
) => {
  const [vault] = getVaultPda();
  const [rewardVault] = getRewardVaultPda();
  const vaultAta = getAssociatedTokenAddressSync(tokenMint, vault, true);
  const rewardVaultAta = getAssociatedTokenAddressSync(tokenMint, rewardVault, true);
  const authorityAta = getAssociatedTokenAddressSync(tokenMint, authority);
  return await program.methods
    .fund(amount)
    .accounts({
      authority,
      vault,
      rewardVault,
      tokenMint,
      vaultAta,
      rewardVaultAta,
      authorityAta,
      systemProgram: SystemProgram.programId,
      tokenProgram: TOKEN_PROGRAM_ID,
      associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      rent: SYSVAR_RENT_PUBKEY,
    })
    .instruction();
}

export const getDrainInstruction = async (
  program: Program<SplStaking>,
  authority: PublicKey,
  tokenMint: PublicKey,
  amount: BN,
) => {
  const [vault] = getVaultPda();
  const [rewardVault] = getRewardVaultPda();
  const rewardVaultAta = getAssociatedTokenAddressSync(tokenMint, rewardVault, true);
  const authorityAta = getAssociatedTokenAddressSync(tokenMint, authority);
  return await program.methods
    .drain(amount)
    .accounts({
      authority,
      vault,
      rewardVault,
      tokenMint,
      rewardVaultAta,
      authorityAta,
      tokenProgram: TOKEN_PROGRAM_ID,
    })
    .instruction();
}

export const getStakeInstruction = async (
  program: Program<SplStaking>,
  staker: PublicKey,
  tokenMint: PublicKey,
  amount: BN,
) => {
  const [vault] = getVaultPda();
  const [user] = getUserPda(staker);
  const vaultAta = getAssociatedTokenAddressSync(tokenMint, vault, true);
  const stakerAta = getAssociatedTokenAddressSync(tokenMint, staker);
  return await program.methods
    .stake(amount)
    .accounts({
      staker,
      vault,
      user,
      tokenMint,
      vaultAta,
      stakerAta,
      tokenProgram: TOKEN_PROGRAM_ID,
    })
    .instruction();
}

export const getUnstakeInstruction = async (
  program: Program<SplStaking>,
  staker: PublicKey,
  tokenMint: PublicKey,
  amount: BN,
  isClaim: boolean,
) => {
  const [vault] = getVaultPda();
  const [rewardVault] = getRewardVaultPda();
  const [user] = getUserPda(staker);
  const vaultAta = getAssociatedTokenAddressSync(tokenMint, vault, true);
  const rewardVaultAta = getAssociatedTokenAddressSync(tokenMint, rewardVault, true);
  const stakerAta = getAssociatedTokenAddressSync(tokenMint, staker);
  return await program.methods
    .unstake(amount, isClaim)
    .accounts({
      staker,
      vault,
      rewardVault,
      user,
      tokenMint,
      vaultAta,
      rewardVaultAta,
      stakerAta,
      tokenProgram: TOKEN_PROGRAM_ID,
    })
    .instruction();
}

export const getClosePdaInstruction = async (
  program: Program<SplStaking>,
  authority: PublicKey,
  pda: PublicKey,
) => {
  return await program.methods
    .closePda()
    .accounts({
      signer: authority,
      pda,
      systemProgram: SystemProgram.programId
    })
    .instruction();
}
