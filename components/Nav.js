import React from 'react';
import { StyleSheet } from 'react-native';
import { Appbar } from 'react-native-paper';

const Nav = () => {
    return ( 
        <Appbar style={styles.appBar}>
            <Appbar.Content
                title='Goldiama Rap Calculator'
                color='white'
            />
        </Appbar>
    );
};

const styles = StyleSheet.create({
    appBar: {
        height: 75
    }
});

export default Nav;