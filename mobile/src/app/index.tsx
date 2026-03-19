import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export default function Home() {
  const router = useRouter();

  return (
    <View className="flex-1 items-center justify-center bg-gray-50 p-6">
      <Text className="text-4xl font-bold text-primary mb-2">Eakalaiva</Text>
      <Text className="text-center text-lg text-gray-600 mb-8">
        If you cannot change the college you came from, change what you can prove.
      </Text>
      <TouchableOpacity 
        className="bg-primary px-8 py-4 rounded-xl mb-4 w-full"
        onPress={() => router.push("/(auth)/login")}
      >
        <Text className="text-white text-center font-bold text-lg">Get Started</Text>
      </TouchableOpacity>
    </View>
  );
}
