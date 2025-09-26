"use server";
import type {
  GetApiAuditLoggingAuditLogsData,
  GetApiAuditLoggingAuditLogsEntityChangesData,
  GetApiFeatureManagementFeaturesData,
  GetApiLanguageManagementLanguagesData,
  GetApiLanguageManagementLanguageTextsByResourceNameByCultureNameByNameData,
  GetApiLanguageManagementLanguageTextsData,
  GetApiPermissionManagementPermissionsData,
  GetApiTextTemplateManagementTemplateDefinitionsData,
} from "@ayasofyazilim/core-saas/AdministrationService";
import { structuredError, structuredResponse, structuredSuccessResponse } from "@repo/utils/api";
import type { Session } from "next-auth";
import { getAdministrationServiceClient } from "../lib";

export async function getPermissionsApi(data: GetApiPermissionManagementPermissionsData) {
  try {
    const client = await getAdministrationServiceClient();
    const dataResponse = await client.permissions.getApiPermissionManagementPermissions(data);
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}

export async function getFeaturesApi(data: GetApiFeatureManagementFeaturesData) {
  try {
    const client = await getAdministrationServiceClient();
    const dataResponse = await client.features.getApiFeatureManagementFeatures(data);
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}

export async function getCountrySettingsApi() {
  try {
    const client = await getAdministrationServiceClient();
    const dataResponse = await client.countrySetting.getApiAdministrationServiceCountrySettings();
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}

export async function getTextTemplateApi(data: GetApiTextTemplateManagementTemplateDefinitionsData) {
  try {
    const client = await getAdministrationServiceClient();
    const dataResponse = await client.textTemplateDefinitions.getApiTextTemplateManagementTemplateDefinitions(data);
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}

export async function getAuditLogsApi(data: GetApiAuditLoggingAuditLogsData, session: Session | null) {
  try {
    const client = await getAdministrationServiceClient(session);
    const dataResponse = await client.auditLogs.getApiAuditLoggingAuditLogs(data);
    return structuredSuccessResponse(dataResponse);
  } catch (error) {
    throw structuredError(error);
  }
}

export async function getAuditLogsEntityChangesApi(
  data: GetApiAuditLoggingAuditLogsEntityChangesData,
  session: Session | null,
) {
  try {
    const client = await getAdministrationServiceClient(session);
    const dataResponse = await client.auditLogs.getApiAuditLoggingAuditLogsEntityChanges(data);
    return structuredSuccessResponse(dataResponse);
  } catch (error) {
    throw structuredError(error);
  }
}

export async function getLanguagesApi(data: GetApiLanguageManagementLanguagesData) {
  try {
    const client = await getAdministrationServiceClient();
    const dataResponse = await client.languages.getApiLanguageManagementLanguages(data);
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}

export async function getAllLanguagesApi(session: Session | null) {
  try {
    const client = await getAdministrationServiceClient(session);
    const dataResponse = await client.languages.getApiLanguageManagementLanguagesAll();
    return structuredSuccessResponse(dataResponse);
  } catch (error) {
    throw structuredError(error);
  }
}

export async function getLanguageDetailsByIdApi(id: string) {
  try {
    const client = await getAdministrationServiceClient();
    const dataResponse = await client.languages.getApiLanguageManagementLanguagesById({ id });
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}

export async function getLanguagesResourcesApi() {
  try {
    const client = await getAdministrationServiceClient();
    const dataResponse = await client.languages.getApiLanguageManagementLanguagesResources();
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}

export async function getLanguagesCultureListApi() {
  try {
    const client = await getAdministrationServiceClient();
    const dataResponse = await client.languages.getApiLanguageManagementLanguagesCultureList();
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}

export async function getLanguageTextsApi(data: GetApiLanguageManagementLanguageTextsData) {
  try {
    const client = await getAdministrationServiceClient();
    const dataResponse = await client.languageTexts.getApiLanguageManagementLanguageTexts(data);
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}
export async function getLanguageTextsDetailsByResourceNameByCultureNameByNameApi(
  data: GetApiLanguageManagementLanguageTextsByResourceNameByCultureNameByNameData,
) {
  try {
    const client = await getAdministrationServiceClient();
    const dataResponse =
      await client.languageTexts.getApiLanguageManagementLanguageTextsByResourceNameByCultureNameByName(data);
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}
