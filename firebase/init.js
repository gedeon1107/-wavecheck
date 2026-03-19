// ========== CONFIGURATION FIREBASE ==========
const firebaseConfig = {
  apiKey: "AIzaSyBkA3f3lukuP4_uL4Z0oLdVmQD4c5oNtD8",
  authDomain: "wavecheck-a6121.firebaseapp.com",
  databaseURL: "https://wavecheck-a6121-default-rtdb.firebaseio.com",
  projectId: "wavecheck-a6121",
  storageBucket: "wavecheck-a6121.firebasestorage.app",
  messagingSenderId: "18355213763",
  appId: "1:18355213763:web:03d6712dbc737bf72c9976"
};

// Initialiser Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// ========== FONCTIONS UTILITAIRES ==========
async function saveTest(testData) {
  try {
    await db.ref('tests').push({
      ...testData,
      timestamp: Date.now()
    });
    console.log('✅ Test sauvegardé avec succès');
    return true;
  } catch (error) {
    console.error('❌ Erreur sauvegarde test:', error);
    return false;
  }
}

async function saveAlert(alertData) {
  try {
    await db.ref('alerts').push({
      ...alertData,
      timestamp: Date.now()
    });
    console.log('✅ Alerte sauvegardée avec succès');
    return true;
  } catch (error) {
    console.error('❌ Erreur sauvegarde alerte:', error);
    return false;
  }
}

function getAllTests(callback) {
  db.ref('tests').on('value', snapshot => {
    const data = [];
    snapshot.forEach(childSnapshot => {
      data.push({
        id: childSnapshot.key,
        ...childSnapshot.val()
      });
    });
    callback(data);
  });
}

function getAllAlerts(callback) {
  db.ref('alerts').on('value', snapshot => {
    const data = [];
    snapshot.forEach(childSnapshot => {
      data.push({
        id: childSnapshot.key,
        ...childSnapshot.val()
      });
    });
    callback(data);
  });
}
