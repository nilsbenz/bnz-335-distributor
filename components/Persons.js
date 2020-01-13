import React from 'react';
import {Appbar} from 'react-native-paper';

const Persons = ({navigation}) => {
  return (
    <>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.navigate('Events')} />
        <Appbar.Content title={'Personen'} />
      </Appbar.Header>
    </>
  );
};

export default Persons;
