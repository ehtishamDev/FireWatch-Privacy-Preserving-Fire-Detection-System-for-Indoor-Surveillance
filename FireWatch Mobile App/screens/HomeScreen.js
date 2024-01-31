import React, { useState, useEffect } from "react";
import { Image, View ,StyleSheet,Text} from "react-native";

 const HomeScreen= ({ route }) => {
  const [imageData, setImageData] = useState(null);

  const fetchImage = async (serverIP, port) => {
    try {
      const response = await fetch(`http://${serverIP}:${port}/video_feed`);
      const data = await response.json();

      if (data && data.image) {
        setImageData(data.image);
      }
    } catch (error) {
      console.error("Error fetching image:", error);
    }
  };

  useEffect(() => {
    const { serverIP, port } = route.params || {}; // Default to an empty object if route.params is undefined
    if (serverIP && port) {
      const interval = setInterval(() => fetchImage(serverIP, port), 100); // Fetch image every 100ms
      return () => clearInterval(interval);
    }
  }, [route.params]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home</Text>
      <View style={styles.rectangle}>
        <View >
      {imageData && (
        <Image
          source={{ uri: `data:image/jpeg;base64,${imageData}` }}
          style={{ width: 400, height: 240 , marginLeft:-20,marginTop:40}}
        />
      )}
      </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#37A372",
  },
  rectangle: {
    width: "100%",
    height: "100%",
    padding: 24,
    borderRadius: 35,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  title: {
    alignSelf: "center",
    fontFamily: "Cochin",
    fontSize: 40,
    fontWeight: "600",
    color: "#EFEFEF",
    marginTop: 50,
    marginBottom: 40,
    marginLeft: -20,
  },
  
  
});
export default HomeScreen;