import React, { useEffect } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';


Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

TaskManager.defineTask(backgroundTask, async () => {
  try {
    
    console.log('Background task executed');   
    await scheduleNotification();
    
    return BackgroundFetch.Result.NewData;
  } catch (error) {
    console.log('Background fetch failed:', error);
    return BackgroundFetch.Result.Failed;
  }
});


const scheduleNotification = async () => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "You've got a new message!",
      body: 'Check your inbox.',
      data: { data: 'Some data' },
    },
    trigger: { seconds: 2},
  });
}

 const backgroundTask = async () => {
  console.log('Background task executed');
  return BackgroundFetch.Result.NewData;
 };


 const registerBackgroundTask = async () => {
    await BackgroundFetch.registerTaskAsync('backgroundTask', 
      {
      minimumInterval: 15 * 60,
      stopOnTerminate: false,
      startOnBoot: true,
    });
    console.log('Background task registered');
  };
  

BackgroundFetch.setMinimumIntervalAsync (15 * 60);

BackgroundFetch.registerTaskAsync('backgroundTask', {
  minimumInterval: 15 * 60,
  stopOnTerminate: false,
  startOnBoot: true,
});

Notifications.addNotificationResponseReceivedListener(response => {
const {data} = response.notification.request.content;
console.log(data);
});


export default function App() {
  useEffect(() => {
  
    const requestPermissions = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission not granted for notifications');
        return;
      }
      console.log('Notification permissions granted!')
    };

    
    const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      const screen = response.notification.request.content.data.screen;
      
      console.log(`Navigate to ${screen}`);
    }
  );
  
    registerBackgroundTask();
    requestPermissions();

    
    return () => {
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, []);

  
  const testNotification = async () => {
    await scheduleNotification();
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <TouchableOpacity
      onPress={testNotification} 
        style={{
          backgroundColor: 'deeppink',
          padding: 20,
          borderRadius: 10,        
        }} 
      >
        <Text style={{color: 'white', fontSize: 16, fontWeight: 'bold'}}>
          Test Notification
        </Text>
      </TouchableOpacity>
    </View>
  );
}
