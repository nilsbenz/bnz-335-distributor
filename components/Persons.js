import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Appbar,
  Button,
  FAB,
  List,
  TextInput,
  Dialog,
} from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import {FlatList, StyleSheet} from 'react-native';

const Persons = ({navigation, eventId}) => {
  const ref = firestore().collection('persons');

  const [person, setPerson] = useState('');
  const [loading, setLoading] = useState(true);
  const [persons, setPersons] = useState([]);
  const [isDialogVisible, setIsDialogVisible] = useState(false);

  useEffect(() => {
    return ref.onSnapshot(querySnapshot => {
      const list = [];
      querySnapshot.forEach(doc => {
        const {name, eventId: event} = doc.data();
        if (event === eventId) {
          list.push({
            id: doc.id,
            name,
          });
        }
      });

      setPersons(list);

      if (loading) {
        setLoading(false);
      }
    });
  });

  async function addPerson() {
    await ref.add({
      name: person,
      eventId,
    });
    setPerson('');
    setIsDialogVisible(false);
  }

  if (loading) {
    return (
      <>
        <Appbar.Header>
          <Appbar.BackAction onPress={() => navigation.navigate('Events')} />
          <Appbar.Content title={'Personen'} />
        </Appbar.Header>
        <ActivityIndicator animating={true} style={styles.loading} />
      </>
    );
  }

  return (
    <>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.navigate('Events')} />
        <Appbar.Content title={'Personen'} />
      </Appbar.Header>
      <FlatList
        style={{flex: 1}}
        data={persons}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <List.Item
            title={item.name}
            onPress={() => {
              navigation.navigate('Selector', {
                lastPageIndex: 0,
                eventId,
                primaryEntityType: 'person',
                primaryEntity: item,
              });
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
        <Dialog.Title>Neue Person</Dialog.Title>
        <Dialog.Content>
          <TextInput label={'Name'} value={person} onChangeText={setPerson} />
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={() => setIsDialogVisible(false)}>Abbrechen</Button>
          <Button
            mode={'contained'}
            style={styles.saveButton}
            onPress={() => addPerson()}>
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

export default Persons;
