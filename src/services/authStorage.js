import AsyncStorage from "@react-native-async-storage/async-storage";

export const guardarUsuario = async (user) => {
  await AsyncStorage.setItem("usuario", JSON.stringify(user));
};

export const obtenerUsuario = async () => {
  const user = await AsyncStorage.getItem("usuario");
  return user ? JSON.parse(user) : null;
};

export const logout = async () => {
  await AsyncStorage.removeItem("usuario");
};