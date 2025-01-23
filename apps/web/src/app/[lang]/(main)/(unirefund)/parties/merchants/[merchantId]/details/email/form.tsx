"use client";

import type { GetApiCrmServiceMerchantsByIdEmailsResponse } from "@ayasofyazilim/saas/CRMService";
import AutoForm, {
  AutoFormSubmit,
} from "@repo/ayasofyazilim-ui/organisms/auto-form";
import { emailSchema } from "@repo/ui/utils/table/form-schemas";
import { useRouter } from "next/navigation";
import { handlePutResponse } from "src/actions/core/api-utils-client";
import { putMerchantEmailApi } from "src/actions/unirefund/CrmService/put-actions";
import type { EmailAddressUpdateDto } from "src/actions/unirefund/CrmService/types";
import type { CRMServiceServiceResource } from "src/language-data/unirefund/CRMService";

function EmailForm({
  languageData,
  merchantId,
  emailData,
}: {
  languageData: CRMServiceServiceResource;
  merchantId: string;
  emailData: GetApiCrmServiceMerchantsByIdEmailsResponse;
}) {
  const router = useRouter();
  const emailValues = emailData[0];

  function handleSubmit(formData: EmailAddressUpdateDto) {
    void putMerchantEmailApi({
      requestBody: formData,
      id: merchantId,
      emailId: emailValues.id || "",
    }).then((response) => {
      handlePutResponse(response, router);
    });
  }
  return (
    <AutoForm
      fieldConfig={{
        emailAddress: {
          inputProps: {
            type: "email",
          },
        },
      }}
      formClassName="pb-40 "
      formSchema={emailSchema}
      onSubmit={(values) => {
        handleSubmit(values as EmailAddressUpdateDto);
      }}
      values={emailValues}
    >
      <AutoFormSubmit className="float-right">
        {languageData.Save}
      </AutoFormSubmit>
    </AutoForm>
  );
}

export default EmailForm;
