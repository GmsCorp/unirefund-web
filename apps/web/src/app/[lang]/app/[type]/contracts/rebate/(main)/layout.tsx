"use client";

import { PageHeader } from "@repo/ayasofyazilim-ui/molecules/page-header";
import {
  SectionLayout,
  SectionLayoutContent,
} from "@repo/ayasofyazilim-ui/templates/section-layout-v2";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getResourceData } from "src/language-data/ContractService";
import { getBaseLink } from "src/utils";

interface LayoutProps {
  children: JSX.Element;
  params: { lang: string };
}

export default function Layout({ children, params }: LayoutProps) {
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [languageData, setLanguageData] = useState<Record<string, string>>();
  useEffect(() => {
    void getResourceData(params.lang).then((response) => {
      setLanguageData(response.languageData);
      setLoading(false);
    });
  }, []);
  if (!languageData || loading) return <>Loading...</>;
  const path = pathname.split("rebate/")[1];
  const navbarItems = [
    {
      name: languageData["RebateTables.CompanySettings.Title"],
      description: languageData["RebateTables.CompanySettings.Description"],
      id: "company-settings",
      link: getBaseLink(
        "contracts/rebate/company-settings",
        true,
        params.lang,
        true,
        "admin",
      ),
    },
    {
      name: languageData["RebateTables.Templates.Title"],
      description: languageData["RebateTables.Templates.Description"],
      id: "templates",
      link: getBaseLink(
        "contracts/rebate/templates",
        true,
        params.lang,
        true,
        "admin",
      ),
    },
  ];
  return (
    <>
      <PageHeader
        description={
          navbarItems.find((x) => x.id === path)?.description ||
          "Page description"
        }
        title={navbarItems.find((x) => x.id === path)?.name || "Page title"}
      />
      <SectionLayout
        defaultActiveSectionId={path}
        linkElement={Link}
        sections={navbarItems}
      >
        <SectionLayoutContent sectionId={path}>{children}</SectionLayoutContent>
      </SectionLayout>
    </>
  );
}
