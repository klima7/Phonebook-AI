import useWebSocket, { ReadyState } from 'react-use-websocket';
import type { Options } from 'react-use-websocket';
import { useAuth } from '../hooks/useAuth';


export function useAuthedWebSocket(
  url: string | (() => Promise<string>),
  options: Options = {},
  shouldConnect: boolean = true
) {
  const { token, isAuthenticated } = useAuth();
  
  // Create the authentication subprotocol
  const authProtocol = token ? `token.${token}` : undefined;
  
  // Combine any user-provided protocols with our auth protocol
  let protocols: string | string[] | undefined = undefined;
  
  if (authProtocol) {
    if (options.protocols) {
      if (Array.isArray(options.protocols)) {
        protocols = [...options.protocols, authProtocol];
      } else {
        protocols = [options.protocols, authProtocol];
      }
    } else {
      protocols = [authProtocol];
    }
  } else {
    protocols = options.protocols;
  }

  protocols = ["authorization", ...(protocols || [])];
  
  // Only connect if authenticated (unless explicitly overridden)
  const shouldConnectWithAuth = shouldConnect && isAuthenticated;
  
  return useWebSocket(url, {
    ...options,
    protocols,
  }, shouldConnectWithAuth);
}

export { ReadyState } from 'react-use-websocket';
