import { Image, View } from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';
import { truncateAddress, truncateStringIfNeeded } from '../../helpers/utils';
import { Collection, CollectionDetail } from './CollectionDetail';

export const CollectionItem = ({
  navigation,
  collection,
}: {
  navigation: any;
  collection: Collection;
}) => {
  const theme = useTheme();

  const showCollectionDetail = async () => {
    navigation.navigate(CollectionDetail.name, { collection });
  };
  return (
    <Card
      contentStyle={{ flexDirection: 'row' }}
      style={{
        backgroundColor: theme.colors.background,
        borderBottomColor: theme.colors.background,
        borderBottomWidth: 1,
        margin: 10,
      }}
      onPress={showCollectionDetail}>
      <Image
        source={{ uri: `${collection.image}` }}
        style={{ width: 102, height: 79, borderRadius: 10 }}
      />
      <View
        style={{
          justifyContent: 'flex-start',
          marginLeft: 10,
          paddingVertical: 5,
        }}>
        <Text variant="titleLarge" style={{ color: theme.colors.surface }}>
          {collection.name || truncateAddress(collection.contractAddress)}
        </Text>
        <Text variant="bodyLarge" style={{ color: theme.colors.outline }}>
          {truncateStringIfNeeded(collection.network || '', 80)}
        </Text>
      </View>
    </Card>
  );
};
