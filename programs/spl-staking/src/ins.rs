use anchor_lang::prelude::*;
use anchor_spl::{
  associated_token::AssociatedToken,
  token::{TokenAccount, Token, Mint}
};
use crate::state::*;

#[derive(Accounts)]
pub struct InitializeVault<'info> {
  #[account(mut)]
  pub authority: Signer<'info>,

  #[account(
    init,
    payer = authority,
    space = Vault::LEN + 8,
    seeds = [
      b"vault".as_ref(),
    ],
    bump,
  )]
  pub vault: Account<'info, Vault>,

  pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateVault<'info> {
  #[account(mut, address = vault.authority)]
  pub authority: Signer<'info>,

  #[account(
    mut,
    seeds = [
      b"vault".as_ref(),
    ],
    bump = vault.bump,
  )]
  pub vault: Account<'info, Vault>,
}

#[derive(Accounts)]
pub struct Fund<'info> {
  #[account(mut)]
  pub authority: Signer<'info>,

  #[account(
    mut,
    seeds = [
      b"vault".as_ref(),
    ],
    bump = vault.bump,
  )]
  pub vault: Account<'info, Vault>,

  #[account(address = vault.token_mint)]
  pub token_mint: Account<'info, Mint>,

  #[account(
    init_if_needed,
    payer = authority,
    associated_token::authority = vault,
    associated_token::mint = token_mint,
  )]
  pub vault_ata: Account<'info, TokenAccount>,

  #[account(
    mut,
    associated_token::authority = authority,
    associated_token::mint = token_mint,
  )]
  pub authority_ata: Account<'info, TokenAccount>,
  
  pub system_program: Program<'info, System>,

  pub token_program: Program<'info, Token>,

  pub associated_token_program: Program<'info, AssociatedToken>,

  pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct Drain<'info> {
  #[account(mut, address = vault.authority)]
  pub authority: Signer<'info>,

  #[account(
    mut,
    seeds = [
      b"vault".as_ref(),
    ],
    bump = vault.bump,
  )]
  pub vault: Account<'info, Vault>,

  #[account(address = vault.token_mint)]
  pub token_mint: Account<'info, Mint>,

  #[account(
    mut,
    associated_token::authority = vault,
    associated_token::mint = token_mint,
  )]
  pub vault_ata: Account<'info, TokenAccount>,

  #[account(
    mut,
    associated_token::authority = authority,
    associated_token::mint = token_mint,
  )]
  pub authority_ata: Account<'info, TokenAccount>,

  pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct CreateUser<'info> {
  #[account(mut)]
  pub authority: Signer<'info>,

  #[account(
    init,
    payer = authority,
    space = User::LEN + 8,
    seeds = [
      b"user".as_ref(),
      authority.key.as_ref(),
    ],
    bump,
  )]
  pub user: Account<'info, User>,

  pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Stake<'info> {
  #[account(mut, address = user.key)]
  pub staker: Signer<'info>,

  #[account(
    mut,
    seeds = [
      b"vault".as_ref(),
    ],
    bump = vault.bump,
  )]
  pub vault: Account<'info, Vault>,

  #[account(
    mut,
    seeds = [
      b"user".as_ref(),
      staker.key.as_ref(),
    ],
    bump = user.bump,
  )]
  pub user: Account<'info, User>,


  #[account(address = vault.token_mint)]
  pub token_mint: Account<'info, Mint>,

  #[account(
    mut,
    associated_token::authority = vault,
    associated_token::mint = token_mint,
  )]
  pub vault_ata: Account<'info, TokenAccount>,

  #[account(
    mut,
    associated_token::authority = staker,
    associated_token::mint = token_mint,
  )]
  pub staker_ata: Account<'info, TokenAccount>,

  pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct Unstake<'info> {
  #[account(mut, address = user.key)]
  pub staker: Signer<'info>,

  #[account(
    mut,
    seeds = [
      b"vault".as_ref(),
    ],
    bump = vault.bump,
  )]
  pub vault: Account<'info, Vault>,

  #[account(
    mut,
    seeds = [
      b"user".as_ref(),
      staker.key.as_ref(),
    ],
    bump = user.bump,
  )]
  pub user: Account<'info, User>,

  #[account(address = vault.token_mint)]
  pub token_mint: Account<'info, Mint>,

  #[account(
    mut,
    associated_token::authority = vault,
    associated_token::mint = token_mint,
  )]
  pub vault_ata: Account<'info, TokenAccount>,

  #[account(
    mut,
    associated_token::authority = staker,
    associated_token::mint = token_mint,
  )]
  pub staker_ata: Account<'info, TokenAccount>,

  pub token_program: Program<'info, Token>,
}