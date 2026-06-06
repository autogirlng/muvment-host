import { photoViewOptions } from "@/utils/data";
import { toScreamingSnakeCase } from "@/utils/functions";
import {
  CloudinaryDocumentUpload,
  CloudinaryPhotoUpload,
  DocumentVehicleInformationFormValues,
  DocumentVehicleInformationValues,
  VehicleInformation,
  VehicleInformationStepper,
  VehiclePhotos,
  VehiclePhotosFormValues,
} from "@/types";
import { VEHICLE_SELECT_PLACEHOLDER } from "@/utils/constants";
import { uploadToCloudinary } from "@/utils/functions/uploadToCloudinary";
import type { DriverProvisionMode } from "@/types/vehicle";

type VehicleOutskirtSource = Pick<
  VehicleInformation,
  "outOfBoundsAreaIds" | "outOfBoundsAreas"
>;

/** Flatten nested make/model/type from GET /vehicles/{id} into form-friendly IDs. */
export function normalizeVehicleOnboardingData(
  vehicle:
    | VehicleInformation
    | VehicleInformationStepper
    | Partial<VehicleInformation>
    | null
    | undefined
): VehicleInformation | null {
  if (!vehicle) return null;

  const nested = vehicle as VehicleInformationStepper;

  return {
    ...(vehicle as VehicleInformation),
    vehicleTypeId:
      vehicle.vehicleTypeId || nested.vehicleType?.id || "",
    vehicleMakeId:
      vehicle.vehicleMakeId || nested.vehicleMake?.id || "",
    vehicleModelId:
      vehicle.vehicleModelId || nested.vehicleModel?.id || "",
  };
}

export function getVehicleOutOfBoundsAreaIds(
  vehicle?: VehicleOutskirtSource | null
): string[] {
  if (!vehicle) return [];
  if (vehicle.outOfBoundsAreaIds?.length) return vehicle.outOfBoundsAreaIds;
  return vehicle.outOfBoundsAreas?.map((area) => area.id) ?? [];
}

export function vehicleHasOutskirtConfig(
  vehicle?: VehicleOutskirtSource | null
): boolean {
  if (!vehicle) return false;
  return getVehicleOutOfBoundsAreaIds(vehicle).length > 0;
}

export function buildAvailabilityDriverFields(vehicle?: VehicleInformation | null) {
  const assignedDriverId = vehicle?.assignedDriver?.id;
  const willProvideDriver = vehicle?.willProvideDriver === true;

  return {
    driverMode: (willProvideDriver && assignedDriverId
      ? "existing"
      : "") as DriverProvisionMode,
    driverId: assignedDriverId || VEHICLE_SELECT_PLACEHOLDER,
    newDriverFirstName: "",
    newDriverLastName: "",
    newDriverPhoneNumber: "",
    newDriverLicenseNumber: "",
    newDriverLicenseExpiryDate: "",
  };
}

export function mergeVehicleOnboardingState(
  previous: VehicleInformation | null,
  incoming: Partial<VehicleInformation> | null | undefined
): VehicleInformation {
  if (!incoming) return previous as VehicleInformation;

  const normalizedIncoming = normalizeVehicleOnboardingData(incoming);
  const normalizedPrevious = normalizeVehicleOnboardingData(previous);

  return {
    ...(normalizedPrevious ?? {}),
    ...(normalizedIncoming ?? {}),
    assignedDriver:
      incoming.assignedDriver !== undefined
        ? incoming.assignedDriver
        : previous?.assignedDriver,
    outOfBoundsAreaIds:
      incoming.outOfBoundsAreaIds?.length
        ? incoming.outOfBoundsAreaIds
        : getVehicleOutOfBoundsAreaIds(previous) ||
          getVehicleOutOfBoundsAreaIds(incoming as VehicleInformation),
    outOfBoundsAreas: incoming.outOfBoundsAreas ?? previous?.outOfBoundsAreas,
    supportedBookingTypes:
      incoming.supportedBookingTypes?.length
        ? incoming.supportedBookingTypes
        : previous?.supportedBookingTypes ?? [],
    photos: incoming.photos?.length ? incoming.photos : previous?.photos ?? [],
    documents: incoming.documents?.length
      ? incoming.documents
      : previous?.documents ?? [],
    features: incoming.features?.length
      ? incoming.features
      : previous?.features ?? [],
  } as VehicleInformation;
}

const DOCUMENT_FORM_KEYS: (keyof DocumentVehicleInformationValues)[] = [
  "proofOfOwnership",
  "vehicleRegistration",
  "insuranceCertificate",
  "inspectionReport",
  "maintenanceHistory",
  "authorizationLetter",
];

export function screamingSnakeToCamelCase(str: string): string {
  return str
    .toLowerCase()
    .split("_")
    .map((part, i) => (i === 0 ? part : part.charAt(0).toUpperCase() + part.slice(1)))
    .join("");
}

