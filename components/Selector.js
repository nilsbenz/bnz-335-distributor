import React, {useEffect, useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import {
  ActivityIndicator,
  Appbar,
  List,
  IconButton,
  Text,
} from 'react-native-paper';
import {FlatList, StyleSheet, View} from 'react-native';

const Selector = ({navigation}) => {
  const personsRef = firestore().collection('persons');
  const itemsRef = firestore().collection('items');
  const personsItemsRef = firestore().collection('personsItems');

  const [loadingSecondary, setLoadingSecondary] = useState(true);
  const [loadingPersonsItems, setLoadingPersonsItems] = useState(true);
  const [persons, setPersons] = useState([]);
  const [items, setItems] = useState([]);
  const [personsItems, setPersonsItems] = useState([]);

  useEffect(() => {
    return navigation.getParam('primaryEntityType') === 'person'
      ? itemsRef.onSnapshot(querySnapshot => {
          const list = [];
          querySnapshot.forEach(doc => {
            const {description, price, eventId} = doc.data();
            if (eventId === navigation.getParam('eventId')) {
              list.push({
                id: doc.id,
                description,
                price,
              });
            }
          });

          setItems(list);

          if (loadingSecondary) {
            setLoadingSecondary(false);
          }
        })
      : personsRef.onSnapshot(querySnapshot => {
          const list = [];
          querySnapshot.forEach(doc => {
            const {name, eventId} = doc.data();
            if (eventId === navigation.getParam('eventId')) {
              list.push({
                id: doc.id,
                name,
              });
            }
          });

          setPersons(list);

          if (loadingSecondary) {
            setLoadingSecondary(false);
          }
        });
  });

  useEffect(() => {
    return personsItemsRef.onSnapshot(querySnapshot => {
      const list = [];
      querySnapshot.forEach(doc => {
        const {personId, itemId, amount, eventId} = doc.data();
        if (
          eventId === navigation.getParam('eventId') &&
          (navigation.getParam('primaryEntityType') === 'person'
            ? personId === navigation.getParam('primaryEntity').id
            : itemId === navigation.getParam('primaryEntity').id)
        ) {
          list.push({
            id: doc.id,
            personId,
            itemId,
            amount,
          });
        }
      });

      setPersonsItems(list);

      if (loadingPersonsItems) {
        setLoadingPersonsItems(false);
      }
    });
  });

  if (loadingPersonsItems || loadingSecondary) {
    return <ActivityIndicator animating={true} style={styles.loading} />;
  }

  async function setAmount(personItemId, amount, personId, itemId) {
    if (personItemId) {
      await personsItemsRef.doc(personItemId).update({amount});
    } else {
      await personsItemsRef.add({
        eventId: navigation.getParam('eventId'),
        amount,
        personId,
        itemId,
      });
    }
  }

  return (
    <>
      <Appbar.Header>
        <Appbar.BackAction
          onPress={() =>
            navigation.navigate('Navigator', {
              navigation: navigation.getParam('lastPageIndex'),
            })
          }
        />
        <Appbar.Content
          title={
            navigation.getParam('primaryEntityType') === 'person'
              ? navigation.getParam('primaryEntity').name
              : navigation.getParam('primaryEntity').description
          }
        />
      </Appbar.Header>
      <FlatList
        style={{flex: 1}}
        data={
          navigation.getParam('primaryEntityType') === 'person'
            ? items
            : persons
        }
        keyExtractor={item => item.id}
        renderItem={({item}) => {
          return navigation.getParam('primaryEntityType') === 'person' ? (
            <List.Item
              title={item.description}
              description={
                (Math.round(Number(item.price) * 100) / 100).toFixed(2) + ' Fr.'
              }
              right={props => {
                const personItem = personsItems.filter(
                  pI => pI.itemId === item.id,
                )[0] || {amount: 0, id: null};
                return (
                  <View {...props} style={styles.counter}>
                    <IconButton
                      icon={'minus'}
                      onPress={() =>
                        setAmount(
                          personItem.id,
                          personItem.amount - 1,
                          navigation.getParam('primaryEntity').id,
                          item.id,
                        )
                      }
                      disabled={personItem.amount < 1}
                    />
                    <Text>{personItem.amount}</Text>
                    <IconButton
                      icon={'plus'}
                      onPress={() =>
                        setAmount(
                          personItem.id,
                          personItem.amount + 1,
                          navigation.getParam('primaryEntity').id,
                          item.id,
                        )
                      }
                    />
                  </View>
                );
              }}
            />
          ) : (
            <List.Item
              title={item.name}
              right={props => {
                const personItem = personsItems.filter(
                  pI => pI.personId === item.id,
                )[0] || {amount: 0, id: null};
                return (
                  <View {...props} style={styles.counter}>
                    <IconButton
                      icon={'minus'}
                      onPress={() =>
                        setAmount(
                          personItem.id,
                          personItem.amount - 1,
                          item.id,
                          navigation.getParam('primaryEntity').id,
                        )
                      }
                      disabled={personItem.amount < 1}
                    />
                    <Text>{personItem.amount}</Text>
                    <IconButton
                      icon={'plus'}
                      onPress={() =>
                        setAmount(
                          personItem.id,
                          personItem.amount + 1,
                          item.id,
                          navigation.getParam('primaryEntity').id,
                        )
                      }
                    />
                  </View>
                );
              }}
            />
          );
        }}
      />
    </>
  );
};

const styles = StyleSheet.create({
  loading: {
    marginTop: '50%',
  },
  counter: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default Selector;
