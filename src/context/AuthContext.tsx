import { createContext, useEffect, useReducer } from "react";
import { projectAuth } from "../firebase/config";
import { IUser } from "../instances/IUser";

interface AuthProviderProps {
  children: JSX.Element | JSX.Element[];
}

interface IAuthContext {
  user: IUser | null;
  dispatch: React.Dispatch<Action>;
  authIsReady: boolean;
  photoURL: string;
}

interface Action {
  type: string;
  payload?: any;
}

const initialState: IAuthContext = {
  user: null,
  dispatch: () => ({}),
  authIsReady: false,
  photoURL: "",
};

export const AuthContext = createContext<IAuthContext>(null!);
export const authReducer = (state: IAuthContext, action: Action) => {
  switch (action.type) {
    case "LOGIN":
      return { ...state, user: action.payload };
    case "LOGOUT":
      return { ...state, user: null };
    case "AUTH_IS_READY":
      return { ...state, user: action.payload, authIsReady: true };
    default:
      return state;
  }
};

export const AuthContextProvider = ({ children }: AuthProviderProps) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const unsub = projectAuth.onAuthStateChanged((user) => {
      dispatch({ type: "AUTH_IS_READY", payload: user });
      unsub();
    });
  }, []);

  console.log(state);

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};
