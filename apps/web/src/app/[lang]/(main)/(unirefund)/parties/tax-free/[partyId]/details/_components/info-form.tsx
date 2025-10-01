"use client";

import type {
  UniRefund_CRMService_TaxFrees_UpdateTaxFreeDto as UpdateTaxFreeDto,
  UniRefund_CRMService_TaxFrees_TaxFreeDto as TaxFreeDto,
  UniRefund_CRMService_TaxOffices_TaxOfficeDto as TaxOfficeDto,
} from "@repo/saas/CRMService";
import {$UniRefund_CRMService_TaxFrees_UpdateTaxFreeDto as $UpdateTaxFreeDto} from "@repo/saas/CRMService";
import {putTaxFreeByIdApi} from "@repo/actions/unirefund/CrmService/put-actions";
import {SchemaForm} from "@repo/ayasofyazilim-ui/organisms/schema-form";
import {createUiSchemaWithResource} from "@repo/ayasofyazilim-ui/organisms/schema-form/utils";
import {CustomComboboxWidget} from "@repo/ayasofyazilim-ui/organisms/schema-form/widgets";
import {handlePutResponse} from "@repo/utils/api";
import {useParams, useRouter} from "next/navigation";
import {useTransition} from "react";
import type {CRMServiceServiceResource} from "@/language-data/unirefund/CRMService";

export function TaxFreeForm({
  languageData,
  taxFreeDetails,
  taxOffices,
}: {
  languageData: CRMServiceServiceResource;
  taxFreeDetails: TaxFreeDto;
  taxOffices: TaxOfficeDto[];
}) {
  const {lang, partyId} = useParams<{lang: string; partyId: string}>();
  const isHeadquarter = taxFreeDetails.typeCode === "HEADQUARTER";
  const disabled = {
    "ui:options": {
      readOnly: true,
      disabled: true,
    },
  };
  const uiSchema = createUiSchemaWithResource({
    resources: languageData,
    name: "Form.TaxFree",
    schema: $UpdateTaxFreeDto,
    extend: {
      "ui:className": "grid md:grid-cols-2 gap-4 items-end",
      name: {
        ...(isHeadquarter && {"ui:className": "col-span-full"}),
      },
      taxOfficeId: {
        "ui:widget": "taxOfficeWidget",
      },
      telephone: {
        "ui:className": "col-span-full",
        "ui:field": "phone",
      },
      address: {
        "ui:field": "address",
      },
      email: {
        "ui:className": "col-span-full",
        "ui:field": "email",
      },
      vatNumber: {
        ...(!isHeadquarter && disabled),
      },
    },
  });
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  return (
    <SchemaForm<UpdateTaxFreeDto>
      className="sticky top-0 h-fit"
      defaultSubmitClassName="[&>button]:w-full"
      disabled={isPending}
      formData={{
        ...taxFreeDetails,
        name: taxFreeDetails.name || "",
        status: taxFreeDetails.status,
      }}
      locale={lang}
      onSubmit={({formData}) => {
        if (!formData) return;
        startTransition(() => {
          void putTaxFreeByIdApi({
            id: partyId,
            requestBody: {
              ...formData,
            },
          }).then((res) => {
            handlePutResponse(res, router);
          });
        });
      }}
      schema={{
        ...$UpdateTaxFreeDto,
        properties: {
          ...$UpdateTaxFreeDto.properties,
        },
      }}
      submitText={languageData["Form.TaxFree.Update"]}
      uiSchema={uiSchema}
      widgets={{
        taxOfficeWidget: CustomComboboxWidget<TaxOfficeDto>({
          languageData,
          list: taxOffices,
          selectIdentifier: "id",
          selectLabel: "name",
        }),
      }}
      withScrollArea={false}
    />
  );
}
