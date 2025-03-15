export interface HotelLocation {
  lat: number;
  lon: number;
}

export interface HotelZone {
  en_name: string;
  kr_name: string;
  attributes: {
    JPDCode: string;
  };
}

export interface HotelAttributes {
  JPCode: string;
  HTCode: string;
  JPDCode: string;
  PJPDCode: string;
}

export interface HotelCategory {
  attributes: {
    Type: string;
    Code: string;
  };
}

export interface HotelCity {
  en_value: string;
  kr_value: string;
  attributes: {
    JPDCode: string;
  };
}

export interface Hotel {
  id: string;
  ranking: number;
  kr_name: string;
  en_name: string;
  kr_name_manual: string;
  use_manual_name: boolean;
  geopin: string;
  attributes: HotelAttributes;
  Zone: HotelZone;
  location: HotelLocation;
  Latitude: string;
  Longitude: string;
  HotelCategory: HotelCategory;
  City: HotelCity;
  en_address: string;
  kr_address: string;
}

export interface Zone {
  id: number;
  en_name: string;
  kr_name: string;
  kr_name_manual: string;
  use_manual_name: boolean;
  address: string;
  geopin: string;
  location: HotelLocation;
}

export interface ElasticsearchResponse<T> {
  hits: {
    total: {
      value: number;
      relation: string;
    };
    hits: Array<{
      _source: T;
      _id: string;
      _score: number;
    }>;
  };
}
