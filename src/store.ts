import { configureStore } from "@reduxjs/toolkit";
import accountReducer from "./features/accounts/accountSlice";
import customerReducer from "./features/customers/customerSlice";

const store = configureStore({
    reducer: {
        account: accountReducer,
        customer: customerReducer,
    },
});

export type AppDispatch = typeof store.dispatch;
export type GetState = typeof store.getState;

export default store;
