import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Animated, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useRoute } from "@react-navigation/native";

const AnimatedIcon = Animated.createAnimatedComponent(Ionicons);

const HomePage = () => {
    const navigation = useNavigation();
    const scale1 = React.useRef(new Animated.Value(1)).current;
    const scale2 = React.useRef(new Animated.Value(1)).current;
    const route = useRoute();
    const { user } = route.params || {};

    const animateIcon = (scaleRef) => {
        Animated.sequence([
            Animated.timing(scaleRef, { toValue: 1.1, duration: 150, useNativeDriver: true }),
            Animated.timing(scaleRef, { toValue: 1, duration: 150, useNativeDriver: true }),
        ]).start();
    };

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* Header Section */}
            <View style={styles.headerContainer}>
                <View style={styles.welcomeSection}>
                    <Text style={styles.greeting}>¡Hola, {user ?? "Invitado"} ! 👋</Text>
                    <Text style={styles.title}>EduPlanner</Text>
                    <Text style={styles.subtitle}>Tu compañero perfecto para el éxito académico</Text>
                </View>
            </View>

            {/* Quick Stats */}
            <View style={styles.statsContainer}>
                <View style={styles.statCard}>
                    <Ionicons name="checkbox-outline" size={24} color="#00b894" />
                    <Text style={styles.statNumber}>0</Text>
                    <Text style={styles.statLabel}>Tareas hoy</Text>
                </View>
                <View style={styles.statCard}>
                    <Ionicons name="calendar-outline" size={24} color="#0984e3" />
                    <Text style={styles.statNumber}>0</Text>
                    <Text style={styles.statLabel}>Próximos eventos</Text>
                </View>
                <View style={styles.statCard}>
                    <Ionicons name="school-outline" size={24} color="#e17055" />
                    <Text style={styles.statNumber}>0</Text>
                    <Text style={styles.statLabel}>Exámenes</Text>
                </View>
            </View>

            {/* Main Modules */}
            <View style={styles.modulesSection}>
                <Text style={styles.sectionTitle}>Herramientas principales</Text>
                
                <View style={styles.modulesContainer}>
                    {/* Módulo Calendario Digital */}
                    <TouchableOpacity
                        style={[styles.module, styles.calendarModule]}
                        activeOpacity={0.8}
                        onPress={() => {
                            animateIcon(scale1);
                            navigation.navigate("CalendarioDigital");
                        }}
                    >
                        <View style={styles.moduleIconContainer}>
                            <AnimatedIcon
                                name="calendar"
                                size={32}
                                color="#ffffff"
                                style={{ transform: [{ scale: scale1 }] }}
                            />
                        </View>
                        <View style={styles.moduleContent}>
                            <Text style={styles.moduleTitle}>Calendario Digital</Text>
                            <Text style={styles.moduleDesc}>Organiza materias, horarios y eventos académicos</Text>
                            <View style={styles.moduleFeatures}>
                                <View style={styles.feature}>
                                    <Ionicons name="time-outline" size={14} color="#636e72" />
                                    <Text style={styles.featureText}>Horarios</Text>
                                </View>
                                <View style={styles.feature}>
                                    <Ionicons name="book-outline" size={14} color="#636e72" />
                                    <Text style={styles.featureText}>Materias</Text>
                                </View>
                                <View style={styles.feature}>
                                    <Ionicons name="location-outline" size={14} color="#636e72" />
                                    <Text style={styles.featureText}>Aulas</Text>
                                </View>
                            </View>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#0984e3" />
                    </TouchableOpacity>

                    {/* Módulo Tareas y Recordatorios */}
                    <TouchableOpacity
                        style={[styles.module, styles.taskModule]}
                        activeOpacity={0.8}
                        onPress={() => {
                            animateIcon(scale2);
                            navigation.navigate("TareasRecordatorios");
                        }}
                    >
                        <View style={[styles.moduleIconContainer, { backgroundColor: '#00b894' }]}>
                            <AnimatedIcon
                                name="notifications"
                                size={32}
                                color="#ffffff"
                                style={{ transform: [{ scale: scale2 }] }}
                            />
                        </View>
                        <View style={styles.moduleContent}>
                            <Text style={styles.moduleTitle}>Tareas y Recordatorios</Text>
                            <Text style={styles.moduleDesc}>Gestiona tareas, exámenes y recibe alertas</Text>
                            <View style={styles.moduleFeatures}>
                                <View style={styles.feature}>
                                    <Ionicons name="checkmark-circle-outline" size={14} color="#636e72" />
                                    <Text style={styles.featureText}>Tareas</Text>
                                </View>
                                <View style={styles.feature}>
                                    <Ionicons name="alarm-outline" size={14} color="#636e72" />
                                    <Text style={styles.featureText}>Alertas</Text>
                                </View>
                                <View style={styles.feature}>
                                    <Ionicons name="trophy-outline" size={14} color="#636e72" />
                                    <Text style={styles.featureText}>Exámenes</Text>
                                </View>
                            </View>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#00b894" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Quick Actions */}
            <View style={styles.quickActionsSection}>
                <Text style={styles.sectionTitle}>Acciones rápidas</Text>
                <View style={styles.quickActions}>
                    <TouchableOpacity style={styles.quickAction}>
                        <Ionicons name="add-circle-outline" size={24} color="#0984e3" />
                        <Text style={styles.quickActionText}>Nueva tarea</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.quickAction}>
                        <Ionicons name="calendar-outline" size={24} color="#00b894" />
                        <Text style={styles.quickActionText}>Añadir evento</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.quickAction}>
                        <Ionicons name="school-outline" size={24} color="#e17055" />
                        <Text style={styles.quickActionText}>Nuevo examen</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f8f9fa",
    },
    headerContainer: {
        paddingTop: 60,
        paddingHorizontal: 20,
        paddingBottom: 30,
        backgroundColor: "#ffffff",
    },
    welcomeSection: {
        alignItems: "center",
    },
    greeting: {
        fontFamily: "SourGummy",
        fontSize: 18,
        color: "#636e72",
        marginBottom: 5,
    },
    title: {
        fontFamily: "SourGummy",
        fontSize: 32,
        color: "#2d3436",
        marginBottom: 8,
        letterSpacing: 1,
    },
    subtitle: {
        fontFamily: "SourGummy",
        fontSize: 16,
        color: "#636e72",
        textAlign: "center",
    },
    statsContainer: {
        flexDirection: "row",
        paddingHorizontal: 20,
        paddingVertical: 20,
        gap: 15,
    },
    statCard: {
        flex: 1,
        backgroundColor: "#ffffff",
        borderRadius: 12,
        padding: 15,
        alignItems: "center",
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        borderWidth: 0.5,
        borderColor: "#e1e8ed",
    },
    statNumber: {
        fontFamily: "SourGummy",
        fontSize: 24,
        fontWeight: "bold",
        color: "#2d3436",
        marginVertical: 5,
    },
    statLabel: {
        fontFamily: "SourGummy",
        fontSize: 12,
        color: "#636e72",
        textAlign: "center",
    },
    modulesSection: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    sectionTitle: {
        fontFamily: "SourGummy",
        fontSize: 20,
        color: "#2d3436",
        marginBottom: 15,
        fontWeight: "600",
    },
    modulesContainer: {
        gap: 20,
    },
    module: {
        backgroundColor: "#ffffff",
        borderRadius: 16,
        padding: 20,
        flexDirection: "row",
        alignItems: "center",
        elevation: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 8,
        borderWidth: 0.5,
        borderColor: "#e1e8ed",
    },
    moduleIconContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: "#0984e3",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 15,
    },
    moduleContent: {
        flex: 1,
    },
    moduleTitle: {
        fontFamily: "SourGummy",
        fontSize: 18,
        color: "#2d3436",
        marginBottom: 6,
        fontWeight: "600",
    },
    moduleDesc: {
        fontFamily: "SourGummy",
        fontSize: 14,
        color: "#636e72",
        marginBottom: 10,
        lineHeight: 20,
    },
    moduleFeatures: {
        flexDirection: "row",
        gap: 15,
    },
    feature: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
    featureText: {
        fontFamily: "SourGummy",
        fontSize: 12,
        color: "#636e72",
    },
    quickActionsSection: {
        paddingHorizontal: 20,
        paddingBottom: 30,
    },
    quickActions: {
        flexDirection: "row",
        gap: 15,
    },
    quickAction: {
        flex: 1,
        backgroundColor: "#ffffff",
        borderRadius: 12,
        padding: 15,
        alignItems: "center",
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        borderWidth: 0.5,
        borderColor: "#e1e8ed",
    },
    quickActionText: {
        fontFamily: "SourGummy",
        fontSize: 12,
        color: "#636e72",
        marginTop: 5,
        textAlign: "center",
    },
});

export default HomePage;