"use client";
import React, {useState} from "react";
import type {Volo_Abp_Account_ProfileDto} from "@ayasofyazilim/core-saas/AccountService";
import {useParams, useRouter} from "next/navigation";
import {Card, CardHeader, CardTitle, CardContent, CardDescription} from "@/components/ui/card";
import {Avatar, AvatarFallback} from "@/components/ui/avatar";
import {Button} from "@/components/ui/button";
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription} from "@/components/ui/dialog";
import {Drawer, DrawerContent, DrawerHeader, DrawerTitle} from "@/components/ui/drawer";
import {
  User,
  KeyRound,
  Bell,
  HelpCircle,
  LogOut,
  ChevronRight,
  QrCode,
  Shield,
  Pencil,
  IdCard,
  CreditCard,
} from "lucide-react";
import {signOutServer} from "@repo/utils/auth";
import LanguageSelector from "@repo/ui/theme/main-admin-layout/components/language-selector";
import {useIsMobile} from "@/components/hooks/useIsMobile";
import {QRCodeSVG} from "qrcode.react";
import {NotificationInbox} from "@repo/ui/notification";
import type {Volo_Abp_LanguageManagement_Dto_LanguageDto} from "@ayasofyazilim/saas/AdministrationService";
import type {SSRServiceResource} from "@/language-data/unirefund/SSRService";
import type {AccountServiceResource} from "src/language-data/core/AccountService";
import unirefundLogo from "public/unirefund-logo.png";
import PersonalInformation from "./_components/personal-information";
import ChangePassword from "./_components/change-password";

type NovuProps = {
  appId: string;
  appUrl: string;
  subscriberId: string;
};

