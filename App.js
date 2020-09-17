import React from 'react';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import Nav from './components/Nav';
import Home from './screens/Home';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#060630',
    background: '#FFFFFF'
  },
};

export default App = () => {
  return (
    <>
      <PaperProvider theme={theme}>
        <StatusBar style='light' />
        <Nav />
        <Home />
      </PaperProvider>
    </>
  );
};
