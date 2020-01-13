import React, {useEffect, useState} from 'react';
import {FlatList, StyleSheet} from 'react-native';

import firestore from '@react-native-firebase/firestore';
import {
  ActivityIndicator,
  Appbar,
  Button,
  Dialog,
  FAB,
  List,
  TextInput,
} from 'react-native-paper';

const Events = ({navigation}) => {
  const ref = firestore().collection('events');

  const [event, setEvent] = useState('');
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [isDialogVisible, setIsDialogVisible] = useState(false);

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
    setIsDialogVisible(false);
  }

  if (loading) {
    return <ActivityIndicator animating={true} style={styles.loading} />;
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
              navigation.navigate('Navigator');
            }}
            right={props => <List.Icon {...props} icon={'chevron-right'} />}
          />
        )}
      />
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => setIsDialogVisible(true)}
      />
      <Dialog
        visible={isDialogVisible}
        onDismiss={() => setIsDialogVisible(false)}>
        <Dialog.Title>Neuer Event</Dialog.Title>
        <Dialog.Content>
          <TextInput
            label={'Beschreibung'}
            value={event}
            onChangeText={setEvent}
          />
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={() => setIsDialogVisible(false)}>Abbrechen</Button>
          <Button
            mode={'contained'}
            style={styles.saveButton}
            onPress={() => addEvent()}>
            Speichern
          </Button>
        </Dialog.Actions>
      </Dialog>
    </>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  saveButton: {
    marginLeft: 8,
  },
  loading: {
    marginTop: '50%',
  },
});

export default Events;
