// Função para verificar se o usuário está autenticado
export const isAuthenticated = () => {
  if (typeof window !== "undefined" && window.localStorage) {
    return localStorage.getItem("token") ? true : false;
  }
  return false;
};
