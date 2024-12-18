"use client";

import type { PagedResultDto_RefundListItem } from "@ayasofyazilim/saas/RefundService";
import TanstackTable from "@repo/ayasofyazilim-ui/molecules/tanstack-table";
import { useRouter } from "next/navigation";
import type { ContractServiceResource } from "src/language-data/unirefund/ContractService";
import { useGrantedPolicies } from "src/providers/granted-policies";
import { tableData } from "./refunds-table-data";

function RefundsTable({
  locale,
  response,
  languageData,
}: {
  locale: string;
  response: PagedResultDto_RefundListItem;
  languageData: ContractServiceResource;
}) {
  const { grantedPolicies } = useGrantedPolicies();
  const router = useRouter();
  const columns = tableData.refunds.columns(locale);
  const table = tableData.refunds.table(languageData, router, grantedPolicies);

  return (
    <TanstackTable
      {...table}
      columns={columns}
      data={response.items || []}
      rowCount={response.totalCount}
    />
  );
}

export default RefundsTable;
