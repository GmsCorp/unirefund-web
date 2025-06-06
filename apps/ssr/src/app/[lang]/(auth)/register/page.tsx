"use server";

import RegisterForm from "@repo/ui/theme/auth/register";
import {getTenantByNameApi, signUpServerApi} from "@repo/actions/core/AccountService/actions";
import {getResourceData} from "src/language-data/core/AccountService";

export default async function Page({params}: {params: {lang: string}}) {
  const {lang} = params;
  const {languageData} = await getResourceData(lang);
  const isTenantDisabled = process.env.FETCH_TENANT !== "true";

  return (
    <div className="w-full">
      <RegisterForm
        isTenantDisabled={isTenantDisabled}
        languageData={languageData}
        onSubmitAction={signUpServerApi}
        onTenantSearchAction={getTenantByNameApi}
      />
    </div>
  );
}
