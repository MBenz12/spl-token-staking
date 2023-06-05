mod state;
mod ins;

use anchor_lang::prelude::*;
use anchor_spl::token::{Transfer, transfer};

use crate::ins::*;

declare_id!("GfDz6c7PsBK3yFLXAaxmmXsXH1A69j4EFcZ7RUrJMW13");

#[program]
pub mod spl_staking {
    use super::*;

    pub fn initialize_vault(
        ctx: Context<InitializeVault>,
        token_mint: Pubkey,
        daily_payout_amount: u64,
    ) -> Result<()> {
        let vault = &mut ctx.accounts.vault;

        vault.bump = *ctx.bumps.get("vault").unwrap();
        vault.token_mint = token_mint;
        vault.daily_payout_amount = daily_payout_amount;
        vault.authority = ctx.accounts.authority.key();
        vault.total_reward_amount = 0;
        vault.total_staked_amount = 0;

        Ok(())
    }

    pub fn update_vault(
        ctx: Context<UpdateVault>,
        token_mint: Pubkey,
        daily_payout_amount: u64,
    ) -> Result<()> {
        let vault = &mut ctx.accounts.vault;

        vault.token_mint = token_mint;
        vault.daily_payout_amount = daily_payout_amount;
        
        Ok(())
    }

    pub fn create_user(ctx: Context<CreateUser>) -> Result<()> {
        let user = &mut ctx.accounts.user;

        user.key = ctx.accounts.authority.key();
        user.bump = *ctx.bumps.get("user").unwrap();
        user.staked_amount = 0;
        user.earned_amount = 0;

        Ok(())
    }

    pub fn fund(ctx: Context<Fund>, amount: u64) -> Result<()> {
        let vault = &mut ctx.accounts.vault;
        
        vault.total_reward_amount = vault.total_reward_amount.checked_add(amount).unwrap();

        transfer(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                Transfer {
                    from: ctx.accounts.authority_ata.to_account_info(),
                    to: ctx.accounts.vault_ata.to_account_info(),
                    authority: ctx.accounts.authority.to_account_info(),
                },
            ),
            amount,
        )?;
        Ok(())
    }

    pub fn drain(ctx: Context<Drain>, amount: u64) -> Result<()> {
        let vault = &mut ctx.accounts.vault;
        
        vault.total_reward_amount = vault.total_reward_amount.checked_sub(amount).unwrap();
        let bump = vault.bump;
        let seeds = [
            b"vault".as_ref(),
            &[bump]
        ];
        let signer = &[&seeds[..]];

        transfer(
            CpiContext::new_with_signer(
                ctx.accounts.token_program.to_account_info(),
                Transfer {
                    from: ctx.accounts.vault_ata.to_account_info(),
                    to: ctx.accounts.authority_ata.to_account_info(),
                    authority: ctx.accounts.vault.to_account_info(),
                },
                signer,
            ),
            amount,
        )?;
        Ok(())
    }

    pub fn stake(ctx: Context<Stake>, amount: u64) -> Result<()> {
        let vault = &mut ctx.accounts.vault;
        let user = &mut ctx.accounts.user;

        user.update(vault);
        
        vault.total_staked_amount = vault.total_staked_amount.checked_add(amount).unwrap();
        user.staked_amount = user.staked_amount.checked_add(amount).unwrap();

        transfer(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                Transfer {
                    from: ctx.accounts.staker_ata.to_account_info(),
                    to: ctx.accounts.vault_ata.to_account_info(),
                    authority: ctx.accounts.staker.to_account_info(),
                },
            ),
            amount,
        )?;
        Ok(())
    }

    pub fn unstake(ctx: Context<Unstake>, amount: u64, is_claim: bool) -> Result<()> {
        let vault = &mut ctx.accounts.vault;
        let user = &mut ctx.accounts.user;

        user.update(vault);
        let mut amount = amount;
        if is_claim == true {
            amount = user.earned_amount;
            vault.total_reward_amount = vault.total_reward_amount.checked_sub(amount).unwrap();
            user.earned_amount = 0;
        } else {
            vault.total_staked_amount = vault.total_staked_amount.checked_sub(amount).unwrap();
            user.staked_amount = user.staked_amount.checked_sub(amount).unwrap();
        }

        let bump = vault.bump;
        let seeds = [
            b"vault".as_ref(),
            &[bump]
        ];
        let signer = &[&seeds[..]];

        transfer(
            CpiContext::new_with_signer(
                ctx.accounts.token_program.to_account_info(),
                Transfer {
                    from: ctx.accounts.vault_ata.to_account_info(),
                    to: ctx.accounts.staker_ata.to_account_info(),
                    authority: ctx.accounts.vault.to_account_info(),
                },
                signer,
            ),
            amount,
        )?;
        Ok(())
    }
}