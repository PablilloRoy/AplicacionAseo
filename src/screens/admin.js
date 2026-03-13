import React, { useState, useEffect, useRef } from 'react';
import { 
  StyleSheet, Text, View, ScrollView, TouchableOpacity, 
  Modal, TextInput, Alert, KeyboardAvoidingView, Platform, 
  Animated, Easing, ActivityIndicator
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import api from "../services/api";

export default function AdminApp() {

  const [currentTab, setCurrentTab] = useState('panel'); 
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  const [teams, setTeams] = useState([]);

  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamMemberName, setNewTeamMemberName] = useState('');
  const [newTeamMemberName1, setNewTeamMemberName1] = useState('');

  useEffect(() => {
    cargarEquipos();
    startBroomAnimation();
  }, []);

  const cargarEquipos = async () => {

    setLoading(true);

    try {

      const response = await api.get("/equipos");

      setTeams(response.data);

    } catch (error) {

      console.log(error);
      Alert.alert("Error", "No se pudieron cargar los equipos");

    } finally {
      setLoading(false);
    }

  };

  const crearEquipo = async () => {

    if (!newTeamName || !newTeamMemberName) {
      Alert.alert("Error", "Escribe el nombre del equipo y al menos un integrante");
      return;
    }

    try {

      // 1️⃣ Crear equipo
      const equipo = await api.post("/equipos", {
        nombre: newTeamName,
        tareaDefault: "Salón Completo"
      });

      const equipoId = equipo.data.id;

      // 2️⃣ Crear lista de miembros
      const miembros = [];

      if (newTeamMemberName) miembros.push(newTeamMemberName);
      if (newTeamMemberName1) miembros.push(newTeamMemberName1);

      // 3️⃣ Guardar miembros
      await api.post(`/equipos/${equipoId}/miembros`, miembros);

      Alert.alert("Equipo creado");

      setIsModalVisible(false);

      setNewTeamName('');
      setNewTeamMemberName('');
      setNewTeamMemberName1('');

      cargarEquipos();

    } catch (error) {

      console.log(error);
      Alert.alert("Error", "No se pudo guardar el equipo");

    }

  };

  const broomAnim = useRef(new Animated.Value(0)).current;

  const startBroomAnimation = () => {

    Animated.loop(
      Animated.sequence([
        Animated.timing(broomAnim,{toValue:1,duration:400,easing:Easing.linear,useNativeDriver:true}),
        Animated.timing(broomAnim,{toValue:0,duration:400,easing:Easing.linear,useNativeDriver:true})
      ])
    ).start();

  };

  const broomRotation = broomAnim.interpolate({
    inputRange:[0,1],
    outputRange:['-20deg','20deg']
  });

  const PanelView = () => {

    const equipoHoy = teams[0] || null;

    if (loading) {

      return <ActivityIndicator size="large" color="#1ab192" style={{marginTop:40}}/>

    }

    return (

      <ScrollView style={styles.scrollContainer}>

        {equipoHoy ? (

          <View style={styles.statsCard}>

            <Text style={styles.statsTitle}>Equipo de Hoy</Text>

            <Text style={styles.statsTeamName}>
              {equipoHoy.nombre}
            </Text>

            <Text style={styles.statsMembers}>
              {equipoHoy.miembros?.map(m => m.nombre).join(" • ")}
            </Text>

          </View>

        ) : (

          <View style={[styles.statsCard,{backgroundColor:'#222'}]}>
            <Text style={styles.statsMembers}>
              No hay equipos registrados
            </Text>
          </View>

        )}

        <Text style={styles.sectionTitle}>
          Equipos
        </Text>

        {teams.map((team)=>(
          
          <View key={team.id} style={styles.card}>

            <View style={{flex:1}}>

              <Text style={styles.cardTitle}>
                {team.nombre}
              </Text>

              <Text style={styles.cardSub}>
                {team.miembros?.map(m => m.nombre).join(", ")}
              </Text>

            </View>

            <Animated.View style={{ transform:[{rotate:broomRotation}] }}>
              <Text style={{fontSize:28}}>🧹</Text>
            </Animated.View>

          </View>

        ))}

      </ScrollView>

    );

  };

  const TeamsView = () => (

    <ScrollView style={styles.scrollContainer}>

      <View style={styles.rowBetween}>

        <Text style={styles.sectionTitle}>
          Gestión de Grupos ({teams.length})
        </Text>

        <TouchableOpacity
          style={styles.addSmallBtn}
          onPress={()=>setIsModalVisible(true)}
        >

          <Text style={styles.addSmallBtnText}>
            + Nuevo
          </Text>

        </TouchableOpacity>

      </View>

      {teams.map(team => (

        <View key={team.id} style={styles.teamItem}>

          <Text style={styles.teamItemName}>
            {team.nombre}
          </Text>

          <Text style={styles.teamItemMembers}>
            {team.miembros?.length || 0} integrantes
          </Text>

        </View>

      ))}

    </ScrollView>

  );

  return (

    <View style={styles.mainContainer}>

      <StatusBar style="light"/>

      <View style={styles.header}>

        <Text style={styles.logoText}>
          Aseo<Text style={{color:'#1ab192'}}>App</Text>
        </Text>

        <TouchableOpacity onPress={cargarEquipos}>

          <View style={styles.adminBadge}>
            <Text style={styles.adminBadgeText}>Actualizar</Text>
          </View>

        </TouchableOpacity>

      </View>

      <View style={styles.tabContainer}>

        {['panel','equipos'].map(tab => (

          <TouchableOpacity
            key={tab}
            onPress={()=>setCurrentTab(tab)}
            style={[styles.tab,currentTab===tab && styles.tabActive]}
          >

            <Text style={[styles.tabLabel,currentTab===tab && styles.tabLabelActive]}>
              {tab.toUpperCase()}
            </Text>

          </TouchableOpacity>

        ))}

      </View>

      {currentTab === 'panel' ? <PanelView/> : <TeamsView/>}

      <Modal visible={isModalVisible} animationType="slide" transparent>

        <View style={styles.modalOverlay}>

          <KeyboardAvoidingView
            behavior={Platform.OS==="ios"?"padding":"height"}
            style={styles.modalContent}
          >

            <Text style={styles.modalTitle}>
              Nuevo Equipo
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Nombre equipo"
              value={newTeamName}
              onChangeText={setNewTeamName}
            />

            <TextInput
              style={styles.input}
              placeholder="Integrante 1"
              value={newTeamMemberName}
              onChangeText={setNewTeamMemberName}
            />

            <TextInput
              style={styles.input}
              placeholder="Integrante 2"
              value={newTeamMemberName1}
              onChangeText={setNewTeamMemberName1}
            />

            <TouchableOpacity
              style={styles.saveBtn}
              onPress={crearEquipo}
            >

              <Text style={styles.saveBtnText}>
                Guardar equipo
              </Text>

            </TouchableOpacity>

            <TouchableOpacity onPress={()=>setIsModalVisible(false)}>

              <Text style={styles.cancelText}>
                Cancelar
              </Text>

            </TouchableOpacity>

          </KeyboardAvoidingView>

        </View>

      </Modal>

    </View>

  );

}

