import type {
  Volo_Abp_LanguageManagement_Dto_LanguageDto,
  Volo_Abp_LanguageManagement_Dto_UpdateLanguageDto,
} from "@ayasofyazilim/core-saas/AdministrationService";
import {
  $Volo_Abp_LanguageManagement_Dto_LanguageDto,
  $Volo_Abp_LanguageManagement_Dto_UpdateLanguageDto,
} from "@ayasofyazilim/core-saas/AdministrationService";
import {deleteLanguageByIdApi} from "@repo/actions/core/AdministrationService/delete-actions";
import {putLanguageApi, putLanguagesByIdSetAsDefaultApi} from "@repo/actions/core/AdministrationService/put-actions";
import type {
  TanstackTableColumnLink,
  TanstackTableCreationProps,
  TanstackTableRowActionsType,
  TanstackTableTableActionsType,
} from "@repo/ayasofyazilim-ui/molecules/tanstack-table/types";
import {tanstackTableCreateColumnsByRowData} from "@repo/ayasofyazilim-ui/molecules/tanstack-table/utils";
import {SchemaForm} from "@repo/ayasofyazilim-ui/organisms/schema-form";
import {createUiSchemaWithResource} from "@repo/ayasofyazilim-ui/organisms/schema-form/utils";
import {handleDeleteResponse, handlePutResponse} from "@repo/utils/api";
import type {Policy} from "@repo/utils/policies";
import {isActionGranted} from "@repo/utils/policies";
import {CheckCircle, Languages, Plus, Trash2, XCircle} from "lucide-react";
import type {AppRouterInstance} from "next/dist/shared/lib/app-router-context.shared-runtime";
import type {AdministrationServiceResource} from "src/language-data/core/AdministrationService";

type LanguagesTable = TanstackTableCreationProps<Volo_Abp_LanguageManagement_Dto_LanguageDto>;

const links: Partial<Record<keyof Volo_Abp_LanguageManagement_Dto_LanguageDto, TanstackTableColumnLink>> = {};

function languagesTableActions(
  languageData: AdministrationServiceResource,
  router: AppRouterInstance,
  grantedPolicies: Record<Policy, boolean>,
) {
  const actions: TanstackTableTableActionsType<Volo_Abp_LanguageManagement_Dto_LanguageDto>[] = [];
  if (isActionGranted(["LanguageManagement.Languages.Create"], grantedPolicies)) {
    actions.push({
      type: "simple",
      actionLocation: "table",
      cta: languageData["Language.New"],
      icon: Plus,
      onClick: () => {
        router.push("languages/new");
      },
    });
  }
  return actions;
}
function languagesRowActions(
  languageData: AdministrationServiceResource,
  router: AppRouterInstance,
  grantedPolicies: Record<Policy, boolean>,
) {
  const actions: TanstackTableRowActionsType<Volo_Abp_LanguageManagement_Dto_LanguageDto>[] = [];
  if (isActionGranted(["LanguageManagement.Languages.ChangeDefault"], grantedPolicies)) {
    actions.push({
      type: "confirmation-dialog",
      cta: languageData["Language.Default.Language"],
      title: languageData["Form.Language.isDefaultLanguage"],
      actionLocation: "row",
      confirmationText: languageData["Language.Confirm"],
      cancelText: languageData.Cancel,
      description: languageData["Language.Default.Assurance"],
      icon: Languages,
      onConfirm: (row) => {
        void putLanguagesByIdSetAsDefaultApi(row.id || "").then((response) => {
          handlePutResponse(response, router);
        });
      },
    });
  }
  if (isActionGranted(["LanguageManagement.Languages.Delete"], grantedPolicies)) {
    actions.push({
      type: "confirmation-dialog",
      cta: languageData.Delete,
      title: languageData["Language.Delete"],
      actionLocation: "row",
      confirmationText: languageData["Language.Confirm"],
      cancelText: languageData.Cancel,
      description: languageData["Delete.Assurance"],
      icon: Trash2,
      onConfirm: (row) => {
        void deleteLanguageByIdApi(row.id || "").then((response) => {
          handleDeleteResponse(response, router);
        });
      },
    });
  }
  return actions;
}
const languagesColumns = (locale: string, languageData: AdministrationServiceResource) => {
  return tanstackTableCreateColumnsByRowData<Volo_Abp_LanguageManagement_Dto_LanguageDto>({
    rows: $Volo_Abp_LanguageManagement_Dto_LanguageDto.properties,
    languageData: {
      languageData,
      constantKey: "Form.Language",
    },
    config: {
      locale,
    },
    links,
    badges: {
      displayName: {
        values: [
          {
            position: "after",
            label: languageData["Form.Language.isDefaultLanguage"],
            badgeClassName: "text-green-700 bg-green-100 border-green-500",
            conditions: [
              {
                when: (value) => value === true,
                conditionAccessorKey: "isDefaultLanguage",
              },
            ],
          },
        ],
      },
    },
    faceted: {
      isEnabled: {
        options: [
          {
            label: "Yes",
            when: (value) => {
              return Boolean(value);
            },
            value: "true",
            icon: CheckCircle,
            iconClassName: "text-green-700",
            hideColumnValue: true,
          },
          {
            label: "No",
            when: (value) => {
              return !value;
            },
            value: "false",
            icon: XCircle,
            iconClassName: "text-red-700",
            hideColumnValue: true,
          },
        ],
      },
    },
    expandRowTrigger: "displayName",
  });
};
function languagesTable(
  languageData: AdministrationServiceResource,
  router: AppRouterInstance,
  grantedPolicies: Record<Policy, boolean>,
) {
  const table: LanguagesTable = {
    fillerColumn: "displayName",
    pinColumns: ["displayName"],
    columnVisibility: {
      type: "show",
      columns: ["displayName", "cultureName", "uiCultureName", "isEnabled"],
    },
    expandedRowComponent: (row) => {
      const uiSchema = createUiSchemaWithResource({
        resources: languageData,
        schema: $Volo_Abp_LanguageManagement_Dto_UpdateLanguageDto,
        name: "Form.Language",
        extend: {
          isEnabled: {
            "ui:widget": "switch",
          },
          "ui:className": "flex flex-row gap-8 items-end",
        },
      });

      return (
        <div className="bg-white p-4">
          <SchemaForm<Volo_Abp_LanguageManagement_Dto_UpdateLanguageDto>
            className="grid grid-cols-1 items-end gap-4 md:grid-cols-2"
            defaultSubmitClassName="flex items-end p-0 w-full"
            filter={{type: "include", sort: true, keys: ["displayName", "isEnabled"]}}
            formData={row}
            key={JSON.stringify(row)}
            onChange={({formData}) => {
              console.log(formData);
            }}
            onSubmit={({formData}) => {
              if (!formData) return;
              void putLanguageApi({id: row.id || "", requestBody: formData}).then((res) => {
                handlePutResponse(res, router);
              });
            }}
            schema={$Volo_Abp_LanguageManagement_Dto_UpdateLanguageDto}
            submitText={languageData["Edit.Save"]}
            uiSchema={uiSchema}
            withScrollArea={false}
          />
        </div>
      );
    },

    filters: {
      textFilters: ["filter"],
    },

    tableActions: languagesTableActions(languageData, router, grantedPolicies),
    rowActions: languagesRowActions(languageData, router, grantedPolicies),
  };
  return table;
}

export const tableData = {
  languages: {
    columns: languagesColumns,
    table: languagesTable,
  },
};
