

// USER
export interface Address {
  id: string;
  address: string;
  isDefault: boolean;
}

export interface UserState {
  profile: {
    displayName: string;
    email: string;
    phoneNumber: string;
    loyaltyPoints: number;
    role: "customer" | "employee" | "admin";
    photoURL?: string | null;
    
  } | null;
  addresses: Address[];
  loading: boolean;
  error: string | null;
}


// resturant types
export interface RestaurantInfo {
  address: string;

  catagories: {
    ids: string[];
    names: string;
  }[];

  info: {
    name: string;
    description?: string;
    location?: string;
    OpeningTime?: string;
    contact: {
      email: string;
      phone: string;
    };
    
    openingHours: {
      day: string;
      timing: string;
    }[];

    social: {
      facebook?: string;
      instagram?: string;
    }[];
  };
}

// Menu Item Types

export interface MenuItem {
  name: string;
  description?: string;
  options: {
    IsExtra: boolean;
    isRequired: boolean;
    Question: string;
    subtext?: string;

    choices: {
      name: string;
      price: number;
    }[];

    tags: string[];
  }

}


