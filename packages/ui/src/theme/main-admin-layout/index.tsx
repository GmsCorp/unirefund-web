"use client";

import { NotificationProps } from "../../notification";
import { ThemeProvider } from "../../providers/theme";
import HeaderSection from "./header-section";

function MainAdminLayout(props: {
  notification: NotificationProps;
  appName: string;
  baseURL: string;
  lang: string;
  logo: any;
  navbarItems: any;
  prefix: string;
  profileMenu: any;
  tenantData: any;
  searchFromDB: any;
}) {
  return (
    <ThemeProvider
      appName={props.appName}
      logo={props.logo}
      baseURL={props.baseURL}
      navbarItems={props.navbarItems}
      profileMenu={props.profileMenu}
      prefix={props.prefix}
      lang={props.lang}
      notification={props.notification}
      searchFromDB={props.searchFromDB}
      tenantData={props.tenantData}>
      <HeaderSection />
    </ThemeProvider>
  );
}

export default MainAdminLayout;
