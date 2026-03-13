import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  StatusBar,
  Image
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../services/api";

export default function ClassmateIndex() {
  const [loading, setLoading] = useState(true);
  const [usuario, setUsuario] = useState(null);
  const [jornada, setJornada] = useState(null);

  useEffect(() => {
    cargarDashboard();
  }, []);

  const cargarDashboard = async () => {
    try {
      const usuarioGuardado = await AsyncStorage.getItem("usuario");
      const user = JSON.parse(usuarioGuardado);
      setUsuario(user);
      const response = await api.get(`/api/app/dashboard/${user.usuarioId}`);
      setJornada(response.data.proximaJornada);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // --- LOGICA DE COLORES BASADA EN ADMIN ---
  const getTheme = (estado) => {
    switch (estado) {
      case 'ACEPTADO': return { color: '#1ab192', bg: 'rgba(26, 177, 146, 0.1)' };
      case 'REALIZANDO': return { color: '#ffcc34', bg: 'rgba(255, 204, 52, 0.1)' };
      case 'EN_ESPERA': return { color: '#f1840f', bg: 'rgba(241, 132, 15, 0.1)' };
      default: return { color: '#777', bg: '#1a1a1a' };
    }
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#1ab192" />
      </View>
    );
  }

  const theme = getTheme(jornada?.estado);

  return (
    <View style={styles.mainContainer}>
      <StatusBar barStyle="light-content" />
      
      {/* HEADER AL ESTILO ADMIN */}
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>Hola,</Text>
          <Text style={styles.userName}>{usuario?.nombre} 👋</Text>
        </View>
        <View style={styles.roleBadge}>
          <Text style={styles.roleBadgeText}>ALUMNO</Text>
        </View>
      </View>

      <ScrollView style={styles.content}>
        
        {/* TARJETA DE EQUIPO (IGUAL A LA DE ADMIN) */}
        <View style={styles.teamStatsCard}>
          <Text style={styles.statsLabel}>TU EQUIPO ACTUAL</Text>
          <Text style={styles.statsTeamName}>{jornada?.equipo || "Sin Equipo"}</Text>
          <View style={styles.statusPill}>
             <View style={[styles.dot, { backgroundColor: theme.color }]} />
             <Text style={[styles.statusText, { color: theme.color }]}>{jornada?.estado || "LIBRE"}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Próxima Jornada</Text>

        {/* CARD DETALLADA */}
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoEmoji}>📅</Text>
            <View>
              <Text style={styles.infoLabel}>Fecha asignada</Text>
              <Text style={styles.infoValue}>{jornada?.fecha || "---"}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoEmoji}>⏰</Text>
            <View>
              <Text style={styles.infoLabel}>Hora de inicio</Text>
              <Text style={styles.infoValue}>{jornada?.horaInicio || "---"}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* ACCIONES DINÁMICAS */}
          {jornada?.estado === "EN_ESPERA" && (
            <View style={styles.actionContainer}>
              <Text style={styles.actionWarning}>¿Confirmas tu asistencia para esta limpieza?</Text>
              <View style={styles.row}>
                <TouchableOpacity style={styles.btnAccept} onPress={() => {/* tu funcion */}}>
                  <Text style={styles.btnText}>Confirmar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnReject} onPress={() => {/* tu funcion */}}>
                  <Text style={styles.btnText}>Rechazar</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {jornada?.estado === "REALIZANDO" && (
            <TouchableOpacity style={styles.btnCamera}>
              <Text style={styles.infoEmoji}>📸</Text>
              <Text style={styles.btnText}>Subir Evidencia</Text>
            </TouchableOpacity>
          )}

          {!jornada && (
             <Text style={styles.noJornadaText}>No tienes limpiezas pendientes. ¡Disfruta tu día! ✨</Text>
          )}
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: "#000" },
  loading: { flex: 1, backgroundColor: "#000", justifyContent: "center", alignItems: "center" },
  
  header: { 
    paddingTop: 60, 
    paddingHorizontal: 25, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    marginBottom: 20 
  },
  welcomeText: { color: "#777", fontSize: 16, fontWeight: "500" },
  userName: { color: "#fff", fontSize: 24, fontWeight: "900" },
  roleBadge: { 
    backgroundColor: 'rgba(26, 177, 146, 0.1)', 
    paddingHorizontal: 12, 
    paddingVertical: 6, 
    borderRadius: 8, 
    borderWidth: 1, 
    borderColor: '#1ab192' 
  },
  roleBadgeText: { color: "#1ab192", fontSize: 10, fontWeight: "bold" },

  content: { paddingHorizontal: 25 },

  teamStatsCard: { 
    backgroundColor: '#1ab192', 
    borderRadius: 24, 
    padding: 25, 
    marginBottom: 30,
    elevation: 10,
    shadowColor: '#1ab192',
    shadowOpacity: 0.3,
    shadowRadius: 15
  },
  statsLabel: { color: '#fff', opacity: 0.7, fontSize: 11, fontWeight: 'bold', letterSpacing: 1 },
  statsTeamName: { color: '#fff', fontSize: 32, fontWeight: '900', marginVertical: 5 },
  statusPill: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: 'rgba(0,0,0,0.2)', 
    alignSelf: 'flex-start', 
    paddingHorizontal: 12, 
    paddingVertical: 6, 
    borderRadius: 20,
    marginTop: 10
  },
  dot: { width: 8, height: 8, borderRadius: 4, marginRight: 8 },
  statusText: { fontSize: 10, fontWeight: 'bold' },

  sectionTitle: { color: "#fff", fontSize: 18, fontWeight: "800", marginBottom: 15 },
  
  infoCard: { 
    backgroundColor: "#161616", 
    borderRadius: 20, 
    padding: 20, 
    borderWidth: 1, 
    borderColor: "#333" 
  },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  infoEmoji: { fontSize: 24, marginRight: 15 },
  infoLabel: { color: "#777", fontSize: 12, fontWeight: "bold" },
  infoValue: { color: "#fff", fontSize: 16, fontWeight: "600" },
  
  divider: { height: 1, backgroundColor: "#333", marginVertical: 10 },

  actionContainer: { marginTop: 10 },
  actionWarning: { color: "#aaa", fontSize: 13, textAlign: 'center', marginBottom: 15 },
  row: { flexDirection: 'row', gap: 10 },
  
  btnAccept: { 
    flex: 1, 
    backgroundColor: "#1ab192", 
    padding: 15, 
    borderRadius: 12, 
    alignItems: "center" 
  },
  btnReject: { 
    flex: 1, 
    backgroundColor: "#222", 
    padding: 15, 
    borderRadius: 12, 
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#444"
  },
  btnCamera: { 
    backgroundColor: "#3498db", 
    padding: 18, 
    borderRadius: 15, 
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center',
    gap: 10
  },
  btnText: { color: "#fff", fontWeight: "bold", fontSize: 15 },
  noJornadaText: { color: "#777", textAlign: "center", paddingVertical: 20, fontStyle: "italic" }
});