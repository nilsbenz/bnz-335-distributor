import React, {useEffect, useState} from 'react';
import {FlatList, Text} from 'react-native';

import firestore from '@react-native-firebase/firestore';
import {
  ActivityIndicator,
  Appbar,
  Button,
  List,
  TextInput,
} from 'react-native-paper';

const Events = ({navigation}) => {
  const ref = firestore().collection('events');

  const [event, setEvent] = useState('');
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    return ref.onSnapshot(querySnapshot => {
      const list = [];
      querySnapshot.forEach(doc => {
        const {description} = doc.data();
        list.push({
          id: doc.id,
          description,
        });
      });

      setEvents(list);

      if (loading) {
        setLoading(false);
      }
    });
  });

  async function addEvent() {
    await ref.add({
      description: event,
    });
    setEvent('');
  }

  if (loading) {
    return <ActivityIndicator animating={true} />;
  }

  return (
    <>
      <Appbar>
        <Appbar.Content title={'Events'} />
      </Appbar>
      <FlatList
        style={{flex: 1}}
        data={events}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <List.Item
            title={item.description}
            onPress={() => {
              navigation.navigate('Persons');
            }}
            right={props => <List.Icon {...props} icon={'chevron-right'} />}
          />
        )}
      />
      <TextInput label={'New Event'} value={event} onChangeText={setEvent} />
      <Button onPress={() => addEvent()}>Add Event</Button>
    </>
  );
};

export default Events;
