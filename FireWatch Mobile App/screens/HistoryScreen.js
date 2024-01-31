import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import { Video } from 'expo-av';
import { ref, listAll, getDownloadURL, getMetadata } from "../firebase";
import { storage } from "../firebase";

const HistoryScreen = () => {
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);

  useEffect(() => {
    const getVideoList = async () => {
      try {
        const fireClipsRef = ref(storage, "fire_clips");
        const videoList = await listAll(fireClipsRef);

        const videosInfo = await Promise.all(
          videoList.items.map(async (videoRef) => {
            const url = await getDownloadURL(videoRef);
            const metadata = await getMetadata(videoRef);

            const timestamp = new Date(metadata.timeCreated);
            const date = timestamp.toLocaleDateString();
            const time = timestamp.toLocaleTimeString();

            return {
              url,
              name: metadata.name,
              date,
              time,
              contentType: metadata.contentType,
            };
          })
        );

        setVideos(videosInfo);
      } catch (error) {
        console.error(
          "Error fetching video list from Firebase Storage:",
          error
        );
      }
    };

    getVideoList();
  }, []);

  const playVideo = (video) => {
    setSelectedVideo(video);
  };

  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{item.name}</Text>
      <Text style={styles.cell}>{item.date}</Text>
      <Text style={styles.cell}>{item.time}</Text>
      <TouchableOpacity onPress={() => playVideo(item)}>
        <Text style={styles.button}>View</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>History</Text>
      <View style={styles.rectangle}>
        {selectedVideo ? (
          <View>
            <Video
              source={{ uri: selectedVideo.url }}
              rate={1.0}
              volume={1.0}
              isMuted={false}
              resizeMode="contain"
              shouldPlay
              style={styles.video}
            />
            <TouchableOpacity onPress={() => setSelectedVideo(null)}>
              <Text style={styles.button2}>Close Video</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={videos}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderItem}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#37A372",
    alignItems: "center",
    justifyContent: "center",
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
  rectangle: {
    flex: 1,
    width: "100%",
    padding: 20,
    borderTopLeftRadius: 35,   // Rounded top-left corner
    borderTopRightRadius: 35,
    backgroundColor: "#000000",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
  },
  cell: {
    flex: 1,
    color: '#EFEFEF',
    textAlign: 'center',
  },
  video: {
    width: "100%",
    height: 200,
  },
  button: {
    backgroundColor: "#37A372",
    padding: 10,
    borderRadius: 5,
    color: "#fff",
    textAlign: "center",
  },
  button2: {
    backgroundColor: "#37A372",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    marginLeft: 140,
    color: "#fff",
    width:'25%',
    height:'30%',
    textAlign: "center",
  },
});

export default HistoryScreen;
