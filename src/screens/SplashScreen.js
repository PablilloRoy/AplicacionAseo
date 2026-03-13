import React, { useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  Image, 
  StyleSheet, 
  StatusBar,
  Animated,
  Easing,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const icon = require('../../assets/erasebg-transformed.png');

export default function SplashScreen({ navigation }) {
  // Animaciones del Logo y Texto
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Animación para los puntitos de carga (ya que CSS no funciona igual aquí)
  const dot1 = useRef(new Animated.Value(0.3)).current;
  const dot2 = useRef(new Animated.Value(0.3)).current;
  const dot3 = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    // 1. Animaciones de entrada
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1000,
        delay: 400,
        useNativeDriver: true,
      }),
    ]).start();

    // 2. Loop de pulso para el logo
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.05, duration: 1500, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1500, useNativeDriver: true }),
      ])
    ).start();

    // 3. Animación de los puntitos de carga
    const animateDots = (dot, delay) => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, { toValue: 1, duration: 400, useNativeDriver: true }),
          Animated.timing(dot, { toValue: 0.3, duration: 400, useNativeDriver: true }),
        ])
      ).start();
    };
    animateDots(dot1, 0);
    animateDots(dot2, 200);
    animateDots(dot3, 400);

    // 4. Lógica de Verificación de Sesión
    const verificarSesion = async () => {
      try {
        const datosUsuario = await AsyncStorage.getItem("usuario");
        
        // Forzamos un tiempo mínimo de 3 segundos para que luzca el Splash
        await new Promise(resolve => setTimeout(resolve, 3500));

        if (datosUsuario) {
          const user = JSON.parse(datosUsuario);
          if (user.rol === "ADMIN") {
            navigation.replace("Admin");
          } else {
            // Si no tienes pantalla de Alumno, mándalo a Login o a una genérica
            navigation.replace("Login"); 
          }
        } else {
          navigation.replace("Login");
        }
      } catch (error) {
        console.error("Error en AsyncStorage:", error);
        navigation.replace("Login");
      }
    };

    verificarSesion();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f0f0f" />
      
      <View style={styles.decorativeCircle1} />
      <View style={styles.decorativeCircle2} />
      
      <Animated.View style={[styles.logoContainer, { opacity: fadeAnim, transform: [{ scale: Animated.multiply(scaleAnim, pulseAnim) }] }]}>
        <View style={styles.logoWrapper}>
          <Image source={icon} style={styles.image} />
        </View>
      </Animated.View>

      <Animated.View style={[styles.textContainer, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        <Text style={styles.welcomeText}>Bienvenido</Text>
        <Text style={styles.appName}>AseoApp</Text>
        
        <View style={styles.loadingContainer}>
          <Animated.View style={[styles.loadingDot, { opacity: dot1 }]} />
          <Animated.View style={[styles.loadingDot, { opacity: dot2 }]} />
          <Animated.View style={[styles.loadingDot, { opacity: dot3 }]} />
        </View>
      </Animated.View>

      <View style={styles.bottomAccent} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f0f', alignItems: 'center', justifyContent: 'center', padding: 20 },
  decorativeCircle1: { position: 'absolute', top: -150, right: -100, width: 400, height: 400, borderRadius: 200, backgroundColor: 'rgba(26, 177, 146, 0.08)' },
  decorativeCircle2: { position: 'absolute', bottom: -200, left: -150, width: 450, height: 450, borderRadius: 225, backgroundColor: 'rgba(26, 177, 146, 0.05)' },
  logoContainer: { marginBottom: 40, zIndex: 10 },
  logoWrapper: { width: 180, height: 180, borderRadius: 90, backgroundColor: 'rgba(26, 177, 146, 0.1)', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: 'rgba(26, 177, 146, 0.2)' },
  image: { width: 150, height: 150, resizeMode: 'contain' },
  textContainer: { alignItems: 'center', zIndex: 10 },
  welcomeText: { fontSize: 16, color: '#999', fontWeight: '500', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 8 },
  appName: { fontSize: 48, fontWeight: '800', color: '#ffffff', marginBottom: 30 },
  loadingContainer: { flexDirection: 'row', gap: 8 },
  loadingDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#1ab192' },
  bottomAccent: { position: 'absolute', bottom: 0, width: '100%', height: 3, backgroundColor: 'rgba(26, 177, 146, 0.3)' },
});