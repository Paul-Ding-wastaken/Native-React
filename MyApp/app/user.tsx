import { createContext } from "react";

export interface UserContextType {
  username: string;
  setUsername: (name: string) => void;
  user: any;
  setUser: (user: any) => void;
}

const UserContext = createContext<UserContextType | null>(null);

export default UserContext;
