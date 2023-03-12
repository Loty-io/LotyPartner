import React from 'react';
import { Dimensions } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { Card } from 'react-native-paper';

const LotyQRCode = ({ contractAddress }: { contractAddress: string }) => {
  const screenWidth = Dimensions.get('window').width;

  return (
    <Card style={{ padding: 20, margin: 60, backgroundColor: 'white' }}>
      <QRCode
        value={contractAddress}
        enableLinearGradient={true}
        linearGradient={['rgb(144,243,206)', 'rgb(118, 55, 185)']}
        size={Math.min(400, screenWidth - 80 * 2)}
        backgroundColor={'white'}
        quietZone={10}
      />
    </Card>
  );
};

export default LotyQRCode;