const EMPTY_PHOTOS: VehiclePhotos = {
  frontView: "",
  backView: "",
  sideView1: "",
  sideView2: "",
  interior: "",
  other: "",
};

export function buildVehiclePhotosInitialValues(
  vehicle?: Pick<VehicleInformation, "photos"> | null
): VehiclePhotos {
  if (!vehicle?.photos?.length) return { ...EMPTY_PHOTOS };

  const result = { ...EMPTY_PHOTOS };

  photoViewOptions.forEach((view, index) => {
    const photo = vehicle.photos[index];
    if (!photo?.cloudinaryUrl) return;

    const extended = photo as CloudinaryPhotoUpload & {
      viewType?: string;
      photoView?: string;
    };
    const viewKey = extended.viewType ?? extended.photoView;

    if (viewKey) {
      const camelKey = screamingSnakeToCamelCase(viewKey);
      if (camelKey in result) {
        result[camelKey as keyof VehiclePhotos] = photo.cloudinaryUrl;
        return;
      }
    }

    result[view.name as keyof VehiclePhotos] = photo.cloudinaryUrl;
  });

  return result;
}

export function buildPhotoViewsFromValues(initialValues: VehiclePhotos) {
  return photoViewOptions.map((view, index) => ({
    ...view,
    disabled:
      index === 0
        ? false
        : !initialValues[photoViewOptions[index - 1].name as keyof VehiclePhotos],
  }));
}

const EMPTY_DOCUMENTS: DocumentVehicleInformationValues = {
  authorizationLetter: "",
  insuranceCertificate: "",
  maintenanceHistory: "",
  proofOfOwnership: "",
  inspectionReport: "",
  vehicleRegistration: "",
};

export function buildDocumentInitialValues(
  vehicle?: Pick<VehicleInformation, "documents"> | null
): DocumentVehicleInformationValues {
  if (!vehicle?.documents?.length) return { ...EMPTY_DOCUMENTS };

  const result = { ...EMPTY_DOCUMENTS };

  for (const doc of vehicle.documents) {
    if (!doc?.documentType || !doc?.cloudinaryUrl) continue;
    const key = screamingSnakeToCamelCase(doc.documentType);
    if (key in result) {
      result[key as keyof DocumentVehicleInformationValues] = doc.cloudinaryUrl;
    }
  }

  return result;
}

function isExistingUrl(value: unknown): value is string {
  return typeof value === "string" && value.includes("http");
}

export async function resolvePhotosForPatch(
  values: VehiclePhotosFormValues,
  existingPhotos: CloudinaryPhotoUpload[] = []
): Promise<CloudinaryPhotoUpload[]> {
  const formData = new FormData();
  const viewNames = photoViewOptions.map((view) => view.name);

  for (const name of viewNames) {
    const value = values[name as keyof VehiclePhotos];
    if (value instanceof File) {
      formData.append(name, value);
    }
  }

  const uploaded = (await uploadToCloudinary(formData, "photos")).filter(
    Boolean
  ) as CloudinaryPhotoUpload[];

  let uploadIndex = 0;

  return viewNames
    .map((name, index) => {
      const value = values[name as keyof VehiclePhotos];

      if (value instanceof File) {
        const item = uploaded[uploadIndex++];
        if (item) return { ...item, isPrimary: index === 0 };
        return null;
      }

      if (isExistingUrl(value)) {
        const fromExisting =
          existingPhotos.find((photo) => photo.cloudinaryUrl === value) ??
          existingPhotos[index];
        if (fromExisting) return { ...fromExisting, isPrimary: index === 0 };
        return {
          cloudinaryUrl: value,
          cloudinaryPublicId: "",
          isPrimary: index === 0,
        };
      }

      return null;
    })
    .filter((photo): photo is CloudinaryPhotoUpload => photo !== null && !!photo.cloudinaryUrl);
}

export async function resolveDocumentsForPatch(
  values: DocumentVehicleInformationFormValues,
  existingDocuments: CloudinaryDocumentUpload[] = []
): Promise<CloudinaryDocumentUpload[]> {
  const results: CloudinaryDocumentUpload[] = [];

  for (const key of DOCUMENT_FORM_KEYS) {
    const value = values[key];
    if (!value) continue;

    const documentType = toScreamingSnakeCase(key);

    if (value instanceof File) {
      const formData = new FormData();
      formData.append(key, value);
      const uploaded = (await uploadToCloudinary(formData, "documents")).filter(
        Boolean
      ) as CloudinaryDocumentUpload[];
      if (uploaded[0]) results.push(uploaded[0]);
      continue;
    }

    if (isExistingUrl(value)) {
      const fromExisting = existingDocuments.find(
        (doc) => doc.documentType === documentType || doc.cloudinaryUrl === value
      );
      results.push(
        fromExisting ?? {
          documentType,
          cloudinaryUrl: value,
          cloudinaryPublicId: "",
        }
      );
    }
  }

  return results;
}
