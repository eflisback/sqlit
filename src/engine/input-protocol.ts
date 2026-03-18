export const SAB_SIZE = 40976;
export const STATUS_OFFSET = 0; // Int32[2]: [status, promptLen]
export const PROMPT_OFFSET = 8; // Uint8[4096]
export const STDOUT_LEN_OFFSET = 4104; // Int32[1]
export const STDOUT_OFFSET = 4108; // Uint8[32768]
export const RESP_LEN_OFFSET = 36876; // Int32[1]
export const RESP_OFFSET = 36880; // Uint8[4096]
