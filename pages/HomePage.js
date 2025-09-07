import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const HomePage = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome to EduPlanner</Text>
            <Text style={styles.subtitle}>Your personalized education planning tool.</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
    },
});

export default HomePage;