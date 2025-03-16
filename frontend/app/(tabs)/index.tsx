import React, { useEffect } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { useAuth } from '@clerk/clerk-expo'
import createAxiosInstance from '@/api'


const Index = () => {
  
  const { getToken, signOut } = useAuth()
  
  const fetchData = async() => {
    const token = await getToken()
    const api = createAxiosInstance(token)
    const res = await api.get('/user/me')
    console.log(res.data)
  }
  
  return (
    <View style={styles.container}>
      <Button title='get info' onPress={() => fetchData()} />
      <Button title='signout' onPress={() => signOut()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});

export default Index;
