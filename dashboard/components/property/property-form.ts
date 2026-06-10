import type { DashboardProperty } from "@/dashboard/components/property/types";
import { formatStoredNumber } from "@/lib/property-form-utils";

export type PropertyFormState = {
  title: string;
  description: string;
  category: string;
  status: string;
  occupancyStatus: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  plotNumber: string;
  microMarketLocality: string;
  buildingName: string;
  roadName: string;
  plotArea: string;
  plotAreaUnit: string;
  totalCarpetArea: string;
  superArea: string;
  totalFloorsInBuilding: string;
  floorsOffered: string;
  totalCarParks: string;
  carParkingIncluded: string;
  parkingTypes: string[];
  constructionStatus: string;
  ageOfProperty: string;
  furnishingStatus: string;
  furnishingOther: string;
  totalPrice: string;
  pricePerSqft: string;
  propertyTax: string;
  estimatedMonthlyMaintenance: string;
  buildingType: string;
  area: string;
};

export const emptyPropertyForm = (): PropertyFormState => ({
  title: "",
  description: "",
  category: "",
  status: "Draft",
  occupancyStatus: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
  plotNumber: "",
  microMarketLocality: "",
  buildingName: "",
  roadName: "",
  plotArea: "",
  plotAreaUnit: "Sq. Yards",
  totalCarpetArea: "",
  superArea: "",
  totalFloorsInBuilding: "",
  floorsOffered: "",
  totalCarParks: "",
  carParkingIncluded: "",
  parkingTypes: [],
  constructionStatus: "",
  ageOfProperty: "",
  furnishingStatus: "",
  furnishingOther: "",
  totalPrice: "",
  pricePerSqft: "",
  propertyTax: "",
  estimatedMonthlyMaintenance: "",
  buildingType: "",
  area: "",
});

export function mapPropertyToForm(
  property: DashboardProperty,
): PropertyFormState {
  return {
    title: property.title ?? "",
    description: property.description ?? "",
    category: property.category ?? "",
    status: property.status ?? "Draft",
    occupancyStatus: property.occupancyStatus ?? "",
    address: property.address ?? "",
    city: property.city ?? "",
    state: property.state ?? "",
    pincode: property.pincode ?? "",
    plotNumber: property.plotNumber ?? "",
    microMarketLocality: property.microMarketLocality ?? "",
    buildingName: property.buildingName ?? "",
    roadName: property.roadName ?? "",
    plotArea: formatStoredNumber(property.plotArea),
    plotAreaUnit: property.plotAreaUnit ?? "Sq. Yards",
    totalCarpetArea: formatStoredNumber(property.totalCarpetArea),
    superArea: formatStoredNumber(property.superArea),
    totalFloorsInBuilding: formatStoredNumber(property.totalFloorsInBuilding),
    floorsOffered: property.floorsOffered ?? "",
    totalCarParks: formatStoredNumber(property.totalCarParks),
    carParkingIncluded: property.carParkingIncluded ?? "",
    parkingTypes: property.parkingTypes ?? [],
    constructionStatus: property.constructionStatus ?? "",
    ageOfProperty: formatStoredNumber(property.ageOfProperty),
    furnishingStatus: property.furnishingStatus ?? "",
    furnishingOther: property.furnishingOther ?? "",
    totalPrice: formatStoredNumber(property.totalPrice),
    pricePerSqft: formatStoredNumber(property.pricePerSqft),
    propertyTax: formatStoredNumber(property.propertyTax),
    estimatedMonthlyMaintenance: formatStoredNumber(
      property.estimatedMonthlyMaintenance,
    ),
    buildingType: property.buildingType ?? "",
    area: formatStoredNumber(property.area),
  };
}
