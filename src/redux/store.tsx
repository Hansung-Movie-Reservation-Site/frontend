import { configureStore } from "@reduxjs/toolkit";
import { movieListSlicesReducer, regionListSlicesReducer, theaterListSlicesReducer } from "./redux"; // ✅ 정확한 경로 확인!

const store = configureStore({
  reducer: {
    movieList: movieListSlicesReducer,
    regionList: regionListSlicesReducer,
    theaterList: theaterListSlicesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
