import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";
import { showToastMessage } from "../common/uiSlice";

// 비동기 액션 생성
export const getProductList = createAsyncThunk(
  "products/getProductList",
  async (query, { rejectWithValue }) => {
    try {
      const response = await api.get("/product", { params: { ...query } });
      return response.data;
    } catch (error) {
      rejectWithValue(error.error);
    }
  }
);

export const getProductDetail = createAsyncThunk(
  "products/getProductDetail",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/product/${id}`);
      return response.data.data;
    } catch(error) {
      return rejectWithValue(error.error);
    }
  }
);

export const createProduct = createAsyncThunk(
  "products/createProduct",
  async (formData, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.post("/product", formData);
      dispatch(
        showToastMessage({ message: "상품 생성 완료!", status: "success" })
      );
      return response.data.data;
    } catch (error) {
      const errorMessage = error.error || "상품 생성 중 오류가 발생했습니다.";
      dispatch(
        showToastMessage({ message: errorMessage, status: "error" })
      );
      return rejectWithValue(errorMessage);
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async (id, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.delete(`/product/${id}`);
      dispatch(
        showToastMessage({ message: "상품 삭제 완료!", status: "success" })
      );
      dispatch(getProductList({ page: 1 }));
      return response.data.data;
    } catch (error) {
      const errorMessage = error.error || "상품 삭제 중 오류가 발생했습니다.";
      dispatch(
        showToastMessage({ message: errorMessage, status: "error" })
      );
      return rejectWithValue(errorMessage);
    }
  }
);

export const editProduct = createAsyncThunk(
  "products/editProduct",
  async ({ id, ...formData }, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.put(`/product/${id}`, formData);
      dispatch(
        showToastMessage({ message: "상품 수정 완료!", status: "success" })
      );
      dispatch(getProductList({ page: 1 }));
      return response.data.data;
    } catch (error) {
      const errorMessage = error.error || "상품 수정 중 오류가 발생했습니다.";
      dispatch(
        showToastMessage({ message: errorMessage, status: "error" })
      );
      return rejectWithValue(errorMessage);
    }
  }
);

// 슬라이스 생성
const productSlice = createSlice({
  name: "products",
  initialState: {
    productList: [],
    selectedProduct: null,
    loading: false,
    error: "",
    totalPageNum: 1,
    success: false,
  },
  reducers: {
    setSelectedProduct: (state, action) => {
      state.selectedProduct = action.payload;
    },
    setFilteredList: (state, action) => {
      state.filteredList = action.payload;
    },
    clearError: (state) => {
      state.error = "";
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(createProduct.fulfilled, (state) => {
        state.loading = false;
        state.error = "";
        // 상품 생성을 성공? 다이얼로그 닫기
        // 상품 생성을 실패? 다이얼로그 닫지 않고 실패 메세지 보여주기
        state.success = true;
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      .addCase(getProductList.pending, (state) => {
        state.loading = true;
      })
      .addCase(getProductList.fulfilled, (state, action) => {
        state.loading = false;
        state.productList = action.payload.data;
        state.error = "";
        state.totalPageNum = action.payload.totalPageNum;
      })
      .addCase(getProductList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(editProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(editProduct.fulfilled, (state) => {
        state.loading = false;
        state.error = "";
        state.success = true;
      })
      .addCase(editProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteProduct.fulfilled, (state) => {
        state.loading = false;
        state.error = "";
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getProductDetail.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getProductDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        state.selectedProduct = action.payload; 
      })
      .addCase(getProductDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
  },
});

export const { setSelectedProduct, setFilteredList, clearError } =
  productSlice.actions;
export default productSlice.reducer;
