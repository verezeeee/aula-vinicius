import { createContext, useState } from "react";

//Contexto para que a aplicação tenha acesso aos dados do usuário
export const UserContext = createContext({} as any);

type UserData = {
  id: string;
  token: string;
}

export const UserProvider = ({ children }: 
  { children: React.ReactNode }
) => {
  const [user, setUser] = useState<UserData>({ id: "", token: '' });//Adicionado [user, setUser] para armazenar o token e id do usuário

  return (
    <UserContext.Provider value={
      { user, setUser}
    }>
      {children}
    </UserContext.Provider>
  );
}