import React, { Fragment, useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, Alert, BackHandler } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { Surface, Text, TextInput, IconButton, Colors, Divider, ActivityIndicator } from 'react-native-paper';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

const Home = () => {
    const [ weight, setWeight ] = useState('');
    const [ selectedShape, setSelectedShape ] = useState(null);
    const [ selectedDiscount, setSelectedDiscount ] = useState(null);
    const [ selectedColor, setSelectedColor ] = useState('');
    const [ selectedClarity, setSelectedClarity ] = useState('');
    const [ roundPrices, setRoundPrices ] = useState([]);
    const [ pearPrices, setPearPrices ] = useState([]);
    const [ price, setPrice ] = useState(0);
    const [ totalPrice, setTotalPrice ] = useState(0);
    const shapes = [
        { shape: 'round', letter: 'R' },
        { shape: 'pear', letter: 'T' },
        { shape: 'pear', letter: 'P' },
        { shape: 'pear', letter: 'C' },
        { shape: 'pear', letter: 'E' },
        { shape: 'pear', letter: 'O' },
        { shape: 'pear', letter: 'PS' },
        { shape: 'pear', letter: 'H' },
    ];
    const discounts = [-100, -90, -80, -70, -60, -50, -40, -30, -20, -10, 0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
    const colors = [
        { color: 'd', letter: 'D' },
        { color: 'e', letter: 'E' },
        { color: 'f', letter: 'F' },
        { color: 'g', letter: 'G' },
        { color: 'i', letter: 'I' },
        { color: 'j', letter: 'J' },
        { color: 'k', letter: 'K' },
        { color: 'l', letter: 'L' },
        { color: 'm', letter: 'M' },
        { color: 'n', letter: 'N' }
    ];
    const clarities = [
        { clarity: 'if', letter: 'IF' },
        { clarity: 'vvs1', letter: 'VVS1' },
        { clarity: 'vvs2', letter: 'VVS2' },
        { clarity: 'vs1', letter: 'VS1' },
        { clarity: 'vs2', letter: 'VS2' },
        { clarity: 'si1', letter: 'SI1' },
        { clarity: 'si2', letter: 'SI2' },
        { clarity: 'si3', letter: 'SI3' },
        { clarity: 'i1', letter: 'I1' },
        { clarity: 'i2', letter: 'I2' },
        { clarity: 'i3', letter: 'I3' }
    ];

    useEffect(() => {
        (async() => {
            try {
                let roundPrices = await fetch('https://technet.rapaport.com/HTTP/JSON/Prices/GetPriceSheet.aspx', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: '%7B%0A%22request%22%3A%20%7B%0A%22header%22%3A%20%7B%0A%22username%22%3A%20%22a2a1ritnqs9fmldmexwlrbediodvct%22%2C%0A%22password%22%3A%20%22RKRBnVKK%22%0A%0A%7D%2C%0A%22body%22%3A%7B%0A%22shape%22%3A%20%22round%22%0A%7D%0A%7D%0A%7D'
                });
                if (!roundPrices.ok && roundPrices.response.header.error_code !== 0) throw new Error();
                roundPrices = await roundPrices.json();
                let pearPrices = await fetch('https://technet.rapaport.com/HTTP/JSON/Prices/GetPriceSheet.aspx', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: '%7B%0A%22request%22%3A%20%7B%0A%22header%22%3A%20%7B%0A%22username%22%3A%20%22a2a1ritnqs9fmldmexwlrbediodvct%22%2C%0A%22password%22%3A%20%22RKRBnVKK%22%0A%0A%7D%2C%0A%22body%22%3A%7B%0A%22shape%22%3A%20%22pear%22%0A%7D%0A%7D%0A%7D'
                });
                if (!pearPrices.ok && pearPrices.response.header.error_code !== 0) throw new Error();
                pearPrices = await pearPrices.json();
                setRoundPrices(roundPrices.response.body.price);
                setPearPrices(pearPrices.response.body.price);
            } catch(err) {
                Alert.alert('Could not get diamond prices', 'Check your internet connection and try again later', [{ text: 'Ok', onPress: () => BackHandler.exitApp() }]);
            }
        })();
    }, []);

    useEffect(() => {
        let diamonds = selectedShape ? selectedShape.shape === 'round' ? roundPrices : pearPrices : [];
        if (selectedColor) diamonds = diamonds.filter(diamond => diamond.color === selectedColor);
        if (selectedClarity) diamonds = diamonds.filter(diamond => diamond.clarity === selectedClarity);
        if (weight) {
            if (weight > 10.99) {
                let price = 0;
                let filteredDiamonds = [];
                let weights = new Array(Math.floor(weight / 10)).fill(10);
                weights.push(weight % 10);
                weights.forEach(partialWeight => {
                    filteredDiamonds = diamonds.filter(diamond => Number(partialWeight) >= diamond.low_size && Number(partialWeight) <= diamond.high_size);
                    price += filteredDiamonds[0] ? filteredDiamonds[0].caratprice : 0;
                });
                setPrice(price);
            } else {
                let filteredDiamonds = [];
                filteredDiamonds = diamonds.filter(diamond => Number(weight) >= diamond.low_size && Number(weight) <= diamond.high_size);
                setPrice(filteredDiamonds[0] ? filteredDiamonds[0].caratprice : 0);
            }
        } else setPrice(diamonds.length > 0 ? diamonds[0].caratprice : 0);
    }, [selectedShape, selectedColor, selectedClarity, weight]);

    useEffect(() => {
        setTotalPrice(price * weight + (price * weight * selectedDiscount / 100));
    }, [price, weight, selectedDiscount]);

    return roundPrices.length > 0 && pearPrices.length > 0 ? (
        <View style={styles.container}>
            <ScrollView horizontal style={{ height: hp(10) }} showsHorizontalScrollIndicator={false}>
                <Surface style={[styles.surface, { backgroundColor: 'rgba(6, 6, 48, 0.1)' }]}>
                    {
                        shapes.map(({ shape, letter }, index) => (
                            <Fragment key={letter}>
                                <TouchableWithoutFeedback onPress={() => setSelectedShape({ shape, letter })}>
                                    <Surface style={[styles.innerSurface, { backgroundColor: selectedShape?.shape === shape && selectedShape?.letter === letter ? '#060630' : 'white' }]}>
                                        <Text style={{ fontSize: 20, color: selectedShape?.shape === shape && selectedShape?.letter === letter ? 'white' : 'black' }}>{letter}</Text>
                                    </Surface>
                                </TouchableWithoutFeedback>
                                { index !== shapes.length - 1 && <View style={styles.separator}></View> }
                            </Fragment>
                        ))
                    }
                </Surface>
            </ScrollView>
            <View style={styles.grid}>
                <TextInput
                    mode='flat'
                    type='number'
                    disabled
                    placeholder='Stone Weight'
                    placeholderTextColor='rgba(6, 6, 48, 0.7)'
                    value={weight}
                    style={{ 
                        width: '70%',
                        height: 40,
                        fontSize: 13
                    }}
                />
                <Surface style={[styles.surface, styles.discountSurface, { backgroundColor: 'rgba(6, 6, 48, 0.1)', marginVertical: 0 }]}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        {
                            discounts.map((discount, index) => (
                                <Fragment key={discount}>
                                    <TouchableWithoutFeedback onPress={() => setSelectedDiscount(discount)}>
                                        <Surface style={[styles.innerSurface, { marginHorizontal: 0, marginVertical: 5, backgroundColor: selectedDiscount === discount ? '#060630' : 'white' }]}>
                                            <Text style={{ fontSize: 15, color: selectedDiscount === discount ? 'white' : 'black' }}>{discount <= 0 ? discount : `+${discount}`}%</Text>
                                        </Surface>
                                    </TouchableWithoutFeedback>
                                    { index !== discounts.length - 1 && <Divider style={styles.divider} /> }
                                </Fragment>
                            ))
                        }
                    </ScrollView>
                </Surface>
            </View>
            <ScrollView horizontal style={{ height: hp(10) }} showsHorizontalScrollIndicator={false}>
                <Surface style={[styles.surface, { backgroundColor: 'rgba(6, 6, 48, 0.1)' }]}>
                    {
                        colors.map(({ color, letter }, index) => (
                            <Fragment key={letter}>
                                <TouchableWithoutFeedback onPress={() => setSelectedColor(color)}>
                                    <Surface style={[styles.innerSurface, { backgroundColor: selectedColor === color ? '#060630' : 'white' }]}>
                                        <Text style={{ fontSize: 20, color: selectedColor === color ? 'white' : 'black' }}>{letter}</Text>
                                    </Surface>
                                </TouchableWithoutFeedback>
                                { index !== colors.length - 1 && <View style={styles.separator}></View> }
                            </Fragment>
                        ))
                    }
                </Surface>
            </ScrollView>
            <ScrollView horizontal style={{ height: hp(10) }} showsHorizontalScrollIndicator={false}>
                <Surface style={[styles.surface, { backgroundColor: 'rgba(6, 6, 48, 0.1)' }]}>
                    {
                        clarities.map(({ clarity, letter }, index) => (
                            <Fragment key={letter}>
                                <TouchableWithoutFeedback onPress={() => setSelectedClarity(clarity)}>
                                    <Surface style={[styles.innerSurface, { backgroundColor: selectedClarity === clarity ? '#060630' : 'white' }]}>
                                        <Text style={{ fontSize: 20, color: selectedClarity === clarity ? 'white' : 'black' }}>{letter}</Text>
                                    </Surface>
                                </TouchableWithoutFeedback>
                                { index !== clarities.length - 1 && <View style={styles.separator}></View> }
                            </Fragment>
                        ))
                    }
                </Surface>
            </ScrollView>
            <View style={[styles.grid, { marginVertical: hp(0.5) }]}>
                <TextInput
                    mode='flat'
                    type='number'
                    disabled
                    placeholder='Price/CT'
                    placeholderTextColor='rgba(6, 6, 48, 0.7)'
                    value={price.toString()}
                    style={{ 
                        width: '47.5%',
                        height: 40,
                        fontSize: 13
                    }}
                />
                <TextInput
                    mode='flat'
                    type='number'
                    disabled
                    placeholder='Total Price'
                    placeholderTextColor='rgba(6, 6, 48, 0.7)'
                    value={totalPrice.toString()}
                    style={{ 
                        width: '47.5%',
                        height: 40,
                        fontSize: 13 
                    }}
                />
            </View>
            <View>
                <Surface style={styles.keyboard}>
                    <View style={styles.keyboardRow}>
                        {
                            [1, 2, 3].map((number, index) => (
                                <Fragment key={number}>
                                    <TouchableWithoutFeedback onPress={() => setWeight(weight + number)}>
                                        <Surface style={[styles.innerSurface, styles.key, { elevation: 0 }]}>
                                            <Text style={{ fontSize: 20 }}>{number}</Text>
                                        </Surface>
                                    </TouchableWithoutFeedback>
                                    { index !== [1, 2, 3].length - 1 && <View style={[styles.separator, { height: '80%' }]}></View> }
                                </Fragment>
                            ))
                        }
                    </View>
                    <Divider style={styles.divider} />
                    <View style={styles.keyboardRow}>
                        {
                            [4, 5, 6].map((number, index) => (
                                <Fragment key={number}>
                                    <TouchableWithoutFeedback onPress={() => setWeight(weight + number)}>
                                        <Surface style={[styles.innerSurface, styles.key, { elevation: 0 }]}>
                                            <Text style={{ fontSize: 20 }}>{number}</Text>
                                        </Surface>
                                    </TouchableWithoutFeedback>
                                    { index !== [4, 5, 6].length - 1 && <View style={[styles.separator, { height: '80%' }]}></View> }
                                </Fragment>
                            ))
                        }
                    </View>
                    <Divider style={styles.divider} />
                    <View style={styles.keyboardRow}>
                        {
                            [7, 8, 9].map((number, index) => (
                                <Fragment key={number}>
                                    <TouchableWithoutFeedback onPress={() => setWeight(weight + number)}>
                                        <Surface style={[styles.innerSurface, styles.key, { elevation: 0 }]}>
                                            <Text style={{ fontSize: 20 }}>{number}</Text>
                                        </Surface>
                                    </TouchableWithoutFeedback>
                                    { index !== [7, 8, 9].length - 1 && <View style={[styles.separator, { height: '80%' }]}></View> }
                                </Fragment>
                            ))
                        }
                    </View>
                    <Divider style={styles.divider} />
                    <View style={styles.keyboardRow}>
                        <TouchableWithoutFeedback onPress={() => { if (weight.indexOf('.') === -1 && weight !== '') setWeight(weight + '.') }}>
                            <Surface style={[styles.innerSurface, styles.key, { elevation: 0 }]}>
                                <Text style={{ fontSize: 20 }}>.</Text>
                            </Surface>
                        </TouchableWithoutFeedback>
                        <View style={[styles.separator, { height: '80%' }]}></View>
                        <TouchableWithoutFeedback onPress={() => setWeight(weight + '0')}>
                            <Surface style={[styles.innerSurface, styles.key, { elevation: 0 }]}>
                                <Text style={{ fontSize: 20 }}>0</Text>
                            </Surface>
                        </TouchableWithoutFeedback>
                        <View style={[styles.separator, { height: '80%' }]}></View>
                        <TouchableWithoutFeedback onLongPress={() => setWeight('')} onPress={() => setWeight(weight.substring(0, weight.length - 1))}>
                            <Surface style={[styles.innerSurface, styles.key, { elevation: 0 }]}>
                                <IconButton
                                    icon='backspace-outline'
                                    color={Colors.red500}
                                    size={20}
                                />
                            </Surface>
                        </TouchableWithoutFeedback>
                    </View>
                </Surface>
            </View>
        </View>
    ) : <ActivityIndicator style={{ flex: 1 }} animating={true} color='#060630' />;
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 15,
        paddingVertical: 10,
        flex: 1,
        flexDirection: 'column'
    },
    grid: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    separator: {
        width: 1,
        height: '50%',
        backgroundColor: 'rgba(0, 0, 0, 0.2)'
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.2)'
    },
    surface: {
        marginVertical: hp(2),
        paddingHorizontal: 5,
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        overflow: 'hidden'
    },
    discountSurface: {
        width: '25%',
        height: 45,
        paddingVertical: 5,
        flexDirection: 'column', 
        justifyContent: 'center',
        alignContent: 'space-around',
        overflow: 'hidden'
    },
    innerSurface: {
        elevation: 1,
        paddingVertical: 5,
        paddingHorizontal: 10,
        marginHorizontal: 5,
        width: 'auto'
    },
    keyboard: {
        marginVertical: 5,
        padding: 5
    },
    keyboardRow: {
        margin: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around'
    },
    key: {
        width: 35,
        height: 37,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default Home;