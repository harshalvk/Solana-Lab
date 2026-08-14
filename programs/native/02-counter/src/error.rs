use solana_program::program_error::ProgramError;
use thiserror::Error;

#[derive(Error, Debug, Copy, Clone)]
pub enum CounterError {
    #[error("Counter account is not initialized")]
    NotInitialized,
    #[error("Counter overflowed")]
    Overflow,
    #[error("Counter underflowed")]
    Underflow,
}

impl From<CounterError> for ProgramError {
    fn from(e: CounterError) -> Self {
        ProgramError::Custom(e as u32)
    }
}
