

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


