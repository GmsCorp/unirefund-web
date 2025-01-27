"use server";

import { auth } from "@repo/utils/auth/next-auth";
import { getMerchantAffiliationByIdApi } from "src/actions/unirefund/CrmService/actions";
import ErrorComponent from "src/app/[lang]/(main)/_components/error-component";
import { getResourceData } from "src/language-data/unirefund/CRMService";
import AffiliationsTable from "./table";

interface SearchParamType {
  affiliationCodeId?: number;
  email?: string;
  entityInformationTypeCode?: "INDIVIDUAL" | "ORGANIZATION";
  id: string;
  maxResultCount?: number;
  name?: string;
  skipCount?: number;
  sorting?: string;
  telephone?: string;
}

async function getApiRequests(filters: SearchParamType) {
  try {
    const session = await auth();
    const apiRequests = await Promise.all([
      getMerchantAffiliationByIdApi(filters, session),
    ]);
    return {
      type: "success" as const,
      data: apiRequests,
    };
  } catch (error) {
    const err = error as { data?: string; message?: string };
    return {
      type: "error" as const,
      message: err.message,
    };
  }
}
export default async function Page({
  params,
  searchParams,
}: {
  params: {
    partyId: string;
    lang: string;
  };
  searchParams?: SearchParamType;
}) {
  const { lang, partyId } = params;
  const { languageData } = await getResourceData(lang);

  const apiRequests = await getApiRequests({
    ...searchParams,
    id: partyId,
  });

  if (apiRequests.type === "error") {
    return (
      <ErrorComponent
        languageData={languageData}
        message={apiRequests.message || "Unknown error occurred"}
      />
    );
  }

  const [subStoresResponse] = apiRequests.data;

  return (
    <AffiliationsTable
      affiliationCodes={[]}
      languageData={languageData}
      locale={lang}
      partyId={partyId}
      response={subStoresResponse.data}
    />
  );
}
