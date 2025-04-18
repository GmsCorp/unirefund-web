"use client";

import type {
  PagedResultDto_SaasTenantDto,
  Volo_Saas_Host_Dtos_EditionLookupDto,
} from "@ayasofyazilim/core-saas/SaasService";
import TanstackTable from "@repo/ayasofyazilim-ui/molecules/tanstack-table";
import {useParams, useRouter} from "next/navigation";
import {useGrantedPolicies} from "@repo/utils/policies";
import type {SaasServiceResource} from "src/language-data/core/SaasService";
import {tableData} from "./tenants-table-data";

function TenantsTable({
  response,
  languageData,
  editionList,
}: {
  response: PagedResultDto_SaasTenantDto;
  languageData: SaasServiceResource;
  editionList: Volo_Saas_Host_Dtos_EditionLookupDto[];
}) {
  const router = useRouter();
  const {lang} = useParams<{lang: string}>();
  const {grantedPolicies} = useGrantedPolicies();

  const columns = tableData.tenants.columns(lang, languageData, grantedPolicies);
  const table = tableData.tenants.table(languageData, router, grantedPolicies, editionList);

  return <TanstackTable {...table} columns={columns} data={response.items || []} rowCount={response.totalCount} />;
}
export default TenantsTable;
