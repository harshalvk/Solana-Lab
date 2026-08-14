use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint::ProgramResult,
    program_error::ProgramError,
    pubkey::Pubkey,
};

use crate::{error::CounterError, state::Counter};

pub fn process(program_id: &Pubkey, accounts: &[AccountInfo]) -> ProgramResult {
    let iter = &mut accounts.iter();
    let counter_account = next_account_info(iter)?;

    if counter_account.owner != program_id {
        return Err(ProgramError::IncorrectProgramId);
    }

    let mut counter = Counter::try_from_slice(&counter_account.data.borrow())?;
    if !counter.is_initialized {
        return Err(CounterError::NotInitialized.into());
    }

    counter.count = counter.count.checked_add(1).ok_or(CounterError::Overflow)?;
    counter.serialize(&mut &mut counter_account.data.borrow_mut()[..])?;

    Ok(())
}
