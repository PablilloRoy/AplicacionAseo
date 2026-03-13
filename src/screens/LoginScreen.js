import React, { useState } from 'react';
import {
  StyleSheet, Text, View, Image, TextInput,
  TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import api from "../services/api";
import AsyncStorage from '@react-native-async-storage/async-storage';

const logoApp = require('../../assets/microsoft.png');
const codeIcon = require('../../assets/password.png');

export default function LoginScreen({ navigation }) {

  const [codigo, setCodigo] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const handleLogin = async () => {

    if (!codigo) {
      alert("Ingresa tu código");
      return;
    }

    setLoading(true);

    try {

const response = await api.post(`/auth/login?codigo=${codigo}`);

const user = response.data;

// guardar sesión
await AsyncStorage.setItem("usuario", JSON.stringify(user));


      if (user.rol === "ADMIN") {
        navigation.replace("Admin");
      } else {
        navigation.replace("Alumno");
      }

    } catch (error) {

      alert("Código inválido");

    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >

      <StatusBar style="light" />

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >

        <View style={styles.decorativeTop} />

        {/* HEADER */}
        <View style={styles.header}>

          <View style={styles.logoContainer}>
            <Image source={logoApp} style={styles.logo} />
          </View>

          <Text style={styles.title}>Bienvenido</Text>
          <Text style={styles.subtitle}>Ingresa tu código de acceso</Text>

        </View>

        {/* FORM */}
        <View style={styles.form}>

          <View style={styles.inputGroup}>

            <Text style={styles.label}>Código de acceso</Text>

            <View style={[
              styles.inputContainer,
              focusedField === 'codigo' && styles.inputContainerFocused
            ]}>

              <Image source={codeIcon} style={styles.inputIcon} />

              <TextInput
                style={styles.input}
                placeholder="Ej: A7K2"
                placeholderTextColor="#888"
                value={codigo}
                onChangeText={setCodigo}
                onFocus={() => setFocusedField('codigo')}
                onBlur={() => setFocusedField(null)}
                autoCapitalize="characters"
              />

            </View>

          </View>

          {/* LOGIN BUTTON */}
          <TouchableOpacity
            style={styles.loginBtn}
            onPress={handleLogin}
            activeOpacity={0.9}
          >

            <Text style={styles.loginBtnText}>
              {loading ? "Ingresando..." : "Ingresar"}
            </Text>

          </TouchableOpacity>

        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#0f0f0f',
  },

  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },

  decorativeTop: {
    position: 'absolute',
    top: -100,
    right: -100,
    width: 400,
    height: 400,
    borderRadius: 200,
    backgroundColor: 'rgba(26, 177, 146, 0.05)',
  },

  header: {
    alignItems: 'center',
    marginBottom: 40,
  },

  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(26, 177, 146, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'rgba(26, 177, 146, 0.2)',
  },

  logo: {
    width: 80,
    height: 80,
    resizeMode: 'contain'
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 14,
    color: '#999',
  },

  form: {
    width: '100%',
  },

  inputGroup: {
    marginBottom: 20,
  },

  label: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
    marginBottom: 8,
  },

  inputContainer: {
    flexDirection: 'row',
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    alignItems: 'center',
    paddingHorizontal: 12,
    borderWidth: 1.5,
    borderColor: '#333',
  },

  inputContainerFocused: {
    borderColor: '#1ab192',
  },

  inputIcon: {
    width: 20,
    height: 20,
    tintColor: '#999'
  },

  input: {
    flex: 1,
    paddingVertical: 14,
    color: '#fff',
    fontSize: 14,
  },

  loginBtn: {
    backgroundColor: '#1ab192',
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },

  loginBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },

});