import { Image, View, Pressable, Linking } from "react-native";

export function Footer() {
  const handleLogoPress = () => {
    Linking.openURL('https://jaliscocomovamos.org/');
  };

  return (
    <View className="bg-white flex flex-row justify-end p-1">
      <Pressable onPress={handleLogoPress} className="active:opacity-70">
        <Image
          source={require('../assets/images/logo2.png')}
          className="m-1"
          style={{ width: 160, height: 65, marginRight: 10}}
          resizeMode="contain"
        />
      </Pressable>
    </View>
  );
}
