import { ELocalStorageKeys } from "@/constants/enum";

export function isAuthenticated(): boolean {
  const auth = localStorage.getItem(ELocalStorageKeys.AUTH_STORE);
  if (auth) {
    const { state } = JSON.parse(auth);
    const { authToken } = state;
    return !!authToken;
  }
  return false;
}
