// Updated restaurant slice with optimized menu loading
// src/features/restaurantSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { 
  fetchRestaurantData, 
  fetchAllMenuItems 
} from '@/lib/firebase/services/appInfo';
import type { RestaurantInfo, MenuItem } from '@/constants/types';

const RESTAURANT_ID = process.env.NEXT_PUBLIC_FIREBASE_RESTAURANT_ID;

// Cache implementation
interface CacheState {
  timestamp: number;
  data: any;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const dataCache: Record<string, CacheState> = {};

const isCacheValid = (cacheKey: string): boolean => {
  const cache = dataCache[cacheKey];
  if (!cache) return false;
  return Date.now() - cache.timestamp < CACHE_DURATION;
};

// 1. Fetch main restaurant data
export const getRestaurantData = createAsyncThunk(
  'restaurant/getData',
  async (_, { rejectWithValue }) => {
    if (!RESTAURANT_ID) {
      return rejectWithValue("Restaurant ID not configured.");
    }
    
    const cacheKey = `restaurant_${RESTAURANT_ID}`;
    if (isCacheValid(cacheKey)) {
      return dataCache[cacheKey].data;
    }
    
    try {
      const data = await fetchRestaurantData(RESTAURANT_ID);
      
      dataCache[cacheKey] = {
        timestamp: Date.now(),
        data
      };
      
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// 2. Fetch all menu items (we'll filter them in the app)
export const getAllMenuItems = createAsyncThunk(
  'restaurant/getAllMenuItems',
  async (_, { rejectWithValue }) => {
    const restaurantId = RESTAURANT_ID;
    
    if (!restaurantId) {
      return rejectWithValue("Restaurant ID not configured.");
    }
    
    const cacheKey = `allMenuItems_${restaurantId}`;
    if (isCacheValid(cacheKey)) {
      return dataCache[cacheKey].data;
    }
    
    try {
      const items = await fetchAllMenuItems(restaurantId);
      
      dataCache[cacheKey] = {
        timestamp: Date.now(),
        data: items
      };
      
      return items;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

interface RestaurantState {
  data: RestaurantInfo | null;
  menuItems: MenuItem[];
  popularItems: MenuItem[];
  categoriesLoaded: string[];
  allItemsLoaded: boolean;
  loading: {
    restaurant: boolean;
    allItems: boolean;
  };
  error: {
    restaurant: string | null;
    allItems: string | null;
  };
}

const initialState: RestaurantState = {
  data: null,
  menuItems: [],
  popularItems: [],
  categoriesLoaded: [],
  allItemsLoaded: false,
  loading: {
    restaurant: false,
    allItems: false,
  },
  error: {
    restaurant: null,
    allItems: null,
  },
};

const restaurantSlice = createSlice({
  name: 'restaurant',
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.error = {
        restaurant: null,
        allItems: null,
      };
    },
    // New reducer to identify popular items after loading
    processPopularItems: (state) => {
      if (!state.data) return;
      
      // Find the "popular" category if it exists
      const popularCategory = state.data.catagories.find(
        cat => cat.name.toLowerCase() === 'popular'
      );
      
      if (popularCategory) {
        // Filter menu items that are in the popular category
        state.popularItems = state.menuItems.filter(item => 
          popularCategory.ids.includes(item.id)
        );
        
        // Mark popular category as loaded
        if (!state.categoriesLoaded.includes('popular')) {
          state.categoriesLoaded.push('popular');
        }
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Restaurant data cases
      .addCase(getRestaurantData.pending, (state) => {
        state.loading.restaurant = true;
        state.error.restaurant = null;
      })
      .addCase(getRestaurantData.fulfilled, (state, action: PayloadAction<RestaurantInfo>) => {
        state.loading.restaurant = false;
        state.data = action.payload;
        
        // If we already have menu items loaded, process popular items
        if (state.menuItems.length > 0) {
          const popularCategory = action.payload.catagories.find(
            cat => cat.name.toLowerCase() === 'popular'
          );
          
          if (popularCategory) {
            state.popularItems = state.menuItems.filter(item => 
              popularCategory.ids.includes(item.id)
            );
            
            if (!state.categoriesLoaded.includes('popular')) {
              state.categoriesLoaded.push('popular');
            }
          }
        }
      })
      .addCase(getRestaurantData.rejected, (state, action) => {
        state.loading.restaurant = false;
        state.error.restaurant = action.payload as string;
      })
      
      // All menu items cases
      .addCase(getAllMenuItems.pending, (state) => {
        state.loading.allItems = true;
        state.error.allItems = null;
      })
      .addCase(getAllMenuItems.fulfilled, (state, action: PayloadAction<MenuItem[]>) => {
        state.loading.allItems = false;
        state.allItemsLoaded = true;
        state.menuItems = action.payload;
        
        // If we have restaurant data, process popular items
        if (state.data) {
          const popularCategory = state.data.catagories.find(
            cat => cat.name.toLowerCase() === 'popular'
          );
          
          if (popularCategory) {
            state.popularItems = action.payload.filter(item => 
              popularCategory.ids.includes(item.id)
            );
            
            if (!state.categoriesLoaded.includes('popular')) {
              state.categoriesLoaded.push('popular');
            }
          }
        }
        
        // Mark all categories as loaded if we've loaded all menu items
        if (state.data) {
          state.categoriesLoaded = state.data.catagories.map(cat => cat.name);
        }
      })
      .addCase(getAllMenuItems.rejected, (state, action) => {
        state.loading.allItems = false;
        state.error.allItems = action.payload as string;
      });
  },
});

export const { clearErrors, processPopularItems } = restaurantSlice.actions;
export default restaurantSlice.reducer;

// Selector to get all menu items for a specific category by name
export const selectMenuItemsByCategoryName = (state: { restaurant: RestaurantState }, categoryName: string) => {
  const restaurant = state.restaurant.data;
  if (!restaurant) return [];
  
  // Find the category by name
  const category = restaurant.catagories.find(cat => cat.name === categoryName);
  if (!category) return [];
  
  // Return menu items that have IDs in the category's ids array
  return state.restaurant.menuItems.filter(item => 
    category.ids.includes(item.id)
  );
};

// Selector to get popular items
export const selectPopularItems = (state: { restaurant: RestaurantState }) => {
  return state.restaurant.popularItems;
};


// Selector to get popular items
export const selectMenuItems = (state: { restaurant: RestaurantState }) => {
  return state.restaurant.menuItems;
};

// Check if a specific category has been loaded
export const selectIsCategoryLoaded = (state: { restaurant: RestaurantState }, categoryName: string) => {
  return state.restaurant.categoriesLoaded.includes(categoryName);
};

// Get all categories with their name and item counts
export const selectCategories = (state: { restaurant: RestaurantState }) => {
  const restaurant = state.restaurant.data;
  if (!restaurant) return [];
  
  return restaurant.catagories.map(category => {
    // Count how many of this category's items we have loaded
    const loadedItemsCount = state.restaurant.menuItems.filter(item => 
      category.ids.includes(item.id)
    ).length;
    
    return {
      name: category.name,
      ids: category.ids,
      itemCount: category.ids.length,
      loadedItemCount: loadedItemsCount
    };
  });
};

// Determines whether to prioritize loading the restaurant data or all menu items
export const selectLoadingPriority = (state: { restaurant: RestaurantState }) => {
  const { data, menuItems, loading } = state.restaurant;
  
  // If restaurant data is still loading, prioritize that
  if (loading.restaurant) return 'restaurant';
  
  // If we have restaurant data but no menu items, prioritize loading all items
  if (data && menuItems.length === 0 && !loading.allItems) return 'allItems';
  
  // Both are loaded or loading
  return 'ready';
};