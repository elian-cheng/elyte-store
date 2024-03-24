import React, { useState, createContext, useContext, useMemo } from 'react';
import { Role } from 'utils/constants';
import { getUserId, getUserRole } from 'utils/helpers';

interface IAuthContext {
  user: Role | null;
  setUser: React.Dispatch<React.SetStateAction<Role | null>>;
  userId: string | null;
  setUserId: React.Dispatch<React.SetStateAction<string | null>>;
}

export const AuthContext = createContext<IAuthContext>({
  user: null,
  setUser: () => {},
  userId: null,
  setUserId: () => {},
});

export const AuthProvider = (props: { children: React.ReactNode }) => {
  const userRole = getUserRole();
  const userID = getUserId();
  const [user, setUser] = useState<Role | null>(userRole || null);
  const [userId, setUserId] = useState<string | null>(userID || null);

  const userValue = useMemo(
    () => ({ user, setUser, userId, setUserId }),
    [user, userId]
  );

  return (
    <AuthContext.Provider value={userValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
