import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  Alert,
  Switch,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "../services/Firebase";

const TareasRecordatorios = ({ navigation }) => {
  const [tareas, setTareas] = useState([]);
  const [recordatorios, setRecordatorios] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState("tarea"); // 'tarea' o 'recordatorio'
  const [editingItem, setEditingItem] = useState(null);
  const [activeTab, setActiveTab] = useState("tareas"); // 'tareas', 'recordatorios', 'completadas'

  // Estados para formularios
  const [tareaForm, setTareaForm] = useState({
    titulo: "",
    descripcion: "",
    materia: "",
    fechaVencimiento: "",
    horaVencimiento: "",
    prioridad: "media",
    completada: false,
    tipo: "tarea", // 'tarea', 'examen', 'proyecto'
  });

  const [recordatorioForm, setRecordatorioForm] = useState({
    titulo: "",
    descripcion: "",
    fechaRecordatorio: "",
    horaRecordatorio: "",
    repetir: false,
    tipoRepeticion: "diario", // 'diario', 'semanal', 'mensual'
    activo: true,
  });

  const prioridades = [
    {
      key: "baja",
      label: "Baja",
      color: "#00b894",
      icon: "arrow-down-circle-outline",
    },
    {
      key: "media",
      label: "Media",
      color: "#fdcb6e",
      icon: "remove-circle-outline",
    },
    {
      key: "alta",
      label: "Alta",
      color: "#e17055",
      icon: "arrow-up-circle-outline",
    },
    {
      key: "urgente",
      label: "Urgente",
      color: "#e74c3c",
      icon: "alert-circle-outline",
    },
  ];

  const tiposTarea = [
    { key: "tarea", label: "Tarea", icon: "document-text-outline" },
    { key: "examen", label: "Examen", icon: "school-outline" },
    { key: "proyecto", label: "Proyecto", icon: "construct-outline" },
    { key: "presentacion", label: "Presentación", icon: "people-outline" },
  ];

  const tiposRepeticion = [
    { key: "diario", label: "Diario" },
    { key: "semanal", label: "Semanal" },
    { key: "mensual", label: "Mensual" },
  ];

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      // Cargar tareas
      const tareasQuery = query(
        collection(db, "tareas"),
        orderBy("fechaVencimiento", "asc")
      );
      const tareasSnapshot = await getDocs(tareasQuery);
      const tareasData = tareasSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTareas(tareasData);

      // Cargar recordatorios
      const recordatoriosQuery = query(
        collection(db, "recordatorios"),
        orderBy("fechaRecordatorio", "asc")
      );
      const recordatoriosSnapshot = await getDocs(recordatoriosQuery);
      const recordatoriosData = recordatoriosSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRecordatorios(recordatoriosData);
    } catch (error) {
      console.error("Error al cargar datos:", error);
      Alert.alert("Error", "No se pudieron cargar los datos");
    }
  };

  const guardarTarea = async () => {
    if (!tareaForm.titulo || !tareaForm.fechaVencimiento) {
      Alert.alert(
        "Error",
        "Por favor completa al menos el título y la fecha de vencimiento"
      );
      return;
    }

    try {
      const tareaData = {
        ...tareaForm,
        fechaCreacion: new Date().toISOString(),
      };

      if (editingItem) {
        await updateDoc(doc(db, "tareas", editingItem.id), tareaData);
        Alert.alert("Éxito", "Tarea actualizada correctamente");
      } else {
        await addDoc(collection(db, "tareas"), tareaData);
        Alert.alert("Éxito", "Tarea creada correctamente");
      }

      resetFormulario();
      setModalVisible(false);
      cargarDatos();
    } catch (error) {
      console.error("Error al guardar tarea:", error);
      Alert.alert("Error", "No se pudo guardar la tarea");
    }
  };

  const guardarRecordatorio = async () => {
    if (!recordatorioForm.titulo || !recordatorioForm.fechaRecordatorio) {
      Alert.alert("Error", "Por favor completa al menos el título y la fecha");
      return;
    }

    try {
      const recordatorioData = {
        ...recordatorioForm,
        fechaCreacion: new Date().toISOString(),
      };

      if (editingItem) {
        await updateDoc(
          doc(db, "recordatorios", editingItem.id),
          recordatorioData
        );
        Alert.alert("Éxito", "Recordatorio actualizado correctamente");
      } else {
        await addDoc(collection(db, "recordatorios"), recordatorioData);
        Alert.alert("Éxito", "Recordatorio creado correctamente");
      }

      resetFormulario();
      setModalVisible(false);
      cargarDatos();
    } catch (error) {
      console.error("Error al guardar recordatorio:", error);
      Alert.alert("Error", "No se pudo guardar el recordatorio");
    }
  };

  const toggleCompletarTarea = async (tareaId, completada) => {
    try {
      await updateDoc(doc(db, "tareas", tareaId), { completada: !completada });
      cargarDatos();
    } catch (error) {
      console.error("Error al actualizar tarea:", error);
      Alert.alert("Error", "No se pudo actualizar la tarea");
    }
  };

  const eliminarItem = async (id, tipo) => {
    Alert.alert(
      "Confirmar",
      `¿Estás seguro de que deseas eliminar este ${tipo}?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              const collection_name =
                tipo === "tarea" ? "tareas" : "recordatorios";
              await deleteDoc(doc(db, collection_name, id));
              Alert.alert("Éxito", `${tipo} eliminado correctamente`);
              cargarDatos();
            } catch (error) {
              console.error("Error al eliminar:", error);
              Alert.alert("Error", `No se pudo eliminar el ${tipo}`);
            }
          },
        },
      ]
    );
  };

  const resetFormulario = () => {
    setTareaForm({
      titulo: "",
      descripcion: "",
      materia: "",
      fechaVencimiento: "",
      horaVencimiento: "",
      prioridad: "media",
      completada: false,
      tipo: "tarea",
    });
    setRecordatorioForm({
      titulo: "",
      descripcion: "",
      fechaRecordatorio: "",
      horaRecordatorio: "",
      repetir: false,
      tipoRepeticion: "diario",
      activo: true,
    });
    setEditingItem(null);
  };

  const abrirModal = (tipo, item = null) => {
    setModalType(tipo);
    setEditingItem(item);

    if (item) {
      if (tipo === "tarea") {
        setTareaForm(item);
      } else {
        setRecordatorioForm(item);
      }
    } else {
      resetFormulario();
    }

    setModalVisible(true);
  };

  const getPrioridadInfo = (prioridad) => {
    return prioridades.find((p) => p.key === prioridad) || prioridades[1];
  };

  const getTipoTareaInfo = (tipo) => {
    return tiposTarea.find((t) => t.key === tipo) || tiposTarea[0];
  };

  const getDiasFaltantes = (fechaVencimiento) => {
    const hoy = new Date();
    const fecha = new Date(fechaVencimiento);
    const diffTime = fecha.getTime() - hoy.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return { texto: "Vencida", color: "#e74c3c" };
    if (diffDays === 0) return { texto: "Hoy", color: "#e17055" };
    if (diffDays === 1) return { texto: "1 día", color: "#fdcb6e" };
    return { texto: `${diffDays} días`, color: "#636e72" };
  };

  const TareaCard = ({ tarea }) => {
    const prioridadInfo = getPrioridadInfo(tarea.prioridad);
    const tipoInfo = getTipoTareaInfo(tarea.tipo);
    const diasInfo = getDiasFaltantes(tarea.fechaVencimiento);

    return (
      <View style={[styles.card, { opacity: tarea.completada ? 0.6 : 1 }]}>
        <View style={styles.cardHeader}>
          <View style={styles.cardInfo}>
            <TouchableOpacity
              onPress={() => toggleCompletarTarea(tarea.id, tarea.completada)}
            >
              <Ionicons
                name={tarea.completada ? "checkmark-circle" : "ellipse-outline"}
                size={24}
                color={tarea.completada ? "#00b894" : "#636e72"}
              />
            </TouchableOpacity>
            <View style={styles.cardContent}>
              <Text
                style={[
                  styles.cardTitle,
                  tarea.completada && styles.completedText,
                ]}
              >
                {tarea.titulo}
              </Text>
              <View style={styles.cardMeta}>
                <View style={styles.metaItem}>
                  <Ionicons name={tipoInfo.icon} size={14} color="#636e72" />
                  <Text style={styles.metaText}>{tipoInfo.label}</Text>
                </View>
                <View
                  style={[
                    styles.prioridadBadge,
                    { backgroundColor: prioridadInfo.color },
                  ]}
                >
                  <Ionicons
                    name={prioridadInfo.icon}
                    size={12}
                    color="#ffffff"
                  />
                  <Text style={styles.prioridadText}>
                    {prioridadInfo.label}
                  </Text>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.cardActions}>
            <TouchableOpacity onPress={() => abrirModal("tarea", tarea)}>
              <Ionicons name="pencil-outline" size={18} color="#636e72" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => eliminarItem(tarea.id, "tarea")}>
              <Ionicons name="trash-outline" size={18} color="#e74c3c" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.cardFooter}>
          <View style={styles.fechaInfo}>
            <Ionicons name="calendar-outline" size={14} color="#636e72" />
            <Text style={styles.fechaText}>
              {new Date(tarea.fechaVencimiento).toLocaleDateString("es-ES")}
              {tarea.horaVencimiento && ` - ${tarea.horaVencimiento}`}
            </Text>
          </View>
          <View style={[styles.diasBadge, { backgroundColor: diasInfo.color }]}>
            <Text style={styles.diasText}>{diasInfo.texto}</Text>
          </View>
        </View>

        {tarea.descripcion && (
          <Text style={styles.descripcion}>{tarea.descripcion}</Text>
        )}

        {tarea.materia && (
          <View style={styles.materiaInfo}>
            <Ionicons name="book-outline" size={14} color="#0984e3" />
            <Text style={styles.materiaText}>{tarea.materia}</Text>
          </View>
        )}
      </View>
    );
  };

  const RecordatorioCard = ({ recordatorio }) => (
    <View style={[styles.card, { opacity: recordatorio.activo ? 1 : 0.6 }]}>
      <View style={styles.cardHeader}>
        <View style={styles.cardInfo}>
          <Ionicons
            name={recordatorio.activo ? "notifications" : "notifications-off"}
            size={24}
            color={recordatorio.activo ? "#0984e3" : "#636e72"}
          />
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>{recordatorio.titulo}</Text>
            <View style={styles.cardMeta}>
              <View style={styles.metaItem}>
                <Ionicons name="time-outline" size={14} color="#636e72" />
                <Text style={styles.metaText}>
                  {new Date(recordatorio.fechaRecordatorio).toLocaleDateString(
                    "es-ES"
                  )}
                  {recordatorio.horaRecordatorio &&
                    ` - ${recordatorio.horaRecordatorio}`}
                </Text>
              </View>
              {recordatorio.repetir && (
                <View style={styles.repeticionBadge}>
                  <Ionicons name="repeat-outline" size={12} color="#0984e3" />
                  <Text style={styles.repeticionText}>
                    {
                      tiposRepeticion.find(
                        (t) => t.key === recordatorio.tipoRepeticion
                      )?.label
                    }
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
        <View style={styles.cardActions}>
          <TouchableOpacity
            onPress={() => abrirModal("recordatorio", recordatorio)}
          >
            <Ionicons name="pencil-outline" size={18} color="#636e72" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => eliminarItem(recordatorio.id, "recordatorio")}
          >
            <Ionicons name="trash-outline" size={18} color="#e74c3c" />
          </TouchableOpacity>
        </View>
      </View>

      {recordatorio.descripcion && (
        <Text style={styles.descripcion}>{recordatorio.descripcion}</Text>
      )}
    </View>
  );

  const getTareasTabData = () => {
    switch (activeTab) {
      case "tareas":
        return tareas.filter((t) => !t.completada);
      case "completadas":
        return tareas.filter((t) => t.completada);
      case "recordatorios":
        return recordatorios;
      default:
        return [];
    }
  };

  const getStatsData = () => {
    const tareasActivas = tareas.filter((t) => !t.completada);
    const tareasCompletadas = tareas.filter((t) => t.completada);
    const recordatoriosActivos = recordatorios.filter((r) => r.activo);

    return {
      pendientes: tareasActivas.length,
      completadas: tareasCompletadas.length,
      recordatorios: recordatoriosActivos.length,
    };
  };

  const stats = getStatsData();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#2d3436" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tareas y Recordatorios</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => abrirModal("tarea")}
          >
            <Ionicons name="add" size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Ionicons name="list-outline" size={24} color="#e17055" />
          <Text style={styles.statNumber}>{stats.pendientes}</Text>
          <Text style={styles.statLabel}>Pendientes</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="checkmark-done-outline" size={24} color="#00b894" />
          <Text style={styles.statNumber}>{stats.completadas}</Text>
          <Text style={styles.statLabel}>Completadas</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="notifications-outline" size={24} color="#0984e3" />
          <Text style={styles.statNumber}>{stats.recordatorios}</Text>
          <Text style={styles.statLabel}>Recordatorios</Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "tareas" && styles.activeTab]}
          onPress={() => setActiveTab("tareas")}
        >
          <Ionicons
            name="list-outline"
            size={20}
            color={activeTab === "tareas" ? "#0984e3" : "#636e72"}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === "tareas" && styles.activeTabText,
            ]}
          >
            Tareas
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === "completadas" && styles.activeTab]}
          onPress={() => setActiveTab("completadas")}
        >
          <Ionicons
            name="checkmark-done-outline"
            size={20}
            color={activeTab === "completadas" ? "#0984e3" : "#636e72"}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === "completadas" && styles.activeTabText,
            ]}
          >
            Completadas
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === "recordatorios" && styles.activeTab,
          ]}
          onPress={() => setActiveTab("recordatorios")}
        >
          <Ionicons
            name="notifications-outline"
            size={20}
            color={activeTab === "recordatorios" ? "#0984e3" : "#636e72"}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === "recordatorios" && styles.activeTabText,
            ]}
          >
            Recordatorios
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {getTareasTabData().length > 0 ? (
          <View style={styles.cardsContainer}>
            {activeTab === "recordatorios"
              ? getTareasTabData().map((recordatorio) => (
                  <RecordatorioCard
                    key={recordatorio.id}
                    recordatorio={recordatorio}
                  />
                ))
              : getTareasTabData().map((tarea) => (
                  <TareaCard key={tarea.id} tarea={tarea} />
                ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Ionicons
              name={
                activeTab === "recordatorios"
                  ? "notifications-outline"
                  : "list-outline"
              }
              size={64}
              color="#ddd"
            />
            <Text style={styles.emptyTitle}>
              {activeTab === "recordatorios"
                ? "No tienes recordatorios"
                : activeTab === "completadas"
                ? "No hay tareas completadas"
                : "No tienes tareas pendientes"}
            </Text>
            <Text style={styles.emptySubtitle}>
              {activeTab === "recordatorios"
                ? "Crea tu primer recordatorio"
                : "Crea tu primera tarea"}
            </Text>
            <TouchableOpacity
              style={styles.emptyButton}
              onPress={() =>
                abrirModal(
                  activeTab === "recordatorios" ? "recordatorio" : "tarea"
                )
              }
            >
              <Ionicons name="add" size={20} color="#ffffff" />
              <Text style={styles.emptyButtonText}>
                Crear {activeTab === "recordatorios" ? "recordatorio" : "tarea"}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        style={[
          styles.fab,
          {
            backgroundColor:
              activeTab === "recordatorios" ? "#0984e3" : "#00b894",
          },
        ]}
        onPress={() =>
          abrirModal(activeTab === "recordatorios" ? "recordatorio" : "tarea")
        }
      >
        <Ionicons name="add" size={28} color="#ffffff" />
      </TouchableOpacity>

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
              {editingItem ? "Editar" : "Crear"}{" "}
              {modalType === "tarea" ? "Tarea" : "Recordatorio"}
            </Text>
            <TouchableOpacity
              onPress={
                modalType === "tarea" ? guardarTarea : guardarRecordatorio
              }
              style={styles.saveButton}
            >
              <Text style={styles.saveButtonText}>Guardar</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.modalContent}
            showsVerticalScrollIndicator={false}
          >
            {modalType === "tarea" ? (
              // Formulario de Tarea
              <View>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Título *</Text>
                  <TextInput
                    style={styles.textInput}
                    value={tareaForm.titulo}
                    onChangeText={(text) =>
                      setTareaForm({ ...tareaForm, titulo: text })
                    }
                    placeholder="Título de la tarea"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Tipo de Tarea</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View style={styles.optionsRow}>
                      {tiposTarea.map((tipo) => (
                        <TouchableOpacity
                          key={tipo.key}
                          style={[
                            styles.optionButton,
                            tareaForm.tipo === tipo.key &&
                              styles.optionButtonSelected,
                          ]}
                          onPress={() =>
                            setTareaForm({ ...tareaForm, tipo: tipo.key })
                          }
                        >
                          <Ionicons
                            name={tipo.icon}
                            size={20}
                            color={
                              tareaForm.tipo === tipo.key
                                ? "#ffffff"
                                : "#636e72"
                            }
                          />
                          <Text
                            style={[
                              styles.optionText,
                              tareaForm.tipo === tipo.key &&
                                styles.optionTextSelected,
                            ]}
                          >
                            {tipo.label}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </ScrollView>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Prioridad</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View style={styles.optionsRow}>
                      {prioridades.map((prioridad) => (
                        <TouchableOpacity
                          key={prioridad.key}
                          style={[
                            styles.optionButton,
                            { borderColor: prioridad.color },
                            tareaForm.prioridad === prioridad.key && {
                              backgroundColor: prioridad.color,
                            },
                          ]}
                          onPress={() =>
                            setTareaForm({
                              ...tareaForm,
                              prioridad: prioridad.key,
                            })
                          }
                        >
                          <Ionicons
                            name={prioridad.icon}
                            size={16}
                            color={
                              tareaForm.prioridad === prioridad.key
                                ? "#ffffff"
                                : prioridad.color
                            }
                          />
                          <Text
                            style={[
                              styles.optionText,
                              {
                                color:
                                  tareaForm.prioridad === prioridad.key
                                    ? "#ffffff"
                                    : prioridad.color,
                              },
                            ]}
                          >
                            {prioridad.label}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </ScrollView>
                </View>

                <View style={styles.inputRow}>
                  <View style={styles.inputHalf}>
                    <Text style={styles.inputLabel}>Fecha Vencimiento *</Text>
                    <TextInput
                      style={styles.textInput}
                      value={tareaForm.fechaVencimiento}
                      onChangeText={(text) =>
                        setTareaForm({ ...tareaForm, fechaVencimiento: text })
                      }
                      placeholder="YYYY-MM-DD"
                    />
                  </View>
                  <View style={styles.inputHalf}>
                    <Text style={styles.inputLabel}>Hora</Text>
                    <TextInput
                      style={styles.textInput}
                      value={tareaForm.horaVencimiento}
                      onChangeText={(text) =>
                        setTareaForm({ ...tareaForm, horaVencimiento: text })
                      }
                      placeholder="HH:MM"
                    />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Materia/Asignatura</Text>
                  <TextInput
                    style={styles.textInput}
                    value={tareaForm.materia}
                    onChangeText={(text) =>
                      setTareaForm({ ...tareaForm, materia: text })
                    }
                    placeholder="Nombre de la materia"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Descripción</Text>
                  <TextInput
                    style={[styles.textInput, styles.textArea]}
                    value={tareaForm.descripcion}
                    onChangeText={(text) =>
                      setTareaForm({ ...tareaForm, descripcion: text })
                    }
                    placeholder="Descripción de la tarea"
                    multiline
                    numberOfLines={4}
                  />
                </View>
              </View>
            ) : (
              // Formulario de Recordatorio
              <View>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Título *</Text>
                  <TextInput
                    style={styles.textInput}
                    value={recordatorioForm.titulo}
                    onChangeText={(text) =>
                      setRecordatorioForm({ ...recordatorioForm, titulo: text })
                    }
                    placeholder="Título del recordatorio"
                  />
                </View>

                <View style={styles.inputRow}>
                  <View style={styles.inputHalf}>
                    <Text style={styles.inputLabel}>Fecha *</Text>
                    <TextInput
                      style={styles.textInput}
                      value={recordatorioForm.fechaRecordatorio}
                      onChangeText={(text) =>
                        setRecordatorioForm({
                          ...recordatorioForm,
                          fechaRecordatorio: text,
                        })
                      }
                      placeholder="YYYY-MM-DD"
                    />
                  </View>
                  <View style={styles.inputHalf}>
                    <Text style={styles.inputLabel}>Hora</Text>
                    <TextInput
                      style={styles.textInput}
                      value={recordatorioForm.horaRecordatorio}
                      onChangeText={(text) =>
                        setRecordatorioForm({
                          ...recordatorioForm,
                          horaRecordatorio: text,
                        })
                      }
                      placeholder="HH:MM"
                    />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <View style={styles.switchRow}>
                    <View>
                      <Text style={styles.inputLabel}>
                        Recordatorio Repetitivo
                      </Text>
                      <Text style={styles.inputHelper}>
                        Activar repetición automática
                      </Text>
                    </View>
                    <Switch
                      value={recordatorioForm.repetir}
                      onValueChange={(value) =>
                        setRecordatorioForm({
                          ...recordatorioForm,
                          repetir: value,
                        })
                      }
                      trackColor={{ false: "#ddd", true: "#0984e3" }}
                      thumbColor="#ffffff"
                    />
                  </View>
                </View>

                {recordatorioForm.repetir && (
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Tipo de Repetición</Text>
                    <View style={styles.optionsColumn}>
                      {tiposRepeticion.map((tipo) => (
                        <TouchableOpacity
                          key={tipo.key}
                          style={[
                            styles.optionButtonFull,
                            recordatorioForm.tipoRepeticion === tipo.key &&
                              styles.optionButtonSelected,
                          ]}
                          onPress={() =>
                            setRecordatorioForm({
                              ...recordatorioForm,
                              tipoRepeticion: tipo.key,
                            })
                          }
                        >
                          <Text
                            style={[
                              styles.optionText,
                              recordatorioForm.tipoRepeticion === tipo.key &&
                                styles.optionTextSelected,
                            ]}
                          >
                            {tipo.label}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                )}

                <View style={styles.inputGroup}>
                  <View style={styles.switchRow}>
                    <View>
                      <Text style={styles.inputLabel}>Recordatorio Activo</Text>
                      <Text style={styles.inputHelper}>
                        Recibir notificaciones
                      </Text>
                    </View>
                    <Switch
                      value={recordatorioForm.activo}
                      onValueChange={(value) =>
                        setRecordatorioForm({
                          ...recordatorioForm,
                          activo: value,
                        })
                      }
                      trackColor={{ false: "#ddd", true: "#0984e3" }}
                      thumbColor="#ffffff"
                    />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Descripción</Text>
                  <TextInput
                    style={[styles.textInput, styles.textArea]}
                    value={recordatorioForm.descripcion}
                    onChangeText={(text) =>
                      setRecordatorioForm({
                        ...recordatorioForm,
                        descripcion: text,
                      })
                    }
                    placeholder="Descripción del recordatorio"
                    multiline
                    numberOfLines={4}
                  />
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
    backgroundColor: "#f8f9fa",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e1e8ed",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerTitle: {
    fontFamily: "SourGummy",
    fontSize: 20,
    color: "#2d3436",
    fontWeight: "600",
  },
  headerActions: {
    flexDirection: "row",
    gap: 10,
  },
  addButton: {
    backgroundColor: "#0984e3",
    borderRadius: 20,
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
  },
  statsContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 15,
    backgroundColor: "#ffffff",
    marginBottom: 5,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    padding: 15,
    alignItems: "center",
    borderWidth: 1,
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
  tabsContainer: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e1e8ed",
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 6,
  },
  activeTab: {
    backgroundColor: "#f0f7ff",
  },
  tabText: {
    fontFamily: "SourGummy",
    fontSize: 14,
    color: "#636e72",
    fontWeight: "500",
  },
  activeTabText: {
    color: "#0984e3",
  },
  content: {
    flex: 1,
  },
  cardsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 15,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    borderWidth: 0.5,
    borderColor: "#e1e8ed",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  cardInfo: {
    flexDirection: "row",
    flex: 1,
    gap: 12,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontFamily: "SourGummy",
    fontSize: 16,
    color: "#2d3436",
    fontWeight: "600",
    marginBottom: 6,
  },
  completedText: {
    textDecorationLine: "line-through",
    color: "#636e72",
  },
  cardMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    fontFamily: "SourGummy",
    fontSize: 12,
    color: "#636e72",
  },
  prioridadBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  prioridadText: {
    fontFamily: "SourGummy",
    fontSize: 10,
    color: "#ffffff",
    fontWeight: "600",
  },
  repeticionBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: "#f0f7ff",
    gap: 4,
  },
  repeticionText: {
    fontFamily: "SourGummy",
    fontSize: 10,
    color: "#0984e3",
    fontWeight: "500",
  },
  cardActions: {
    flexDirection: "row",
    gap: 12,
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  fechaInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  fechaText: {
    fontFamily: "SourGummy",
    fontSize: 12,
    color: "#636e72",
  },
  diasBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  diasText: {
    fontFamily: "SourGummy",
    fontSize: 10,
    color: "#ffffff",
    fontWeight: "600",
  },
  descripcion: {
    fontFamily: "SourGummy",
    fontSize: 14,
    color: "#636e72",
    marginBottom: 8,
    fontStyle: "italic",
    lineHeight: 18,
  },
  materiaInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 4,
  },
  materiaText: {
    fontFamily: "SourGummy",
    fontSize: 12,
    color: "#0984e3",
    fontWeight: "500",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  emptyTitle: {
    fontFamily: "SourGummy",
    fontSize: 20,
    color: "#636e72",
    marginTop: 20,
    marginBottom: 8,
    textAlign: "center",
  },
  emptySubtitle: {
    fontFamily: "SourGummy",
    fontSize: 14,
    color: "#636e72",
    textAlign: "center",
    marginBottom: 30,
  },
  emptyButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0984e3",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  emptyButtonText: {
    fontFamily: "SourGummy",
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "500",
  },
  fab: {
    position: "absolute",
    bottom: 30,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e1e8ed",
  },
  modalTitle: {
    fontFamily: "SourGummy",
    fontSize: 18,
    color: "#2d3436",
    fontWeight: "600",
  },
  saveButton: {
    backgroundColor: "#0984e3",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  saveButtonText: {
    fontFamily: "SourGummy",
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "500",
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputRow: {
    flexDirection: "row",
    gap: 15,
    marginBottom: 20,
  },
  inputHalf: {
    flex: 1,
  },
  inputLabel: {
    fontFamily: "SourGummy",
    fontSize: 14,
    color: "#2d3436",
    marginBottom: 8,
    fontWeight: "500",
  },
  inputHelper: {
    fontFamily: "SourGummy",
    fontSize: 12,
    color: "#636e72",
  },
  textInput: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: "SourGummy",
    color: "#2d3436",
    borderWidth: 1,
    borderColor: "#e1e8ed",
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  optionsRow: {
    flexDirection: "row",
    gap: 10,
    paddingVertical: 10,
  },
  optionsColumn: {
    gap: 10,
  },
  optionButton: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e1e8ed",
    minWidth: 100,
    gap: 6,
  },
  optionButtonFull: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e1e8ed",
  },
  optionButtonSelected: {
    backgroundColor: "#0984e3",
    borderColor: "#0984e3",
  },
  optionText: {
    fontFamily: "SourGummy",
    fontSize: 12,
    color: "#636e72",
    fontWeight: "500",
  },
  optionTextSelected: {
    color: "#ffffff",
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 5,
  },
});

export default TareasRecordatorios;
