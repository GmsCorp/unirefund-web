"use server";

import {getTagsApi, getTagSummaryApi} from "@repo/actions/unirefund/TagService/actions";
import ErrorComponent from "@repo/ui/components/error-component";
import {isErrorOnRequest} from "@repo/utils/api";
import {CreditCard, DollarSign, Tags} from "lucide-react";
import {getResourceData} from "src/language-data/unirefund/TagService";
import {localizeCurrency} from "src/utils/utils-number";
import {TagSummary} from "../_components/tag-summary";
import Filter from "./_components/filter";
import TaxFreeTagsTable from "./_components/table";
import TaxFreeTagsSearchForm from "./_components/tax-free-tags-search-form";
import type {TagsSearchParamType} from "./_components/utils";
import {initParams} from "./_components/utils";

export default async function Page({
  params,
  searchParams,
}: {
  params: {lang: string};
  searchParams: TagsSearchParamType;
}) {
  const {lang} = params;
  const {languageData} = await getResourceData(lang);

  const tagData = initParams(searchParams);
  const tagsResponse = await getTagsApi(tagData);
  if (isErrorOnRequest(tagsResponse, lang, false)) {
    return <ErrorComponent languageData={languageData} message={tagsResponse.message} />;
  }

  const tagSummaryResponse = await getTagSummaryApi(tagData);
  if (isErrorOnRequest(tagSummaryResponse, lang, false)) {
    return <ErrorComponent languageData={languageData} message={tagSummaryResponse.message} />;
  }

  const currencyFormatter = localizeCurrency(lang);
  const summary = tagSummaryResponse.data;
  return (
    <div className="mt-4 h-full w-full flex-row gap-4 overflow-auto md:flex">
      <div className="mb-3 gap-4">
        <Filter className="peer data-[state=open]:col-span-4" defaultOpen isCollapsible languageData={languageData} />
      </div>
      <div className="grid grid-cols-1">
        <div className="grid gap-4 md:grid-cols-3">
          <TagSummary
            icon={<Tags className="size-4" />}
            title={languageData.TotalTags}
            value={tagsResponse.data.totalCount || 0}
          />
          <TagSummary
            icon={<DollarSign className="size-4" />}
            title={languageData.Sales}
            value={currencyFormatter(summary.totalSalesAmount || 0, summary.currency || "TRY")}
          />
          <TagSummary
            icon={<CreditCard className="size-4" />}
            title={languageData.Refunds}
            value={currencyFormatter(summary.totalRefundAmount || 0, summary.currency || "TRY")}
          />
        </div>
        <div className="col-span-8 mt-4 flex flex-col gap-3 rounded-lg border border-gray-200 p-4 shadow-sm peer-data-[state=closed]:col-span-full">
          <TaxFreeTagsSearchForm languageData={languageData} />
          <TaxFreeTagsTable languageData={languageData} response={tagsResponse.data} />
        </div>
      </div>
    </div>
  );
}
