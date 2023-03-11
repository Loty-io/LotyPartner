import {
  ApolloClient,
  concat,
  from,
  HttpLink,
  InMemoryCache,
} from '@apollo/client';
import { getObjectValue, storeObjectValue } from '../helpers/storage';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { LOTY_BACKEND_URL } from '@env';

const httpLink = new HttpLink({ uri: LOTY_BACKEND_URL });

let token: string | undefined;
const withToken = setContext(() => {
  // if you have a cached value, return it immediately
  if (token) return { token };

  return getObjectValue('jwt').then(userToken => {
    token = userToken;
    return { token };
  });
});

const resetToken = onError(({ networkError }) => {
  if (
    networkError &&
    networkError.name === 'ServerError' &&
    networkError.status == 401
  ) {
    token = undefined;
    storeObjectValue('jwt', {});
  }
});

const errorLogger = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors && __DEV__)
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
      ),
    );
  if (networkError && __DEV__)
    console.error(`[Network error]: ${networkError}`);
});

const authFlowLink = withToken.concat(resetToken);

export const apolloClient = new ApolloClient({
  link: from([errorLogger, authFlowLink, httpLink]),
  cache: new InMemoryCache(),
});