const styles = StyleSheet.create({
  mainContainer:{flex:1,backgroundColor:'#000'},
  header:{paddingTop:60,paddingHorizontal:25,flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:20},
  logoText:{fontSize:28,fontWeight:'900',color:'#fff'},
  adminBadge:{backgroundColor:'rgba(26,177,146,0.1)',paddingHorizontal:10,paddingVertical:4,borderRadius:6,borderWidth:1,borderColor:'#1ab192'},
  adminBadgeText:{color:'#1ab192',fontSize:10,fontWeight:'bold'},
  tabContainer:{flexDirection:'row',marginHorizontal:25,backgroundColor:'#1a1a1a',borderRadius:12,padding:4,marginBottom:20},
  tab:{flex:1,paddingVertical:10,alignItems:'center',borderRadius:10},
  tabActive:{backgroundColor:'#333'},
  tabLabel:{fontSize:11,color:'#777',fontWeight:'bold'},
  tabLabelActive:{color:'#1ab192'},
  scrollContainer:{paddingHorizontal:25},
  statsCard:{backgroundColor:'#1ab192',borderRadius:24,padding:25,marginBottom:25},
  statsTitle:{color:'#fff',opacity:0.8,fontSize:12,fontWeight:'bold'},
  statsTeamName:{color:'#fff',fontSize:32,fontWeight:'900'},
  statsMembers:{color:'#fff',fontSize:14,opacity:0.9,marginTop:5},
  sectionTitle:{fontSize:18,fontWeight:'800',color:'#fff',marginBottom:15},
  card:{borderRadius:18,padding:18,flexDirection:'row',alignItems:'center',marginBottom:12,borderWidth:1.5,borderColor:'#333'},
  cardTitle:{fontSize:19,fontWeight:'bold',color:'#fff'},
  cardSub:{fontSize:13,color:'rgba(255,255,255,0.5)',marginTop:2},
  rowBetween:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:15},
  addSmallBtn:{backgroundColor:'#1ab192',paddingHorizontal:12,paddingVertical:6,borderRadius:8},
  addSmallBtnText:{color:'#fff',fontSize:12,fontWeight:'bold'},
  teamItem:{backgroundColor:'#1a1a1a',padding:20,borderRadius:15,marginBottom:10,borderWidth:1,borderColor:'#333'},
  teamItemName:{fontSize:17,fontWeight:'bold',color:'#fff'},
  teamItemMembers:{color:'#777',fontSize:13,marginTop:4},
  modalOverlay:{flex:1,backgroundColor:'rgba(27,27,27,0.8)',justifyContent:'flex-end'},
  modalContent:{backgroundColor:'#000',padding:30,borderTopLeftRadius:30,borderTopRightRadius:30,alignItems:'center'},
  modalTitle:{fontSize:22,fontWeight:'900',marginBottom:20,color:'#fff'},
  input:{width:'100%',backgroundColor:'#585757a1',padding:15,borderRadius:12,marginBottom:20,color:'#000'},
  saveBtn:{backgroundColor:'#1ab1939a',width:'100%',padding:18,borderRadius:15,alignItems:'center'},
  saveBtnText:{color:'#fff',fontWeight:'bold',fontSize:16},
  cancelText:{marginTop:15,color:'#aaa',fontWeight:'600'}
});