import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { transactionApi } from '../../services/api';

interface Transaction {
  id: string;
  fromAccountId: string;
  toAccountId: string | null;
  transactionType: string;
  amount: number;
  currency: string;
  status: string;
  description: string | null;
  referenceNumber: string | null;
  fee: number | null;
  createdAt: string;
  processedAt: string | null;
}

interface TransactionState {
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
}

const initialState: TransactionState = {
  transactions: [],
  loading: false,
  error: null,
};

export const transfer = createAsyncThunk(
  'transaction/transfer',
  async (data: { fromAccountId: string; toAccountId: string; amount: number; currency: string; description?: string }) => {
    const response = await transactionApi.transfer(data);
    return response.data;
  }
);

export const fetchTransactions = createAsyncThunk(
  'transaction/fetchTransactions',
  async (accountId: string) => {
    const response = await transactionApi.getAccountTransactions(accountId);
    return response.data;
  }
);

const transactionSlice = createSlice({
  name: 'transaction',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(transfer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(transfer.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions.unshift(action.payload);
      })
      .addCase(transfer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Transfer failed';
      })
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = action.payload;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch transactions';
      });
  },
});

export const { clearError } = transactionSlice.actions;
export default transactionSlice.reducer;


