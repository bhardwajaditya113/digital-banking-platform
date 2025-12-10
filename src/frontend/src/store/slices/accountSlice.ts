import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { accountApi } from '../../services/api';

interface Wallet {
  id: string;
  currency: string;
  balance: number;
}

interface Account {
  id: string;
  userId: string;
  accountNumber: string;
  accountType: string;
  currency: string;
  balance: number;
  availableBalance: number;
  isActive: boolean;
  wallets: Wallet[];
}

interface AccountState {
  accounts: Account[];
  selectedAccount: Account | null;
  loading: boolean;
  error: string | null;
}

const initialState: AccountState = {
  accounts: [],
  selectedAccount: null,
  loading: false,
  error: null,
};

export const fetchAccounts = createAsyncThunk(
  'account/fetchAccounts',
  async (userId: string) => {
    const response = await accountApi.getUserAccounts(userId);
    return response.data;
  }
);

export const createAccount = createAsyncThunk(
  'account/createAccount',
  async (data: { accountType: string; currency: string }) => {
    const response = await accountApi.createAccount(data);
    return response.data;
  }
);

const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    selectAccount: (state, action) => {
      state.selectedAccount = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAccounts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAccounts.fulfilled, (state, action) => {
        state.loading = false;
        state.accounts = action.payload;
      })
      .addCase(fetchAccounts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch accounts';
      })
      .addCase(createAccount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAccount.fulfilled, (state, action) => {
        state.loading = false;
        state.accounts.push(action.payload);
      })
      .addCase(createAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create account';
      });
  },
});

export const { selectAccount, clearError } = accountSlice.actions;
export default accountSlice.reducer;


