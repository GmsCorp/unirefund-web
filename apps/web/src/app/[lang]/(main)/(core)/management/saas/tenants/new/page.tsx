"use server";

import {getAllLanguagesApi} from "@repo/actions/core/AdministrationService/actions";
import {getAllEditionsApi} from "@repo/actions/core/SaasService/actions";
import {getAllCountriesApi, getCurrencyApi} from "@repo/actions/unirefund/LocationService/actions";
import ErrorComponent from "@repo/ui/components/error-component";
import {structuredError} from "@repo/utils/api";
import {auth} from "@repo/utils/auth/next-auth";
import {isUnauthorized} from "@repo/utils/policies";
import {getResourceData} from "src/language-data/core/SaasService";
import Form from "./_components/form";

async function getApiRequests() {
  try {
    const session = await auth();
    const requiredRequests = await Promise.all([
      getAllEditionsApi(session),
      getAllLanguagesApi(session),
      getAllCountriesApi({}, session),
      getCurrencyApi({}, session),
    ]);
    const optionalRequests = await Promise.allSettled([]);
    return {requiredRequests, optionalRequests};
  } catch (error) {
    return structuredError(error);
  }
}
export default async function Page({params}: {params: {lang: string}}) {
  const {lang} = params;
  const {languageData} = await getResourceData(lang);
  await isUnauthorized({
    requiredPolicies: ["Saas.Tenants.Create"],
    lang,
  });

  const apiRequests = await getApiRequests();
  if ("message" in apiRequests) {
    return <ErrorComponent languageData={languageData} message={apiRequests.message} />;
  }
  const {requiredRequests} = apiRequests;
  const [editionsResponse, languagesResponse, countriesResponse, currenciesResponse] = requiredRequests;

  return (
    <>
      <Form
        countryList={countriesResponse.data.items || []}
        currencyList={currenciesResponse.data.items || []}
        editionList={editionsResponse.data}
        languageData={languageData}
        languageList={languagesResponse.data.items || []}
      />
      <div className="hidden" id="page-description">
        {languageData["Tenant.Create.Description"]}
      </div>
    </>
  );
}
