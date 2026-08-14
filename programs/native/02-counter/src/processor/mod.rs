mod decrement;
mod increment;
mod initialize;

use solana_program::{account_info::AccountInfo, entrypoint::ProgramResult, pubkey::Pubkey};

use crate::instruction::CounterInstruction;

pub fn process(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    match CounterInstruction::unpack(instruction_data)? {
        CounterInstruction::Initialize { initial_value } => {
            initialize::process(program_id, accounts, initial_value)
        }
        CounterInstruction::Increment => increment::process(program_id, accounts),
        CounterInstruction::Decrement => decrement::process(program_id, accounts),
    }
}
