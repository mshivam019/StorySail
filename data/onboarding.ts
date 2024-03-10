import { AnimationObject } from "lottie-react-native";

export interface OnboardingData {
	id: number;
	animation: AnimationObject;
	text: string;
	textColor: string;
	backgroundColor: string;
}

const data: OnboardingData[] = [
	{
		id: 1,
		animation: require("../assets/onboarding/onboarding1.json"),
		text: "Welcome to the app",
		textColor: "#F15937",
		backgroundColor: "#faeb8a",
	},
	{
		id: 2,
		animation: require("../assets/onboarding/onboarding2.json"),
		text: "Hope you enjoy it",
		textColor: "#000",
		backgroundColor: "#ffa3ce",
	},
	{
		id: 3,
		animation: require("../assets/onboarding/onboarding3.json"),
		text: "Let's get started!",
		textColor: "#1e2169",
		backgroundColor: "#bae4fd",
	},
];

export default data;
