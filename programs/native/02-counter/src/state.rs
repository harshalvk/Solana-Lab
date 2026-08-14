use borsh::{BorshDeserialize, BorshSerialize};

#[derive(BorshSerialize, BorshDeserialize, Debug, Clone)]
pub struct Counter {
    pub is_initialized: bool,
    pub count: u64,
}

impl Counter {
    pub const LEN: usize = 1 + 8;
}
