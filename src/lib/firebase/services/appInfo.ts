// src/lib/firebase/services/restaurantService.ts
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/ClientApp';
import type { RestaurantInfo } from '@/constants/types';

export async function fetchRestaurantData(restaurantId: string): Promise<RestaurantInfo> {
  const docRef = doc(db, 'Restaurants', restaurantId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data() as RestaurantInfo;
  } else {
    throw new Error('Restaurant document does not exist.');
  }
}
