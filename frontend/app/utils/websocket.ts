import useWebSocket, { ReadyState } from 'react-use-websocket';
import type { Options } from 'react-use-websocket';
import { useAuth } from '../hooks/useAuth';


export function useAuthedWebSocket(
  url: string | (() => Promise<string>),
  options: Options = {},
  shouldConnect: boolean = true
) {
  const { token, isAuthenticated } = useAuth();
  const protocols = ["authorization", `token.${token}`];

  if (!isAuthenticated) {
    throw new Error("Unable to connect to websocket: Not authenticated");
  }
  
  return useWebSocket(url, {
    ...options,
    protocols,
  }, shouldConnect);
}

export { ReadyState } from 'react-use-websocket';
