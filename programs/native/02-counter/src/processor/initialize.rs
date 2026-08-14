use borsh::BorshSerialize;
use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint::ProgramResult,
    program::invoke,
    program_error::ProgramError,
    pubkey::Pubkey,
    rent::Rent,
    system_instruction,
    sysvar::Sysvar,
};

use crate::state::Counter;

pub fn process(program_id: &Pubkey, accounts: &[AccountInfo], initial_value: u64) -> ProgramResult {
    let iter = &mut accounts.iter();
    let payer = next_account_info(iter)?;
    let counter_account = next_account_info(iter)?;
    let system_program = next_account_info(iter)?;

    if !payer.is_signer || !counter_account.is_signer {
        return Err(ProgramError::MissingRequiredSignature);
    }

    let space = Counter::LEN;
    let lamports = Rent::get()?.minimum_balance(space);

    invoke(
        &system_instruction::create_account(
            payer.key,
            counter_account.key,
            lamports,
            space as u64,
            program_id,
        ),
        &[
            payer.clone(),
            counter_account.clone(),
            system_program.clone(),
        ],
    )?;

    let counter = Counter {
        is_initialized: true,
        count: initial_value,
    };
    counter.serialize(&mut &mut counter_account.data.borrow_mut()[..])?;

    Ok(())
}
