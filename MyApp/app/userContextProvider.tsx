import { useEffect, useState } from "react";
import UserContext, { UserContextType } from "./user";

export function UserContextProvider({ children }: { children: React.ReactNode }) {
  const [username, setUsername] = useState("guest");
  const [user, setUser] = useState("temp");

  useEffect(() => {
    console.log(user);
  }, [user]);

  const value: UserContextType = {
    username,
    setUsername,
    user,
    setUser,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}
