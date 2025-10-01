"use client";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";
import {cn} from "@/lib/utils";
import type {
  UniRefund_CRMService_TaxFrees_TaxFreeListResponseDto as TaxFreeListResponseDto,
  UniRefund_CRMService_TaxFrees_TaxFreeStatus as TaxFreeStatus,
} from "@repo/saas/CRMService";
import {$UniRefund_CRMService_TaxFrees_TaxFreeListResponseDto as $TaxFreeListResponseDto} from "@repo/saas/CRMService";
import type {
  TanstackTableCreationProps,
  TanstackTableTableActionsType,
} from "@repo/ayasofyazilim-ui/molecules/tanstack-table/types";
import {tanstackTableCreateColumnsByRowData} from "@repo/ayasofyazilim-ui/molecules/tanstack-table/utils";
import type {Policy} from "@repo/utils/policies";
import {isActionGranted} from "@repo/utils/policies";
import {Building2, PlusCircle, Store} from "lucide-react";
import type {AppRouterInstance} from "next/dist/shared/lib/app-router-context.shared-runtime";
import Link from "next/link";
import {getBaseLink} from "@/utils";
import type {CRMServiceServiceResource} from "src/language-data/unirefund/CRMService";
import type {Localization} from "@/providers/tenant";

type TaxFreeTable = TanstackTableCreationProps<TaxFreeListResponseDto>;

function taxFreeTableActions(
  languageData: CRMServiceServiceResource,
  router: AppRouterInstance,
  grantedPolicies: Record<Policy, boolean>,
  newLink: string,
) {
  const actions: TanstackTableTableActionsType<TaxFreeListResponseDto>[] = [
    {
      type: "simple",
      actionLocation: "table",
      cta: languageData.New,
      icon: PlusCircle,
      condition: () => isActionGranted(["CRMService.TaxFrees.Create"], grantedPolicies),
      onClick() {
        router.push(newLink);
      },
    },
  ];
  return actions;
}

function taxFreeColumns(localization: Localization, languageData: CRMServiceServiceResource) {
  const baseLink = getBaseLink("parties/tax-free", localization.lang);
  return tanstackTableCreateColumnsByRowData<TaxFreeListResponseDto>({
    rows: $TaxFreeListResponseDto.properties,
    languageData: {
      name: languageData.Name,
      typeCode: languageData["CRM.typeCode"],
      vatNumber: languageData["CRM.vatNumber"],
      externalStoreIdentifier: languageData["CRM.externalStoreIdentifier"],
    },
    localization,
    custom: {
      name: {
        showHeader: true,
        content: (row) => {
          return (
            <div className="flex items-center gap-2">
              <Link
                className="flex items-center gap-1 font-medium text-blue-700"
                data-testid={`${row.id}-name-link`}
                href={`${baseLink}/${row.id}/details`}>
                {row.name}
              </Link>
              <BadgeByStatus languageData={languageData} status={row.status} />
            </div>
          );
        },
      },
      typeCode: {
        showHeader: true,
        content: (row) => {
          return (
            <div className="flex items-center gap-1 bg-transparent">
              {row.typeCode === "HEADQUARTER" && <Building2 className="size-4 text-gray-500" />}
              {row.typeCode === "TAXFREE" && <Store className="size-4 text-gray-500" />}
              {languageData[`Form.TaxFree.typeCode.${row.typeCode}` as keyof typeof languageData]}
            </div>
          );
        },
      },
      parentId: {
        content: (row) => {
          return (
            <>
              {row.parentId ? (
                <Tooltip>
                  <TooltipTrigger>
                    <Button
                      asChild
                      className="h-6 items-center p-1"
                      data-testid="open-headquarter-button"
                      size="sm"
                      variant="outline">
                      <Link data-testid="open-headquarter-link" href={`${baseLink}/${row.parentId}/details`}>
                        <Building2 className="mr-1 size-4" />
                        {row.parentName}
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{languageData["CRM.openHeadquarter"]}</TooltipContent>
                </Tooltip>
              ) : null}
            </>
          );
        },
      },
    },
  });
}

function taxFreeTable(
  languageData: CRMServiceServiceResource,
  router: AppRouterInstance,
  grantedPolicies: Record<Policy, boolean>,
  newLink: string,
) {
  const table: TaxFreeTable = {
    fillerColumn: "name",
    tableActions: taxFreeTableActions(languageData, router, grantedPolicies, newLink),
    filters: {
      textFilters: ["name"],
      facetedFilters: {
        typeCode: {
          title: languageData["CRM.typeCode"],
          options: [
            {
              label: languageData["Form.TaxFree.typeCode.HEADQUARTER"],
              value: "HEADQUARTER",
              icon: Building2,
            },
            {
              label: languageData["Form.TaxFree.typeCode.TAXFREE"],
              value: "TAXFREE",
              icon: Store,
            },
          ],
        },
      },
    },
    columnVisibility: {
      type: "hide",
      columns: ["id", "status", "parentName"],
    },
    columnOrder: ["name", "parentId", "typeCode", "externalIdentifier", "vatNumber"],
  };
  return table;
}

export const tableData = {
  taxFrees: {
    columns: taxFreeColumns,
    table: taxFreeTable,
  },
};

function BadgeByStatus({
  status,
  languageData,
}: {
  status: TaxFreeStatus | undefined;
  languageData: CRMServiceServiceResource;
}) {
  let className = "";
  if (!status) return null;
  switch (status) {
    case "ACTIVE":
      className = "!bg-green-100 text-xs text-green-600 border-green-500";
      break;
    case "INACTIVE":
      className = "!bg-red-100 text-xs text-red-600 border-red-500";
      break;
    case "APPROVED":
      className = "!bg-green-100 text-xs text-green-600 border-green-700";
      break;
    case "DRAFT":
      className = "!bg-gray-100 text-xs text-gray-600 border-gray-500";
      break;
    case "REJECTED":
      className = "!bg-yellow-100 text-xs text-yellow-600 border-yellow-500";
      break;
    case "SUSPENDED":
      className = "!bg-purple-100 text-xs text-purple-600 border-purple-700";
      break;
    case "WAITINGAPPROVAL":
      className = "!bg-orange-100 text-xs text-orange-600 border-orange-500";
  }
  return (
    <Badge className={cn("px-1", className)}>
      {languageData[`CRM.PartyStatus.${status}` as keyof typeof languageData]}
    </Badge>
  );
}
