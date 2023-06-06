import { PublicKey } from '@solana/web3.js';
import idl from 'idl/spl_staking.json';

export const getVaultPda = (
  programId: PublicKey = new PublicKey(idl.metadata.address)
) => {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from("vault"),
    ],
    programId
  );
};

export const getUserPda = (
  user: PublicKey,
  programId: PublicKey = new PublicKey(idl.metadata.address)
) => {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from("user"),
      user.toBuffer()
    ],
    programId
  );
};