import axios from 'axios';
import React, { createContext, useReducer, useEffect, ReactNode } from 'react';
import { SyncLoader } from 'react-spinners';

interface AuthState {
  loggedIn: boolean;
  loading: boolean;
  user: UserInfo | null;
}

interface UserInfo {
  username: string;
  fullname: string;
  userID: string;
}

type AuthAction =
  | { type: 'LOGIN'; user: UserInfo }
  | { type: 'LOGOUT' }
  | { type: 'SET_LOADING'; payload: boolean };

export interface AuthContextType {
  authState: AuthState;
  authDispatch: React.Dispatch<AuthAction>;
}

const initialState: AuthState = {
  loggedIn: false,
  loading: true,
  user: null,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        loggedIn: true,
        loading: false,
        user: action.user,
      };
    case 'LOGOUT':
      return {
        ...state,
        loggedIn: false,
        loading: false,
        user: null,
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };
    default:
      return state;
  }
};

export const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const checkLoggedIn = async (): Promise<void> => {
      try {
        const response = await axios({
          url: 'http://localhost:4000/api/v1/user/loggedIn',
          withCredentials: true,
        });

        if (response.status === 200) {
          const user = await response.data.info;
          dispatch({ type: 'LOGIN', user });
        } else {
          dispatch({ type: 'LOGOUT' });
        }
      } catch (error) {
        console.error('Error checking logged-in status:', error);
        dispatch({ type: 'LOGOUT' });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    checkLoggedIn();
  }, []);

  return (
    <AuthContext.Provider value={{ authState: state, authDispatch: dispatch }}>
      {state.loading ? <div className='loading-wrapper'>
        <h3>LOADING</h3>
        <SyncLoader color="#134e9d" />
      </div> : children}
    </AuthContext.Provider>
  );
};
