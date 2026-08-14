use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::program_error::ProgramError;

#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub enum CounterInstruction {
    /// accounts: [payer (signer, writable), counter (signer, writable), system_program]
    Initialize { initial_value: u64 },
    /// accounts: [counter (writable)]
    Increment,
    /// accounts: [counter (writable)]
    Decrement,
}

impl CounterInstruction {
    pub fn unpack(input: &[u8]) -> Result<Self, ProgramError> {
        CounterInstruction::try_from_slice(input).map_err(|_| ProgramError::InvalidInstructionData)
    }
}
