"use server";

import { auth } from "@repo/utils/auth/next-auth";
import { getCustomsApi } from "src/actions/unirefund/CrmService/actions";
import ErrorComponent from "src/app/[lang]/(main)/_components/error-component";
import { getResourceData } from "src/language-data/unirefund/ExportValidationService";
import { isUnauthorized } from "src/utils/page-policy/page-policy";
import Form from "./_components/form";

async function getApiRequests() {
  try {
    const session = await auth();
    const apiRequests = await Promise.all([getCustomsApi({}, session)]);
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

export default async function Page({ params }: { params: { lang: string } }) {
  const { lang } = params;
  const { languageData } = await getResourceData(lang);
  await isUnauthorized({
    requiredPolicies: ["ExportValidationService.ExportValidations.Create"],
    lang,
  });

  const apiRequests = await getApiRequests();
  if (apiRequests.type === "error") {
    return (
      <ErrorComponent
        languageData={languageData}
        message={apiRequests.message || "Unknown error occurred"}
      />
    );
  }
  const [customsResponse] = apiRequests.data;
  return (
    <>
      <Form
        customList={customsResponse.data.items || []}
        languageData={languageData}
      />
      <div className="hidden" id="page-description">
        {languageData["ExportValidation.Create.Description"]}
      </div>
    </>
  );
}
