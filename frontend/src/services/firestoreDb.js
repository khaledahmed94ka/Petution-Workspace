import { db } from './firebaseAuth';
import { collection, doc, setDoc, getDocs, deleteDoc, writeBatch } from 'firebase/firestore';

export const syncToFirestore = async (userId, collectionName, dataId, data) => {
  if (!userId) return;
  try {
    const docRef = doc(db, 'users', userId, collectionName, dataId);
    await setDoc(docRef, data, { merge: true });
  } catch (error) {
    console.error(`Error syncing ${collectionName} to Firestore:`, error);
  }
};

export const deleteFromFirestore = async (userId, collectionName, dataId) => {
  if (!userId) return;
  try {
    const docRef = doc(db, 'users', userId, collectionName, dataId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error(`Error deleting from ${collectionName} in Firestore:`, error);
  }
};

export const fetchCollection = async (userId, collectionName) => {
  if (!userId) return [];
  try {
    const colRef = collection(db, 'users', userId, collectionName);
    const snapshot = await getDocs(colRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error(`Error fetching ${collectionName} from Firestore:`, error);
    return [];
  }
};

export const fetchUserData = async (userId) => {
  if (!userId) return null;
  const collections = ['clients', 'pets', 'visits', 'products', 'invoices', 'expenses', 'vaccines', 'soapNotes', 'team', 'invitations'];
  
  const data = {};
  for (const col of collections) {
    data[col] = await fetchCollection(userId, col);
  }
  
  // Settings and notifications
  const settingsList = await fetchCollection(userId, 'settings');
  const globalSettings = settingsList.find(s => s.id === 'global');
  data.settings = globalSettings || (settingsList.length > 0 ? settingsList[0] : null);
  data.notifications = await fetchCollection(userId, 'notifications');
  
  return data;
};

export const bulkWriteToFirestore = async (userId, collectionName, dataArray) => {
  if (!userId || !dataArray.length) return;
  try {
    const batch = writeBatch(db);
    dataArray.forEach(item => {
      const docRef = doc(db, 'users', userId, collectionName, item.id || item.id || Date.now().toString());
      batch.set(docRef, item, { merge: true });
    });
    await batch.commit();
  } catch (error) {
    console.error(`Error bulk writing ${collectionName} to Firestore:`, error);
  }
};
