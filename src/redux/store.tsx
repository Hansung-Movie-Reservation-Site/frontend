import { configureStore } from "@reduxjs/toolkit";
import movieListSliceReducer from "./redux"; // ✅ 정확한 경로 확인!

const store = configureStore({
  reducer: {
    movieList: movieListSliceReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
