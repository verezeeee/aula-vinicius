export const isAuthenticated = () => {
  if (typeof window !== 'undefined' && window.localStorage) {
    return localStorage.getItem('token') ? true : false;
  }
  return false; // Return false or handle accordingly if localStorage is not available
}