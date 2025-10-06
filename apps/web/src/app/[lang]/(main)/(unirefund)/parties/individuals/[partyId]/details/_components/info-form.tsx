"use client";

import type {
  UniRefund_CRMService_Individuals_UpdateIndividualDto as UpdateIndividualDto,
  UniRefund_CRMService_Individuals_IndividualDto as IndividualDto,
} from "@repo/saas/CRMService";
import {$UniRefund_CRMService_Individuals_UpdateIndividualDto as $UpdateIndividualDto} from "@repo/saas/CRMService";
import {putIndividualByIdApi} from "@repo/actions/unirefund/CrmService/put-actions";
import {SchemaForm} from "@repo/ayasofyazilim-ui/organisms/schema-form";
import {createUiSchemaWithResource} from "@repo/ayasofyazilim-ui/organisms/schema-form/utils";
import {handlePutResponse} from "@repo/utils/api";
import {useParams, useRouter} from "next/navigation";
import {useTransition} from "react";
import type {CRMServiceServiceResource} from "@/language-data/unirefund/CRMService";

export function IndividualForm({
  languageData,
  individualDetails,
}: {
  languageData: CRMServiceServiceResource;
  individualDetails: IndividualDto;
}) {
  const {lang, partyId} = useParams<{lang: string; partyId: string}>();
  const uiSchema = createUiSchemaWithResource({
    resources: languageData,
    name: "Form.Individual",
    schema: $UpdateIndividualDto,
    extend: {
      displayLabel: false,
      "ui:className": "grid md:grid-cols-2 gap-4 p-0 pt-5 items-end border-none",
    },
  });
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  return (
    <SchemaForm<UpdateIndividualDto>
      className="top-0 h-fit lg:sticky"
      defaultSubmitClassName="[&>button]:w-full"
      disabled={isPending}
      formData={individualDetails}
      locale={lang}
      onSubmit={({formData}) => {
        if (!formData) return;
        startTransition(() => {
          void putIndividualByIdApi({
            id: partyId,
            requestBody: formData,
          }).then((res) => {
            handlePutResponse(res, router);
          });
        });
      }}
      schema={$UpdateIndividualDto}
      submitText={languageData["Form.Individual.Update"]}
      uiSchema={uiSchema}
      withScrollArea={false}
    />
  );
}
