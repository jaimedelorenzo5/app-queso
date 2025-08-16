import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { getFirestore, collection, doc, getDocs, getDoc, addDoc, updateDoc, query, where, orderBy, limit } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Cheese, Review } from '../types';

// Configuración de Firebase (reemplazar con tus credenciales)
const firebaseConfig = {
  apiKey: "tu-api-key",
  authDomain: "cheeserate.firebaseapp.com",
  projectId: "cheeserate",
  storageBucket: "cheeserate.appspot.com",
  messagingSenderId: "123456789",
  appId: "tu-app-id"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Servicios de autenticación
export const signIn = async (email: string, password: string) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
  } catch (error) {
    throw error;
  }
};

export const signUp = async (email: string, password: string) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    return result.user;
  } catch (error) {
    throw error;
  }
};

export const signOutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw error;
  }
};

// Servicios de quesos
export const getCheeses = async (): Promise<Cheese[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, 'cheeses'));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Cheese));
  } catch (error) {
    console.error('Error getting cheeses:', error);
    return [];
  }
};

export const getCheeseById = async (id: string): Promise<Cheese | null> => {
  try {
    const docRef = doc(db, 'cheeses', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Cheese;
    }
    return null;
  } catch (error) {
    console.error('Error getting cheese:', error);
    return null;
  }
};

export const getTrendingCheeses = async (): Promise<Cheese[]> => {
  try {
    const q = query(
      collection(db, 'cheeses'),
      orderBy('avgRating', 'desc'),
      limit(10)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Cheese));
  } catch (error) {
    console.error('Error getting trending cheeses:', error);
    return [];
  }
};

export const searchCheeses = async (searchTerm: string): Promise<Cheese[]> => {
  try {
    const cheeses = await getCheeses();
    return cheeses.filter(cheese => 
      cheese.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cheese.producer.toLowerCase().includes(searchTerm.toLowerCase())
    );
  } catch (error) {
    console.error('Error searching cheeses:', error);
    return [];
  }
};

// Servicios de reseñas
export const getReviewsByCheeseId = async (cheeseId: string): Promise<Review[]> => {
  try {
    const q = query(
      collection(db, 'reviews'),
      where('cheeseId', '==', cheeseId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Review));
  } catch (error) {
    console.error('Error getting reviews:', error);
    return [];
  }
};

export const addReview = async (review: Omit<Review, 'id' | 'createdAt'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, 'reviews'), {
      ...review,
      createdAt: new Date().toISOString()
    });
    
    // Actualizar rating promedio del queso
    await updateCheeseRating(review.cheeseId);
    
    return docRef.id;
  } catch (error) {
    console.error('Error adding review:', error);
    throw error;
  }
};

const updateCheeseRating = async (cheeseId: string) => {
  try {
    const reviews = await getReviewsByCheeseId(cheeseId);
    const avgRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
    
    await updateDoc(doc(db, 'cheeses', cheeseId), {
      avgRating: Math.round(avgRating * 10) / 10,
      reviewCount: reviews.length
    });
  } catch (error) {
    console.error('Error updating cheese rating:', error);
  }
};

// Servicios de almacenamiento
export const uploadImage = async (uri: string, path: string): Promise<string> => {
  try {
    const response = await fetch(uri);
    const blob = await response.blob();
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, blob);
    return await getDownloadURL(storageRef);
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};
