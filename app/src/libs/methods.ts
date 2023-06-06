import { BN, Program } from '@project-serum/anchor';
import { WalletContextState } from '@solana/wallet-adapter-react';
import { PublicKey, Transaction } from '@solana/web3.js';
import { SplStaking } from 'idl/spl_staking';
import { getCreateUserInstruction, getDrainInstruction, getFundInstruction, getInitializeVaultInstruction, getStakeInstruction, getUnstakeInstruction, getUpdateVaultInstruction } from './instructions';

export async function callCreateUser(
  wallet: WalletContextState,
  program: Program<SplStaking>,
) {
  if (!wallet.publicKey) return;
  try {
    const transaction = new Transaction();

    transaction.add(
      await getCreateUserInstruction(program, wallet.publicKey)
    );

    const txSignature = await wallet.sendTransaction(transaction, program.provider.connection, { skipPreflight: true });
    await program.provider.connection.confirmTransaction(txSignature, "confirmed");
    return txSignature;
  } catch (error) {
    console.log(error);
    return;
  }
}

export async function initializeVault(
  wallet: WalletContextState,
  program: Program<SplStaking>,
  tokenMint: PublicKey,
  dailyPayoutAmount: BN,
) {
  if (!wallet.publicKey) return;
  try {
    const transaction = new Transaction();

    transaction.add(
      await getInitializeVaultInstruction(program, wallet.publicKey, tokenMint, dailyPayoutAmount)
    );

    const txSignature = await wallet.sendTransaction(transaction, program.provider.connection, { skipPreflight: true });
    await program.provider.connection.confirmTransaction(txSignature, "confirmed");
    return txSignature;
  } catch (error) {
    console.log(error);
    return;
  }
}

export async function updateVault(
  wallet: WalletContextState,
  program: Program<SplStaking>,
  tokenMint: PublicKey,
  dailyPayoutAmount: BN,
) {
  if (!wallet.publicKey) return;
  try {
    const transaction = new Transaction();

    transaction.add(
      await getUpdateVaultInstruction(program, wallet.publicKey, tokenMint, dailyPayoutAmount)
    );

    const txSignature = await wallet.sendTransaction(transaction, program.provider.connection, { skipPreflight: true });
    await program.provider.connection.confirmTransaction(txSignature, "confirmed");
    return txSignature;
  } catch (error) {
    console.log(error);
    return;
  }
}

export async function fund(
  wallet: WalletContextState,
  program: Program<SplStaking>,
  tokenMint: PublicKey,
  amount: BN,
) {
  if (!wallet.publicKey) return;
  try {
    const transaction = new Transaction();

    transaction.add(
      await getFundInstruction(program, wallet.publicKey, tokenMint, amount)
    );

    const txSignature = await wallet.sendTransaction(transaction, program.provider.connection, { skipPreflight: true });
    await program.provider.connection.confirmTransaction(txSignature, "confirmed");
    return txSignature;
  } catch (error) {
    console.log(error);
    return;
  }
}

export async function drain(
  wallet: WalletContextState,
  program: Program<SplStaking>,
  tokenMint: PublicKey,
  amount: BN,
) {
  if (!wallet.publicKey) return;
  try {
    const transaction = new Transaction();

    transaction.add(
      await getDrainInstruction(program, wallet.publicKey, tokenMint, amount)
    );

    const txSignature = await wallet.sendTransaction(transaction, program.provider.connection, { skipPreflight: true });
    await program.provider.connection.confirmTransaction(txSignature, "confirmed");
    return txSignature;
  } catch (error) {
    console.log(error);
    return;
  }
}

export async function stake(
  wallet: WalletContextState,
  program: Program<SplStaking>,
  tokenMint: PublicKey,
  amount: BN,
) {
  if (!wallet.publicKey) return;
  try {
    const transaction = new Transaction();

    transaction.add(
      await getStakeInstruction(program, wallet.publicKey, tokenMint, amount)
    );

    const txSignature = await wallet.sendTransaction(transaction, program.provider.connection, { skipPreflight: true });
    await program.provider.connection.confirmTransaction(txSignature, "confirmed");
    return txSignature;
  } catch (error) {
    console.log(error);
    return;
  }
}

export async function unstake(
  wallet: WalletContextState,
  program: Program<SplStaking>,
  tokenMint: PublicKey,
  amount: BN,
  isClaim: boolean,
) {
  if (!wallet.publicKey) return;
  try {
    const transaction = new Transaction();

    transaction.add(
      await getUnstakeInstruction(program, wallet.publicKey, tokenMint, amount, isClaim)
    );

    const txSignature = await wallet.sendTransaction(transaction, program.provider.connection, { skipPreflight: true });
    await program.provider.connection.confirmTransaction(txSignature, "confirmed");
    return txSignature;
  } catch (error) {
    console.log(error);
    return;
  }
}