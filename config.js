// config.js - Configuración Centralizada
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";

const firebaseConfig = { 
    apiKey: "AIzaSyAZQRlfdtJjmodrfmct5N3qrLO6hniO2o8", 
    projectId: "proveed-8cb7c" 
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// FUNCIÓN MAESTRA: Registra cada interacción para tus estadísticas
export async function registrarActividad(tipo, detalle) {
    try {
        await addDoc(collection(db, "metricas"), {
            tipo: tipo, // "clic_compra", "apertura_app", "chat"
            categoria: detalle.categoria || "General",
            ciudad: detalle.ciudad || "No definida",
            precio: detalle.precio || 0,
            timestamp: serverTimestamp() // Esto te dará las "Horas Pico" exactas
        });
    } catch (e) {
        console.error("Error guardando métrica:", e);
    }
}

export { db };
