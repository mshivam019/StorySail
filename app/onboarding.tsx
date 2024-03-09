import { View,Text,Button } from "react-native";
import { useUserStore } from "../store";

const Onboarding = () => {
    const { setIsFirstLogin } = useUserStore() as { setIsFirstLogin: (value: boolean) => void };
    return (
        <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
            <Button
                title="Finish onboarding"
                onPress={() => {
                    setIsFirstLogin(false);
                }}
            />
            <Text>Onboarding</Text>
        </View>
    );
};

export default Onboarding;
