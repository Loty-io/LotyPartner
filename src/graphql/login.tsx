import { gql } from '@apollo/client';

export const LOGIN = gql`
  mutation login(
    $walletAddress: String
    $loginPlatform: LoginPlatform
    $typeOfLogin: String
    $idToken: String
    $email: String
  ) {
    loginOrSignUp(
      input: {
        walletAddress: $walletAddress
        userType: PARTNER
        loginPlatform: $loginPlatform
        typeOfLogin: $typeOfLogin
        idToken: $idToken
        email: $email
      }
    ) {
      ... on LoginOrSignUpSuccess {
        success
      }
      ... on Error {
        message
        __typename
      }
    }
  }
`;
