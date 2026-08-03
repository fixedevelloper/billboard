export type BillboardType = "OOH" | "DOOH";
export type BillboardStatus = "AVAILABLE" | "RESERVED" | "MAINTENANCE" | "INACTIVE";

export interface Billboard {
  id: string;
  ownerId: string;
  codeReference: string;
  title: string;
  description?: string;
  type: BillboardType;
  format: string;
  width?: number;
  height?: number;
  facesCount: number;
  illuminated: boolean;
  digital: boolean;
  resolution?: string;
  spotDurationSeconds?: number;
  cityId: string | null;
  city: string;
  country: string;
  address?: string;
  environmentType?: string;
  orientation?: string;
  latitude: number;
  longitude: number;
  dailyImpressions?: number;
  dailyPrice?: number;
  monthlyPrice: number;
  currency: string;
  minBookingDays: number;
  status: BillboardStatus;
  imageUrl?: string;
  galleryUrls: string[];
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
  width?: number;
  height?: number;
  facesCount?: number;
  illuminated?: boolean;
  digital?: boolean;
  resolution?: string;
  spotDurationSeconds?: number;
  cityId: string;
  address?: string;
  environmentType?: string;
  orientation?: string;
  latitude: number;
  longitude: number;
  dailyImpressions?: number;
  dailyPrice: number;
  monthlyPrice?: number;
  currency: string;
  minBookingDays?: number;
  imageUrl?: string;
  galleryUrls?: string[];
}
export type BillboardUpdateInput = Partial<BillboardCreateInput>;