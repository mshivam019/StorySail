import {
    View,
    Text,
    TextInput,
    ScrollView,
    Dimensions,
    TouchableOpacity,
  } from "react-native";
  import { useState } from "react";
  
  function CloseIcon({ height=0, color="black" }:{
    height: number,
    color: string
  }) {
    return (
      <View style={{ flexDirection: "row" }}>
        <View
          style={{
            width: 1.5,
            height: height ?? 12,
            backgroundColor: color ?? "white",
            transform: [{ rotate: "45deg" }],
          }}
        />
        <View
          style={{
            width: 1.5,
            height: height ?? 12,
            backgroundColor: color ?? "white",
            marginLeft: -2,
            transform: [{ rotate: "-45deg" }],
          }}
        />
      </View>
    );
  }
  
  function DynamicInput({
    style = {},
    textStyle = {},
    placeholder = "",
    placeHolderTextColor = "",
    set = () => {},
    data = [],
    roundedItem = 0,
    itemColor = "",
    btnHeight = 0,
    btnColor = "",
    backgroundColor = "",
  }:{
    style: any,
    textStyle: any,
    placeholder: string,
    placeHolderTextColor: string,
    set: (value: any) => void,
    data: string[],
    roundedItem: number,
    itemColor: string,
    btnHeight: number,
    btnColor: string,
    backgroundColor: string,
  }) {
    const [input, setInput] = useState("");
  
    if (set === undefined || set === null) {
      throw new Error("set can't be null or undefined");
    } else if (data === undefined || data === null) {
      throw new Error( "data can't be null or undefined");
    }
  
    return (
      <View
        style={{
          backgroundColor: backgroundColor ?? "#ffffff",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 10,
          borderRadius: 0,
          width: "100%",
          height: 56,
          ...style,
        }}
      >
        <ScrollView
          style={{ minWidth: "100%", height: "100%" }}
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          {data?.length > 0 && (
            <View
              style={{
                flexDirection: "row",
                marginEnd: 10,
                alignItems: "center",
              }}
            >
              {data?.map((item) => (
                  <View
                    key={item}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginHorizontal: 5,
                      backgroundColor: itemColor ?? "#333333",
                      borderRadius: roundedItem ?? 10,
                      paddingVertical: 8,
                      paddingHorizontal: 15,
                      marginVertical: 5,
                    }}
                  >
                    <Text style={{ color: "#ffffff", ...textStyle }}>{item}</Text>
                    <TouchableOpacity
                      style={{
                        backgroundColor: "transparent",
                        marginLeft: 10,
                        width: 15,
                        height: 15,
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                      onPress={() => {
                        set((preVal: String[]) => preVal.filter((i) => i !== item));
                      }}
                    >
                      <CloseIcon color={btnColor} height={btnHeight} />
                    </TouchableOpacity>
                  </View>
                ))}
            </View>
          )}
          <TextInput
            value={input}
            style={{
              color: "#000000",
              minWidth: Dimensions.get("window").width / 2,
              height: "100%",
              ...textStyle,
            }}
            placeholder={placeholder}
            placeholderTextColor={placeHolderTextColor ?? "#ffffffa8"}
            onChangeText={(text) => {
              setInput(text);
            }}
            onSubmitEditing={(e) => {
              if (input?.length > 0) {
                set((preVal:String[]) => [...preVal, input]);
                setInput("");
              }
            }}
          />
        </ScrollView>
      </View>
    );
  }
  
  export default DynamicInput;