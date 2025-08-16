import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";
import { showToastMessage } from "../common/uiSlice";

export const createReview = createAsyncThunk(
  "reviews/createReview",
  async ({ id, formData }, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.post(`/review/${id}`, formData);
      dispatch(
        showToastMessage({ message: "리뷰 생성 완료!", status: "success" })
      );
      dispatch(getReviewList(id));
      return response.data;
    } catch (error) {
      const errorMessage = error.error || "리뷰 생성 중 오류가 발생했습니다.";
      dispatch(showToastMessage({ message: errorMessage, status: "error" }));
      return rejectWithValue(errorMessage);
    }
  }
);

export const getReviewList = createAsyncThunk(
  "reviews/getReviewList",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/review/${id}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.error);
    }
  }
);

export const updateReview = createAsyncThunk(
  "reviews/updateReview",
  async ({ reviewId, productId, formData }, { dispatch, rejectWithValue }) => {
    try {
      const { content, rate, image } = formData;
      const response = await api.put(`/review/${reviewId}`, {
        content,
        rate,
        image,
      });
      dispatch(
        showToastMessage({ message: "리뷰 수정 완료!", status: "success" })
      );
      dispatch(getReviewList(productId));
      return response.data.data;
    } catch (error) {
      const errorMessage = error.error || "리뷰 수정 중 오류가 발생했습니다.";
      dispatch(showToastMessage({ message: errorMessage, status: "error" }));
      return rejectWithValue(errorMessage);
    }
  }
);

export const deleteReview = createAsyncThunk(
  "reviews/deleteReview",
  async ({ reviewId, productId }, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.delete(`/review/${reviewId}`);
      dispatch(
        showToastMessage({ message: "리뷰 삭제 완료!", status: "success" })
      );
      dispatch(getReviewList(productId));
      return response.data.data;
    } catch (error) {
      const errorMessage = error.error || "리뷰 삭제 중 오류가 발생했습니다.";
      dispatch(showToastMessage({ message: errorMessage, status: "error" }));
      return rejectWithValue(errorMessage);
    }
  }
);

// 슬라이스 생성
const reviewSlice = createSlice({
  name: "reviews",
  initialState: {
    reviewList: [],
    selectedReview: null,
    loading: false,
    error: "",
    success: false,
  },
  reducers: {
    setSelectedReview: (state, action) => {
      state.selectedReview = action.payload;
    },
    clearSelectedReview: (state) => {
      state.selectedReview = null;
    },
    clearError: (state) => {
      state.error = "";
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createReview.pending, (state) => {
        state.loading = true;
      })
      .addCase(createReview.fulfilled, (state) => {
        state.loading = false;
        state.error = "";
        state.success = true;
      })
      .addCase(createReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      .addCase(getReviewList.pending, (state) => {
        state.loading = true;
      })
      .addCase(getReviewList.fulfilled, (state, action) => {
        state.loading = false;
        state.reviewList = action.payload;
        state.error = "";
      })
      .addCase(getReviewList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteReview.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
      })
      .addCase(deleteReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateReview.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateReview.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        state.success = true;
      })
      .addCase(updateReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });
  },
});

export const { setSelectedReview, clearError } = reviewSlice.actions;
export default reviewSlice.reducer;
