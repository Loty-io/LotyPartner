import { Image, ImageStyle } from "react-native";
import { SvgUri } from "react-native-svg";

type CustomImageInput = {
    image: string,
    style: ImageStyle
}

const CustomImage = ({ image, style }: CustomImageInput) => {
    return (
        image.includes('.svg') ? (
            <SvgUri
                uri={image}
                style={{
                    ...style
                }}
            />
        ) : (
            <Image
                source={{ uri: image }}
                style={{
                    ...style
                }}
            />
        )
    );
};

export default CustomImage;