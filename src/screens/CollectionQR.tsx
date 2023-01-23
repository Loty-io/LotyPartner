import React from 'react'
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image, Dimensions, ScrollView } from "react-native";
import CustomText from '../components/CustomText';
import QRCode from 'react-native-qrcode-svg';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import BoldCustomText from '../components/BoldCustomText';

const paddingHorizontal = 10;
const borderRadius = 18;
const screenWidth = Dimensions.get('window').width;

const CollectionQR = ({ navigation, route }: any) => {
    const { collectionName, id, contractAddress, description } = route.params;

    // para prueba const contractAddress: string = "0xB153f3Abb4a2Aecd8A20dda2cC2BBF3E75bcb56f";
    console.log(contractAddress);
    const onPressGoBack = () => {
        navigation.goBack();
    };

    // const QRCode = () => (

    // );

    return (
        <SafeAreaView style={styles.container}>
            <View
                style={{
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    height: 50,
                    width: '100%',
                    paddingHorizontal: 16,
                    borderBottomColor: 'black',
                    borderBottomWidth: 1,
                    flexDirection: 'row',
                }}>
                <TouchableOpacity
                    onPress={onPressGoBack}
                    style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image source={require('../assets/arrow-back.png')} />
                    {/* <CustomText
                        style={{
                            color: '#69F6CC',
                            fontSize: 17,
                            marginLeft: 10,
                            marginTop: 1,
                        }}>
                        Back
                    </CustomText> */}
                </TouchableOpacity>
                <CustomText
                    style={{
                        color: 'white',
                        fontSize: 17,
                    }}>
                    QR Code
                </CustomText>
                <CustomText
                    style={{
                        color: '#1C1C1E',
                        fontSize: 17,
                    }}>
                    a.
                </CustomText>
            </View>
            <ScrollView>
                <View
                    style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingHorizontal,
                        marginTop: 30,
                        marginBottom: 40,
                    }}>
                    <BoldCustomText
                        style={{
                            color: 'white',
                            fontSize: 28,
                            borderBottomColor: 'white', borderBottomWidth: 1
                        }}>
                        {collectionName}
                    </BoldCustomText>
                    <View style={{
                        width: '100%',
                        height: Dimensions.get('window').width - paddingHorizontal * 2,
                        backgroundColor: 'white',
                        borderWidth: 1,
                        borderColor: 'transparent',
                        borderRadius,
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginTop: 40,
                        marginBottom: 40,
                    }}>
                        <QRCode
                            value={contractAddress}
                            ///logo={require('../assets/login-logo.png')}
                            size={Dimensions.get('window').width - paddingHorizontal * 4}
                            backgroundColor="white"
                            logoBorderRadius={8}
                            logoMargin={20}
                        />


                    </View>

                    <CustomText
                        style={{
                            color: 'white',
                            fontSize: 18,
                            textAlign: 'justify'
                        }}>
                        {description}
                    </CustomText>
                </View>

            </ScrollView>

        </SafeAreaView>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1C1C1E',
    },
    centerText: {
        flex: 1,
        fontSize: 18,
        padding: 32,
        color: '#777',
    },
    textBold: {
        fontWeight: '500',
        color: '#000',
    },
    buttonText: {
        fontSize: 21,
        color: 'rgb(0,122,255)',
    },
    buttonTouchable: {
        padding: 16,
    },
});
export default CollectionQR;