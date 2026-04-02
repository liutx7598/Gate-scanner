export interface CreateSubAccountReq {
    login_name: string;
    remark?: string;
    password?: string;
    email?: string;
}
export interface CreateSubAccountApiKeyReq {
    user_id: number;
    mode?: number;
    name?: string;
    perms?: {
        name?: 'wallet' | 'spot' | 'futures' | 'delivery' | 'earn' | 'options' | 'account' | 'unified' | 'loan';
        read_only?: boolean;
    }[];
    ip_whitelist?: string[];
}
export type UpdateSubAccountApiKeyReq = {
    key: string;
} & CreateSubAccountApiKeyReq;
