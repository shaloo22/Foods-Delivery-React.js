import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../api';

// Fetch all food items from backend
export const fetchFoods = createAsyncThunk(
    'foods/fetchFoods',
    async ({ keyword = '', category = '' }, { rejectWithValue }) => {
        try {
            const { data } = await API.get(`foods?keyword=${keyword}&category=${category}`);

            return data;
        } catch (error) {
            return rejectWithValue(error.response.data.message || error.message);
        }
    }
);

const foodSlice = createSlice({
    name: 'foods',
    initialState: {
        foods: [],
        loading: false,
        error: null,
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchFoods.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchFoods.fulfilled, (state, action) => {
                state.loading = false;
                state.foods = action.payload;
            })
            .addCase(fetchFoods.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default foodSlice.reducer;
