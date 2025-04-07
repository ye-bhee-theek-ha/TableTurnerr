// src/lib/firebase/services/restaurantService.ts
import { 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  collection, 
  where, 
  limit, 
  orderBy 
} from 'firebase/firestore';
import { db } from '@/lib/firebase/ClientApp';
import type { RestaurantInfo, MenuItem } from '@/constants/types';

// Fetch main restaurant data
export async function fetchRestaurantData(restaurantId: string): Promise<RestaurantInfo> {
  try {
    const docRef = doc(db, 'Restaurants', restaurantId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data() as RestaurantInfo;
    } else {
      throw new Error('Restaurant document does not exist.');
    }
  } catch (error: any) {
    console.error('Error fetching restaurant data:', error);
    throw new Error(`Failed to fetch restaurant data: ${error.message}`);
  }
}


export async function fetchAllMenuItems(restaurantId: string): Promise<MenuItem[]> {
  try {
    // Path to the menu subcollection
    const menuCollectionRef = collection(db, 'Restaurants', restaurantId, 'menu');
    
    // We order by name to ensure consistent loading order
    const menuQuery = query(
      menuCollectionRef,
      orderBy('name')
      // No limit here as we want all items
    );
    
    const querySnapshot = await getDocs(menuQuery);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as MenuItem[];
  } catch (error: any) {
    console.error('Error fetching all menu items:', error);
    throw new Error(`Failed to fetch menu items: ${error.message}`);
  }
}
