import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  Alert,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Calendar } from 'react-native-calendars';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../services/Firebase';

const CalendarioDigital = ({ navigation }) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [eventos, setEventos] = useState([]);
  const [materias, setMaterias] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState('evento'); // 'evento' o 'materia'
  const [editingItem, setEditingItem] = useState(null);

  // Estados para formularios
  const [eventoForm, setEventoForm] = useState({
    titulo: '',
    descripcion: '',
    fecha: '',
    hora: '',
    tipo: 'clase',
    aula: '',
    materia: '',
  });

  const [materiaForm, setMateriaForm] = useState({
    nombre: '',
    profesor: '',
    aula: '',
    color: '#0984e3',
    horarios: [],
  });

  const colores = [
    '#0984e3', '#00b894', '#e17055', '#a29bfe', 
    '#fd79a8', '#fdcb6e', '#6c5ce7', '#00cec9'
  ];

  const tiposEvento = [
    { key: 'clase', label: 'Clase', icon: 'book-outline' },
    { key: 'examen', label: 'Examen', icon: 'school-outline' },
    { key: 'tarea', label: 'Entrega de Tarea', icon: 'document-text-outline' },
    { key: 'presentacion', label: 'Presentación', icon: 'people-outline' },
    { key: 'otro', label: 'Otro', icon: 'calendar-outline' },
  ];

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      // Cargar eventos
      const eventosSnapshot = await getDocs(collection(db, 'eventos'));
      const eventosData = eventosSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setEventos(eventosData);

      // Cargar materias
      const materiasSnapshot = await getDocs(collection(db, 'materias'));
      const materiasData = materiasSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMaterias(materiasData);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      Alert.alert('Error', 'No se pudieron cargar los datos');
    }
  };

  const guardarEvento = async () => {
    if (!eventoForm.titulo || !eventoForm.fecha || !eventoForm.hora) {
      Alert.alert('Error', 'Por favor completa todos los campos requeridos');
      return;
    }

    try {
      const eventoData = {
        ...eventoForm,
        fechaCreacion: new Date().toISOString(),
      };

      if (editingItem) {
        await updateDoc(doc(db, 'eventos', editingItem.id), eventoData);
        Alert.alert('Éxito', 'Evento actualizado correctamente');
      } else {
        await addDoc(collection(db, 'eventos'), eventoData);
        Alert.alert('Éxito', 'Evento creado correctamente');
      }

      resetFormulario();
      setModalVisible(false);
      cargarDatos();
    } catch (error) {
      console.error('Error al guardar evento:', error);
      Alert.alert('Error', 'No se pudo guardar el evento');
    }
  };

  const guardarMateria = async () => {
    if (!materiaForm.nombre || !materiaForm.profesor) {
      Alert.alert('Error', 'Por favor completa todos los campos requeridos');
      return;
    }

    try {
      const materiaData = {
        ...materiaForm,
        fechaCreacion: new Date().toISOString(),
      };

      if (editingItem) {
        await updateDoc(doc(db, 'materias', editingItem.id), materiaData);
        Alert.alert('Éxito', 'Materia actualizada correctamente');
      } else {
        await addDoc(collection(db, 'materias'), materiaData);
        Alert.alert('Éxito', 'Materia creada correctamente');
      }

      resetFormulario();
      setModalVisible(false);
      cargarDatos();
    } catch (error) {
      console.error('Error al guardar materia:', error);
      Alert.alert('Error', 'No se pudo guardar la materia');
    }
  };

  const eliminarItem = async (id, tipo) => {
    Alert.alert(
      'Confirmar',
      `¿Estás seguro de que deseas eliminar este ${tipo}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteDoc(doc(db, tipo === 'evento' ? 'eventos' : 'materias', id));
              Alert.alert('Éxito', `${tipo} eliminado correctamente`);
              cargarDatos();
            } catch (error) {
              console.error('Error al eliminar:', error);
              Alert.alert('Error', `No se pudo eliminar el ${tipo}`);
            }
          }
        }
      ]
    );
  };

  const resetFormulario = () => {
    setEventoForm({
      titulo: '',
      descripcion: '',
      fecha: selectedDate,
      hora: '',
      tipo: 'clase',
      aula: '',
      materia: '',
    });
    setMateriaForm({
      nombre: '',
      profesor: '',
      aula: '',
      color: '#0984e3',
      horarios: [],
    });
    setEditingItem(null);
  };

  const abrirModal = (tipo, item = null) => {
    setModalType(tipo);
    setEditingItem(item);
    
    if (item) {
      if (tipo === 'evento') {
        setEventoForm(item);
      } else {
        setMateriaForm(item);
      }
    } else {
      resetFormulario();
    }
    
    setModalVisible(true);
  };

  const getEventosDelDia = (fecha) => {
    return eventos.filter(evento => evento.fecha === fecha);
  };

  const getMarkedDates = () => {
    const marked = {};
    eventos.forEach(evento => {
      const tipoEvento = tiposEvento.find(t => t.key === evento.tipo);
      marked[evento.fecha] = {
        marked: true,
        dotColor: evento.tipo === 'examen' ? '#e74c3c' : '#0984e3'
      };
    });
    
    marked[selectedDate] = {
      ...marked[selectedDate],
      selected: true,
      selectedColor: '#0984e3'
    };
    
    return marked;
  };

  const EventoCard = ({ evento }) => {
    const tipoEvento = tiposEvento.find(t => t.key === evento.tipo) || tiposEvento[0];
    const materia = materias.find(m => m.id === evento.materia);
    
    return (
      <View style={[styles.eventoCard, { borderLeftColor: materia?.color || '#0984e3' }]}>
        <View style={styles.eventoHeader}>
          <View style={styles.eventoInfo}>
            <Ionicons name={tipoEvento.icon} size={20} color={materia?.color || '#0984e3'} />
            <Text style={styles.eventoTitulo}>{evento.titulo}</Text>
          </View>
          <View style={styles.eventoActions}>
            <TouchableOpacity onPress={() => abrirModal('evento', evento)}>
              <Ionicons name="pencil-outline" size={18} color="#636e72" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => eliminarItem(evento.id, 'evento')}>
              <Ionicons name="trash-outline" size={18} color="#e74c3c" />
            </TouchableOpacity>
          </View>
        </View>
        <Text style={styles.eventoHora}>{evento.hora}</Text>
        {evento.aula && <Text style={styles.eventoAula}>Aula: {evento.aula}</Text>}
        {evento.descripcion && <Text style={styles.eventoDescripcion}>{evento.descripcion}</Text>}
        {materia && <Text style={styles.eventoMateria}>{materia.nombre}</Text>}
      </View>
    );
  };

  const MateriaCard = ({ materia }) => (
    <View style={[styles.materiaCard, { borderLeftColor: materia.color }]}>
      <View style={styles.materiaHeader}>
        <View style={styles.materiaInfo}>
          <View style={[styles.materiaColor, { backgroundColor: materia.color }]} />
          <View>
            <Text style={styles.materiaNombre}>{materia.nombre}</Text>
            <Text style={styles.materiaProfesor}>Prof. {materia.profesor}</Text>
          </View>
        </View>
        <View style={styles.materiaActions}>
          <TouchableOpacity onPress={() => abrirModal('materia', materia)}>
            <Ionicons name="pencil-outline" size={18} color="#636e72" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => eliminarItem(materia.id, 'materia')}>
            <Ionicons name="trash-outline" size={18} color="#e74c3c" />
          </TouchableOpacity>
        </View>
      </View>
      {materia.aula && <Text style={styles.materiaAula}>Aula: {materia.aula}</Text>}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#2d3436" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Calendario Digital</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => abrirModal('evento')}
          >
            <Ionicons name="add" size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content}>
        {/* Calendario */}
        <View style={styles.calendarContainer}>
          <Calendar
            onDayPress={(day) => setSelectedDate(day.dateString)}
            markedDates={getMarkedDates()}
            theme={{
              selectedDayBackgroundColor: '#0984e3',
              todayTextColor: '#0984e3',
              arrowColor: '#0984e3',
              monthTextColor: '#2d3436',
              textDayFontFamily: 'SourGummy',
              textMonthFontFamily: 'SourGummy',
              textDayHeaderFontFamily: 'SourGummy',
            }}
          />
        </View>

        {/* Eventos del día seleccionado */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Eventos - {new Date(selectedDate).toLocaleDateString('es-ES', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </Text>
          {getEventosDelDia(selectedDate).length > 0 ? (
            getEventosDelDia(selectedDate).map(evento => (
              <EventoCard key={evento.id} evento={evento} />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="calendar-outline" size={48} color="#636e72" />
              <Text style={styles.emptyText}>No hay eventos para este día</Text>
            </View>
          )}
        </View>

        {/* Materias */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Mis Materias</Text>
            <TouchableOpacity 
              style={styles.addMateria}
              onPress={() => abrirModal('materia')}
            >
              <Ionicons name="add-circle-outline" size={24} color="#0984e3" />
            </TouchableOpacity>
          </View>
          {materias.length > 0 ? (
            materias.map(materia => (
              <MateriaCard key={materia.id} materia={materia} />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="book-outline" size={48} color="#636e72" />
              <Text style={styles.emptyText}>No tienes materias registradas</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Modal para crear/editar */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Ionicons name="close" size={24} color="#2d3436" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>
              {editingItem ? 'Editar' : 'Crear'} {modalType === 'evento' ? 'Evento' : 'Materia'}
            </Text>
            <TouchableOpacity 
              onPress={modalType === 'evento' ? guardarEvento : guardarMateria}
              style={styles.saveButton}
            >
              <Text style={styles.saveButtonText}>Guardar</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {modalType === 'evento' ? (
              // Formulario de Evento
              <View>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Título *</Text>
                  <TextInput
                    style={styles.textInput}
                    value={eventoForm.titulo}
                    onChangeText={(text) => setEventoForm({...eventoForm, titulo: text})}
                    placeholder="Título del evento"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Tipo de Evento</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View style={styles.tipoEventos}>
                      {tiposEvento.map(tipo => (
                        <TouchableOpacity
                          key={tipo.key}
                          style={[
                            styles.tipoEvento,
                            eventoForm.tipo === tipo.key && styles.tipoEventoSelected
                          ]}
                          onPress={() => setEventoForm({...eventoForm, tipo: tipo.key})}
                        >
                          <Ionicons 
                            name={tipo.icon} 
                            size={20} 
                            color={eventoForm.tipo === tipo.key ? '#ffffff' : '#636e72'} 
                          />
                          <Text style={[
                            styles.tipoEventoText,
                            eventoForm.tipo === tipo.key && styles.tipoEventoTextSelected
                          ]}>
                            {tipo.label}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </ScrollView>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Fecha *</Text>
                  <TextInput
                    style={styles.textInput}
                    value={eventoForm.fecha}
                    onChangeText={(text) => setEventoForm({...eventoForm, fecha: text})}
                    placeholder="YYYY-MM-DD"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Hora *</Text>
                  <TextInput
                    style={styles.textInput}
                    value={eventoForm.hora}
                    onChangeText={(text) => setEventoForm({...eventoForm, hora: text})}
                    placeholder="HH:MM"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Aula</Text>
                  <TextInput
                    style={styles.textInput}
                    value={eventoForm.aula}
                    onChangeText={(text) => setEventoForm({...eventoForm, aula: text})}
                    placeholder="Número de aula"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Materia</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View style={styles.materiasList}>
                      {materias.map(materia => (
                        <TouchableOpacity
                          key={materia.id}
                          style={[
                            styles.materiaOption,
                            eventoForm.materia === materia.id && styles.materiaOptionSelected,
                            { borderColor: materia.color }
                          ]}
                          onPress={() => setEventoForm({...eventoForm, materia: materia.id})}
                        >
                          <Text style={[
                            styles.materiaOptionText,
                            eventoForm.materia === materia.id && { color: materia.color }
                          ]}>
                            {materia.nombre}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </ScrollView>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Descripción</Text>
                  <TextInput
                    style={[styles.textInput, styles.textArea]}
                    value={eventoForm.descripcion}
                    onChangeText={(text) => setEventoForm({...eventoForm, descripcion: text})}
                    placeholder="Descripción del evento"
                    multiline
                    numberOfLines={3}
                  />
                </View>
              </View>
            ) : (
              // Formulario de Materia
              <View>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Nombre de la Materia *</Text>
                  <TextInput
                    style={styles.textInput}
                    value={materiaForm.nombre}
                    onChangeText={(text) => setMateriaForm({...materiaForm, nombre: text})}
                    placeholder="Nombre de la materia"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Profesor *</Text>
                  <TextInput
                    style={styles.textInput}
                    value={materiaForm.profesor}
                    onChangeText={(text) => setMateriaForm({...materiaForm, profesor: text})}
                    placeholder="Nombre del profesor"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Aula Principal</Text>
                  <TextInput
                    style={styles.textInput}
                    value={materiaForm.aula}
                    onChangeText={(text) => setMateriaForm({...materiaForm, aula: text})}
                    placeholder="Número de aula"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Color</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View style={styles.coloresList}>
                      {colores.map(color => (
                        <TouchableOpacity
                          key={color}
                          style={[
                            styles.colorOption,
                            { backgroundColor: color },
                            materiaForm.color === color && styles.colorOptionSelected
                          ]}
                          onPress={() => setMateriaForm({...materiaForm, color})}
                        >
                          {materiaForm.color === color && (
                            <Ionicons name="checkmark" size={20} color="#ffffff" />
                          )}
                        </TouchableOpacity>
                      ))}
                    </View>
                  </ScrollView>
                </View>
              </View>
            )}
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e8ed',
  },
  headerTitle: {
    fontFamily: 'SourGummy',
    fontSize: 20,
    color: '#2d3436',
    fontWeight: '600',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 10,
  },
  addButton: {
    backgroundColor: '#0984e3',
    borderRadius: 20,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  calendarContainer: {
    backgroundColor: '#ffffff',
    margin: 20,
    borderRadius: 16,
    padding: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontFamily: 'SourGummy',
    fontSize: 18,
    color: '#2d3436',
    fontWeight: '600',
  },
  addMateria: {
    padding: 5,
  },
  eventoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    borderLeftWidth: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  eventoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  eventoInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  eventoTitulo: {
    fontFamily: 'SourGummy',
    fontSize: 16,
    color: '#2d3436',
    marginLeft: 8,
    fontWeight: '600',
    flex: 1,
  },
  eventoActions: {
    flexDirection: 'row',
    gap: 10,
  },
  eventoHora: {
    fontFamily: 'SourGummy',
    fontSize: 14,
    color: '#0984e3',
    marginBottom: 4,
    fontWeight: '500',
  },
  eventoAula: {
    fontFamily: 'SourGummy',
    fontSize: 12,
    color: '#636e72',
    marginBottom: 4,
  },
  eventoDescripcion: {
    fontFamily: 'SourGummy',
    fontSize: 12,
    color: '#636e72',
    marginBottom: 4,
    fontStyle: 'italic',
  },
  eventoMateria: {
    fontFamily: 'SourGummy',
    fontSize: 12,
    color: '#0984e3',
    fontWeight: '500',
  },
  materiaCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    borderLeftWidth: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  materiaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  materiaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  materiaColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  materiaNombre: {
    fontFamily: 'SourGummy',
    fontSize: 16,
    color: '#2d3436',
    fontWeight: '600',
  },
  materiaProfesor: {
    fontFamily: 'SourGummy',
    fontSize: 12,
    color: '#636e72',
  },
  materiaActions: {
    flexDirection: 'row',
    gap: 10,
  },
  materiaAula: {
    fontFamily: 'SourGummy',
    fontSize: 12,
    color: '#636e72',
    marginTop: 8,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontFamily: 'SourGummy',
    fontSize: 16,
    color: '#636e72',
    marginTop: 10,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e8ed',
  },
  modalTitle: {
    fontFamily: 'SourGummy',
    fontSize: 18,
    color: '#2d3436',
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#0984e3',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  saveButtonText: {
    fontFamily: 'SourGummy',
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontFamily: 'SourGummy',
    fontSize: 14,
    color: '#2d3436',
    marginBottom: 8,
    fontWeight: '500',
  },
  textInput: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: 'SourGummy',
    color: '#2d3436',
    borderWidth: 1,
    borderColor: '#e1e8ed',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  tipoEventos: {
    flexDirection: 'row',
    gap: 10,
    paddingVertical: 10,
  },
  tipoEvento: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e1e8ed',
    minWidth: 100,
  },
  tipoEventoSelected: {
    backgroundColor: '#0984e3',
    borderColor: '#0984e3',
  },
  tipoEventoText: {
    fontFamily: 'SourGummy',
    fontSize: 12,
    color: '#636e72',
    marginTop: 4,
  },
  tipoEventoTextSelected: {
    color: '#ffffff',
  },
  materiasList: {
    flexDirection: 'row',
    gap: 10,
    paddingVertical: 10,
  },
  materiaOption: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderWidth: 2,
    borderColor: '#e1e8ed',
  },
  materiaOptionSelected: {
    backgroundColor: '#f8f9fa',
  },
  materiaOptionText: {
    fontFamily: 'SourGummy',
    fontSize: 14,
    color: '#636e72',
  },
  coloresList: {
    flexDirection: 'row',
    gap: 15,
    paddingVertical: 10,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorOptionSelected: {
    transform: [{ scale: 1.2 }],
  },
});

export default CalendarioDigital;