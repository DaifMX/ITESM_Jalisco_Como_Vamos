import { Image, View } from "react-native";

export function Footer() {
  return (
    <View className="bg-white flex flex-row justify-end p-1"
    style={{ }}
    >
      <Image
        source={require('../assets/images/logo2.png')}
        className="m-1"
        style={{ width: 160, height: 65, marginRight: 10}}
        resizeMode="contain"
      />
    </View>
  );
}
