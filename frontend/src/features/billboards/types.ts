export type BillboardType = "OOH" | "DOOH";
export type BillboardStatus = "AVAILABLE" | "RESERVED" | "MAINTENANCE" | "INACTIVE";

export interface Billboard {
  id: string;
  ownerId: string;
  title: string;
  description?: string;
  type: BillboardType;
  format: string;
  city: string;
  country: string;
  address?: string;
  latitude: number;
  longitude: number;
  monthlyPrice: number;
  currency: string;
  status: BillboardStatus;
  imageUrl?: string;
}

export interface BillboardSearchParams {
  city?: string;
  country?: string;
  type?: BillboardType;
  status?: BillboardStatus;
}

export interface BillboardCreateInput {
  title: string;
  description?: string;
  type: BillboardType;
  format: string;
  city: string;
  country: string;
  address?: string;
  latitude: number;
  longitude: number;
  monthlyPrice: number;
  currency: string;
  imageUrl?: string;
}
