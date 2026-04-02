export interface WithdrawalRecord {
    id: string;
    txid: string;
    block_number: string;
    withdraw_order_id: string;
    timestamp: string;
    amount: string;
    currency: string;
    address: string;
    memo?: string;
    status: 'BCODE' | 'CANCEL' | 'CANCELPEND' | 'DMOVE' | 'DONE' | 'EXTPEND' | 'FAIL' | 'FVERIFY' | 'INVALID' | 'LOCKED' | 'MANUAL' | 'PEND' | 'PROCES' | 'REJECT' | 'REQUEST' | 'REVIEW' | 'SPLITPEND' | 'VERIFY';
    chain: string;
}
