import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Appbar,
  Button,
  Dialog,
  FAB,
  List,
  Snackbar,
  TextInput,
} from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import {FlatList, StyleSheet} from 'react-native';

const Items = ({navigation, eventId}) => {
  const ref = firestore().collection('items');

  const [itemDescription, setItemDescription] = useState('');
  const [itemPrice, setItemPrice] = useState(0);
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [isSnackbarVisible, setIsSnackbarVisible] = useState(false);

  useEffect(() => {
    return ref.onSnapshot(querySnapshot => {
      const list = [];
      querySnapshot.forEach(doc => {
        const {description, price, eventId: event} = doc.data();
        if (event === eventId) {
          list.push({
            id: doc.id,
            description,
            price,
          });
        }
      });

      setItems(list);

      if (loading) {
        setLoading(false);
      }
    });
  });

  async function addItem() {
    if (isNaN(Number(itemPrice))) {
      setIsSnackbarVisible(true);
    } else {
      await ref.add({
        description: itemDescription,
        price: Number(itemPrice),
        eventId,
      });
      setItemDescription('');
      setItemPrice(0);
      setIsDialogVisible(false);
    }
  }

  if (loading) {
    return (
      <>
        <Appbar.Header>
          <Appbar.BackAction onPress={() => navigation.navigate('Events')} />
          <Appbar.Content title={'Items'} />
        </Appbar.Header>
        <ActivityIndicator animating={true} style={styles.loading} />
      </>
    );
  }

  return (
    <>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.navigate('Events')} />
        <Appbar.Content title={'Items'} />
      </Appbar.Header>
      <FlatList
        style={{flex: 1}}
        data={items}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <List.Item
            title={item.description}
            description={
              (Math.round(Number(item.price) * 100) / 100).toFixed(2) + ' Fr.'
            }
            onPress={() => {
              navigation.navigate('Selector', {
                lastPageIndex: 0,
                eventId,
                primaryEntityType: 'item',
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
        <Dialog.Title>Neues Item</Dialog.Title>
        <Dialog.Content>
          <TextInput
            label={'Beschreibung'}
            value={itemDescription}
            onChangeText={setItemDescription}
            style={styles.descriptionInput}
          />
          <TextInput
            label={'Preis'}
            value={itemPrice}
            onChangeText={setItemPrice}
          />
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={() => setIsDialogVisible(false)}>Abbrechen</Button>
          <Button
            mode={'contained'}
            style={styles.saveButton}
            onPress={() => addItem()}>
            Speichern
          </Button>
        </Dialog.Actions>
      </Dialog>
      <Snackbar
        visible={isSnackbarVisible}
        onDismiss={() => setIsSnackbarVisible(false)}
        action={{
          label: 'OK',
          onPress: () => {
            setIsSnackbarVisible(false);
          },
        }}>
        Der Preis muss eine Zahl sein.
      </Snackbar>
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
  descriptionInput: {
    marginBottom: 8,
  },
  saveButton: {
    marginLeft: 8,
  },
  loading: {
    marginTop: '50%',
  },
});

export default Items;