export default function Profile({
  ssrLanguageData,
  accountLanguageData,
  availableLocals,
  personalInformationData,
  novu,
  languageList,
}: {
  ssrLanguageData: SSRServiceResource;
  accountLanguageData: AccountServiceResource;
  availableLocals: string[];
  personalInformationData: Volo_Abp_Account_ProfileDto;
  novu: NovuProps;
  languageList: Volo_Abp_LanguageManagement_Dto_LanguageDto[];
}) {
  const router = useRouter();
  const [showQrCode, setShowQrCode] = useState(false);
  const [showPersonalInfo, setShowPersonalInfo] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const isMobile = useIsMobile();

  const getInitials = (name?: string, surname?: string) => {
    const firstInitial = name ? name[0].toUpperCase() : "";
    const lastInitial = surname ? surname[0].toUpperCase() : "";
    return firstInitial + (lastInitial || "");
  };
  const handleLogout = () => {
    void signOutServer();
  };
  const accountItems = [
    {
      icon: <User className="h-4 w-4" />,
      title: ssrLanguageData.AccountInformation,
      description: ssrLanguageData.ViewEditPersonalInfo,
      onClick: () => {
        setShowPersonalInfo(true);
      },
      disabled: false,
    },
    {
      icon: <IdCard className="h-4 w-4" />,
      title: ssrLanguageData.IdentityVerification,
      description: ssrLanguageData.ManageTwoFactorAuth,
      onClick: () => {
        router.push("profile/kyc");
      },
      disabled: true,
    },
    {
      icon: <KeyRound className="h-4 w-4" />,
      title: ssrLanguageData.ChangePassword,
      description: ssrLanguageData.UpdateAccountSecurity,
      onClick: () => {
        setShowChangePassword(true);
      },
      disabled: false,
    },
    {
      icon: <CreditCard className="h-4 w-4" />,
      title: ssrLanguageData.PaymentMethods,
      description: ssrLanguageData.ManagePaymentMethods,
      onClick: () => {
        router.push("profile/payment-methods");
      },
      disabled: false,
    },
    {
      icon: <Bell className="h-4 w-4" />,
      title: ssrLanguageData.NotificationPreferences,
      description: ssrLanguageData.ManageNotificationSettings,
      onClick: () => {
        router.push("/notifications");
      },
      disabled: true,
    },
    {
      icon: <Shield className="h-4 w-4" />,
      title: ssrLanguageData.SecuritySettings,
      description: ssrLanguageData.ConfigureAccountSecurity,
      onClick: () => {
        router.push("/account/security");
      },
      disabled: true,
    },
    {
      icon: <HelpCircle className="h-4 w-4" />,
      title: ssrLanguageData.Support,
      description: ssrLanguageData.GetHelpSupport,
      onClick: () => {
        router.push("/support");
      },
      disabled: true,
    },
    {
      icon: <LogOut className="h-4 w-4" />,
      title: ssrLanguageData.Logout,
      description: ssrLanguageData.LogoutDescription,
      onClick: handleLogout,
      disabled: false,
    },
  ];

  const params = useParams();
  const lang = params.lang as string;

  return (
    <div className="mx-auto max-w-full py-4 md:container md:max-w-5xl md:px-4 md:py-8">
      <div className="grid gap-4 md:gap-8 lg:grid-cols-[300px_1fr]">
        {/* Profil Kartı */}
        <div className="space-y-4">
          <Card className="overflow-hidden ">
            <CardHeader className="relative bg-gradient-to-r from-red-500 to-red-600 p-0 text-white">
              <div className="absolute top-2 flex w-full justify-between px-2">
                <Button
                  className="h-8 w-8 p-0 text-white transition-transform duration-200 hover:scale-110 hover:bg-transparent hover:text-white"
                  onClick={() => {
                    setShowPersonalInfo(true);
                  }}
                  size="icon"
                  title={ssrLanguageData.EditProfile}
                  variant="ghost">
                  <Pencil className="h-5 w-5" />
                </Button>
                <Button
                  className="h-8 w-8 p-0 text-white transition-transform duration-200 hover:scale-110 hover:bg-transparent hover:text-white"
                  onClick={() => {
                    setShowQrCode(true);
                  }}
                  size="icon"
                  title={ssrLanguageData.QRCode}
                  variant="ghost">
                  <QrCode className="h-5 w-5" />
                </Button>
              </div>
              <div className="px-6 pb-12 pt-8" />
            </CardHeader>
            <CardContent className="pt-0">
              <div className="-mt-10 flex flex-col items-center">
                <Avatar className="h-20 w-20 border-4 border-white">
                  <AvatarFallback className="bg-red-500 text-lg text-white">
                    {getInitials(
                      personalInformationData.name ?? undefined,
                      personalInformationData.surname ?? undefined,
                    )}
                  </AvatarFallback>
                </Avatar>
                <div className="mt-2 flex flex-col items-center space-y-2 text-center">
                  <h2 className="text-xl font-semibold">
                    {personalInformationData.name} {personalInformationData.surname}
                  </h2>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-600">@{personalInformationData.userName}</p>
                    <p className="text-sm text-gray-500">{personalInformationData.email}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <NotificationInbox langugageData={ssrLanguageData} {...novu} />
          </Card>
        </div>

        {/* Ayarlar Kartı */}
        <Card>
          <CardHeader>
            <CardTitle>{ssrLanguageData.AccountManagement}</CardTitle>
            <CardDescription>{ssrLanguageData.ManageProfileAndPreferences}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {" "}
            <div>
              <div className="space-y-1 overflow-hidden">
                {accountItems.map((item, itemIndex) => (
                  <button
                    className={`flex w-full items-center justify-between p-3 text-left transition-colors ${
                      item.disabled ? "cursor-not-allowed opacity-50" : "hover:bg-gray-50"
                    }`}
                    disabled={item.disabled}
                    key={`account-item-${itemIndex}`}
                    onClick={item.disabled ? undefined : item.onClick}
                    type="button">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full ${
                          item.disabled ? "bg-gray-50 text-gray-400" : "bg-gray-100 text-gray-600"
                        }`}>
                        {item.icon}
                      </div>
                      <div>
                        <div className={`text-sm font-medium ${item.disabled ? "text-gray-400" : ""}`}>
                          {item.title}
                        </div>
                        <div className={`text-xs ${item.disabled ? "text-gray-300" : "text-gray-500"}`}>
                          {item.description}
                        </div>
                      </div>
                    </div>
                    <ChevronRight className={`h-4 w-4 ${item.disabled ? "text-gray-300" : "text-gray-400"}`} />
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="flex md:hidden">
          <CardHeader className="w-full">
            <CardTitle>{ssrLanguageData.LanguagePreferences}</CardTitle>

            <CardDescription className="flex w-full items-center justify-between">
              {ssrLanguageData.SelectLanguage}
              <LanguageSelector availableLocals={availableLocals} lang={lang} languagesList={languageList} />
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
      {/* QR Kod Dialog - Desktop için */}
      {!isMobile && (
        <Dialog onOpenChange={setShowQrCode} open={showQrCode}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{ssrLanguageData.ProfileQRCode}</DialogTitle>
              <DialogDescription>{ssrLanguageData.ProfileQRCodeDescription}</DialogDescription>
            </DialogHeader>
            <div className="flex justify-center py-6">
              <div className="flex h-64 w-64 items-center justify-center ">
                <QRCodeSVG
                  bgColor="#ffffff"
                  className="h-full w-full"
                  fgColor="#000000"
                  imageSettings={{
                    src: unirefundLogo.src,
                    x: undefined,
                    y: undefined,
                    height: 48,
                    width: 48,
                    opacity: 1,
                    excavate: true,
                  }}
                  level="L"
                  size={256}
                  value={JSON.stringify(personalInformationData)}
                />
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
      {/* QR Kod Drawer - Mobil için */}
      {isMobile ? (
        <Drawer onOpenChange={setShowQrCode} open={showQrCode}>
          <DrawerContent className="h-[85vh]">
            <DrawerHeader className="mb-4">
              <DrawerTitle>{ssrLanguageData.ProfileQRCode}</DrawerTitle>
            </DrawerHeader>
            <div className="overflow-y-auto px-4 pb-8">
              <div className="flex flex-col items-center">
                <p className="mb-4 text-center text-sm text-gray-500">{ssrLanguageData.ProfileQRCodeDescription}</p>
                <div className="flex h-64 w-64 items-center justify-center ">
                  <QRCodeSVG
                    bgColor="#ffffff"
                    className="h-full w-full"
                    fgColor="#000000"
                    imageSettings={{
                      src: unirefundLogo.src,
                      x: undefined,
                      y: undefined,
                      height: 48,
                      width: 48,
                      opacity: 1,
                      excavate: true,
                    }}
                    level="L"
                    size={256}
                    value={JSON.stringify(personalInformationData)}
                  />
                </div>
              </div>
            </div>
          </DrawerContent>
        </Drawer>
      ) : null}
      {/* Personal Information - Desktop için Dialog */}
      {!isMobile && (
        <Dialog onOpenChange={setShowPersonalInfo} open={showPersonalInfo}>
          <DialogContent className="sm:max-w-xl">
            <DialogHeader>
              <DialogTitle>{ssrLanguageData.EditProfile}</DialogTitle>
            </DialogHeader>
            <PersonalInformation languageData={accountLanguageData} personalInformationData={personalInformationData} />
          </DialogContent>
        </Dialog>
      )}
      {/* Personal Information - Mobil için Drawer */}
      {isMobile ? (
        <Drawer onOpenChange={setShowPersonalInfo} open={showPersonalInfo}>
          <DrawerContent className="h-[85vh]">
            <DrawerHeader className="mb-4">
              <DrawerTitle>{ssrLanguageData.EditProfile}</DrawerTitle>
            </DrawerHeader>
            <div className="overflow-y-auto px-4 pb-8">
              <PersonalInformation
                languageData={accountLanguageData}
                personalInformationData={personalInformationData}
              />
            </div>
          </DrawerContent>
        </Drawer>
      ) : null}
      {/* Change Password - Desktop için Dialog */}
      {!isMobile && (
        <Dialog onOpenChange={setShowChangePassword} open={showChangePassword}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{ssrLanguageData.ChangePassword}</DialogTitle>
            </DialogHeader>
            <ChangePassword languageData={accountLanguageData} />
          </DialogContent>
        </Dialog>
      )}{" "}
      {/* Change Password - Mobil için Drawer */}
      {isMobile ? (
        <Drawer onOpenChange={setShowChangePassword} open={showChangePassword}>
          <DrawerContent className="h-[85vh]">
            <DrawerHeader className="mb-4">
              <DrawerTitle>{ssrLanguageData.ChangePassword}</DrawerTitle>
            </DrawerHeader>
            <div className="overflow-y-auto px-4 pb-8">
              <ChangePassword languageData={accountLanguageData} />
            </div>
          </DrawerContent>
        </Drawer>
      ) : null}
    </div>
  );
}
