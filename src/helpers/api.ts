import axios from 'axios';
import {baseUrl} from '../config';
import {getIdToken} from './magic';

const SUCCESS = 'success';

export const getScannedNftCollections = async () => {
  const idToken = await getIdToken();
  const url = `${baseUrl}/scanned-nft-collections?idToken=${idToken}`;

  const response = await axios.get(url);

  const {scannedNftCollections} = response.data;

  return Array.isArray(scannedNftCollections) ? scannedNftCollections : [];
};

export const getNftGromQrCode = async (qrCodeData: string) => {
  const idToken = await getIdToken();
  const url = `${baseUrl}/nft-from-qr-code?qrCodeData=${qrCodeData}&idToken=${idToken}`;

  const response = await axios.get(url);

  const {nft, status, error_message: errorMessage} = response.data;
  const hasError = status !== SUCCESS;

  return {nft, hasError, errorMessage};
};

export const getScannedNfts = async (id: string, contractAddress: string) => {
  const idToken = await getIdToken();
  const url = `${baseUrl}/scanned-nfts?id=${id}&idToken=${idToken}&contractAddress=${contractAddress}`;

  const response = await axios.get(url);

  const {nfts, status, error_message: errorMessage} = response.data;
  const hasError = status !== SUCCESS;

  return {nfts, hasError, errorMessage};
};

export const callCheckInApi = async (qrCodeData: string) => {
  const idToken = await getIdToken();
  const url = `${baseUrl}/check-in`;

  const response = await axios.post(url, {qrCodeData, idToken});

  const {status, error_message: errorMessage} = response.data;
  const hasError = status !== SUCCESS;

  return {hasError, errorMessage};
};

export const addContractAddressApi = async (contractAddress: string) => {
  console.log('InitApi');
  const idToken = await getIdToken();
  console.log(idToken);
  console.log(baseUrl);
  const url = `${baseUrl}/contract-address`;
  console.log(url);
  const response = await axios.post(url, {contractAddress, idToken});
  console.log(response.data);

  const {status, error_message: errorMessage} = response.data;
  const hasError = status !== SUCCESS;

  return {hasError, errorMessage};
};

export const deleteContractAddressApi = async (contractAddress: string) => {
  const idToken = await getIdToken();
  const url = `${baseUrl}/contract-address`;

  const response = await axios.delete(url, {data: {contractAddress, idToken}});

  const {status, error_message: errorMessage} = response.data;
  const hasError = status !== SUCCESS;

  return {hasError, errorMessage};
};
