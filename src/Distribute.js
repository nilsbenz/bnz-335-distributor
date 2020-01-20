import React, {useEffect, useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import {ActivityIndicator, Appbar, DataTable, FAB} from 'react-native-paper';
import {StyleSheet} from 'react-native';

const Distribute = ({eventId, navigation}) => {
  const personsRef = firestore().collection('persons');
  const itemsRef = firestore().collection('items');
  const personsItemsRef = firestore().collection('personsItems');

  const [loading, setLoading] = useState(true);

  const [persons, setPersons] = useState([]);
  const [items, setItems] = useState([]);
  const [personsItems, setPersonsItems] = useState([]);
  useEffect(() => {
    if (loading) {
      let personsList = [];
      personsRef.get().then(snapshot => {
        snapshot.docs.forEach(doc => {
          const {name, eventId: event} = doc.data();
          if (event === eventId) {
            personsList.push({
              id: doc.id,
              name,
            });
          }
        });
        setPersons(personsList);
      });
      let itemsList = [];
      itemsRef.get().then(snapshot => {
        snapshot.docs.forEach(doc => {
          const {description, price, eventId: event} = doc.data();
          if (event === eventId) {
            itemsList.push({
              id: doc.id,
              description,
              price,
            });
          }
        });
        setItems(itemsList);
      });
      let personItemsList = [];
      personsItemsRef.get().then(snapshot => {
        snapshot.docs.forEach(doc => {
          const {personId, itemId, amount, eventId: event} = doc.data();
          if (event === eventId) {
            personItemsList.push({
              id: doc.id,
              personId,
              itemId,
              amount,
            });
          }
        });
        setPersonsItems(personItemsList);
      });
    }
    if (loading) {
      setLoading(false);
    }
  }, [loading, personsRef, itemsRef, personsItemsRef, eventId, navigation]);

  const [distributedPersons, setDistributedPersons] = useState([]);
  useEffect(() => {
    let list = [];
    persons.forEach(person => {
      const personsItemsOfPerson = personsItems.filter(
        personItem => personItem.personId === person.id,
      );
      let price = 0;
      personsItemsOfPerson.forEach(x => {
        price += items.find(item => item.id === x.itemId).price * x.amount;
      });
      list.push({
        ...person,
        price,
      });
    });
    setDistributedPersons(list);
  }, [persons, items, personsItems]);

  if (loading) {
    return (
      <>
        <Appbar.Header>
          <Appbar.BackAction onPress={() => navigation.navigate('Events')} />
          <Appbar.Content title={'Aufteilen'} />
        </Appbar.Header>
        <ActivityIndicator animating={true} style={styles.loading} />
      </>
    );
  }

  return (
    <>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.navigate('Events')} />
        <Appbar.Content title={'Aufteilen'} />
      </Appbar.Header>
      <DataTable>
        <DataTable.Header>
          <DataTable.Title>Name</DataTable.Title>
          <DataTable.Title numeric>Kosten</DataTable.Title>
        </DataTable.Header>
      </DataTable>
      {distributedPersons.map(person => (
        <DataTable.Row key={person.id}>
          <DataTable.Cell>{person.name}</DataTable.Cell>
          <DataTable.Cell numeric>
            {(Math.round(Number(person.price) * 100) / 100).toFixed(2) + ' Fr.'}
          </DataTable.Cell>
        </DataTable.Row>
      ))}
      <FAB
        style={styles.fab}
        icon={'reload'}
        onPress={() => setLoading(true)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  loading: {
    marginTop: '50%',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default Distribute;
