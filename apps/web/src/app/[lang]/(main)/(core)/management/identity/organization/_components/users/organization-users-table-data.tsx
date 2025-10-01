import type {Volo_Abp_Identity_IdentityUserDto} from "@ayasofyazilim/core-saas/IdentityService";
import {$Volo_Abp_Identity_IdentityUserDto} from "@ayasofyazilim/core-saas/IdentityService";
import type {TanstackTableCreationProps} from "@repo/ayasofyazilim-ui/molecules/tanstack-table/types";
import {tanstackTableCreateColumnsByRowData} from "@repo/ayasofyazilim-ui/molecules/tanstack-table/utils";
import {SaveIcon} from "lucide-react";
import type {AppRouterInstance} from "next/dist/shared/lib/app-router-context.shared-runtime";
import {handlePutResponse} from "@repo/utils/api";
import {putOrganizationUnitsByIdMembersApi} from "@repo/actions/core/IdentityService/put-actions";
import type {IdentityServiceResource} from "src/language-data/core/IdentityService";
import type {Localization} from "@/providers/tenant";

type UsersTable = TanstackTableCreationProps<Volo_Abp_Identity_IdentityUserDto>;
const usersColumns = (
  localization: Localization,
  languageData: IdentityServiceResource,
  unitUsers: Volo_Abp_Identity_IdentityUserDto[],
) => {
  return tanstackTableCreateColumnsByRowData<Volo_Abp_Identity_IdentityUserDto>({
    rows: $Volo_Abp_Identity_IdentityUserDto.properties,
    languageData: {
      languageData,
      constantKey: "Form.User",
    },
    localization,
    selectableRows: true,
    disabledRowIds: unitUsers.map((user) => user.id || ""),
  });
};

function usersTable(languageData: IdentityServiceResource, selectedUnitId: string, router: AppRouterInstance) {
  const table: UsersTable = {
    fillerColumn: "name",
    columnVisibility: {
      type: "show",
      columns: ["select", "userName", "email"],
    },
    columnOrder: ["userName", "email"],
    filters: {
      textFilters: ["userName", "emailAddress"],
    },
    selectedRowAction: {
      actionLocation: "table",
      cta: languageData.Save,
      icon: SaveIcon,
      onClick: (selectedIds: string[]) => {
        void putOrganizationUnitsByIdMembersApi({
          id: selectedUnitId,
          requestBody: {
            userIds: selectedIds,
          },
        }).then((res) => {
          handlePutResponse(res, router);
        });
      },
    },
  };
  return table;
}

export const tableData = {
  users: {
    columns: usersColumns,
    table: usersTable,
  },
};
