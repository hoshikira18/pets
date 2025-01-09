import { ThunkAction } from "redux-thunk";
import type { AppDispatch, GetState } from "../../store";
import type { AccountProps } from "../../types/store";

export const initialStateAccount: AccountProps = {
    balance: 2,
    loan: 2,
    loanPurpose: "",
    isLoading: false,
};

type Action =
    | {
          type: "account/deposit";
          payload: {
              amount: number;
          };
      }
    | {
          type: "account/withdraw";
          payload: {
              amount: number;
          };
      }
    | {
          type: "account/requestLoan";
          payload: {
              amount: number;
              purpose: string;
          };
      }
    | {
          type: "account/payLoan";
      }
    | {
          type: "account/convertingCurrency";
      };

const accountReducer = (state: AccountProps, action: Action) => {
    if (!state) return initialStateAccount;
    switch (action.type) {
        case "account/deposit":
            return {
                ...state,
                balance: state.balance + action.payload.amount,
                isLoading: false,
            };
        case "account/withdraw":
            return {
                ...state,
                balance: state.balance - action.payload.amount,
            };
        case "account/requestLoan":
            if (state.loan > 0) return state;
            return {
                ...state,
                loan: action.payload.amount,
                loanPurpose: action.payload.purpose,
            };
        case "account/payLoan":
            if (state.loan > state.balance) {
                alert("Not enough money!");
                return state;
            }
            return {
                ...state,
                loan: 0,
                loanPurpose: "",
                balance: state.balance - state.loan,
            };
        case "account/convertingCurrency":
            return {
                ...state,
                isLoading: true,
            };
        default:
            return state;
    }
};

// Actions
export const deposit = (amount: number, currency: string) => {
    if (currency === "USD")
        return {
            type: "account/deposit",
            payload: {
                amount,
            },
        };
    return async (dispatch: AppDispatch, getState: GetState) => {
        dispatch({
            type: "account/convertingCurrency",
        });
        // API call
        const res = await fetch(
            `https://api.frankfurter.dev/v1/latest?amount=${amount}&from=${currency}&to=USD`,
        );
        const data = await res.json();
        const converted = data.rates.USD;

        // return action
        dispatch({
            type: "account/deposit",
            payload: {
                amount: converted,
            },
        });
    };
};

export const withdraw = (amount: number) => {
    return {
        type: "account/withdraw",
        payload: {
            amount,
        },
    };
};

export const requestLoan = (amount: number, purpose: string) => {
    return {
        type: "account/requestLoan",
        payload: {
            amount,
            purpose,
        },
    };
};

export const payLoan = () => {
    return {
        type: "account/payLoan",
    };
};

export default accountReducer;
