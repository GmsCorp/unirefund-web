"use client";
import {Button} from "@/components/ui/button";
import type {Volo_Abp_Account_ProfilePictureType} from "@ayasofyazilim/core-saas/AccountService";
import {useRouter} from "next/navigation";
import {useState, useTransition} from "react";
import {handlePutResponse} from "@repo/utils/api";
import {postProfilePictureApi} from "@repo/actions/core/AccountService/post-actions";
import type {AccountServiceResource} from "src/language-data/core/AccountService";

export default function PersonalPicture({languageData}: {languageData: AccountServiceResource}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [selectedImage, setSelectedImage] = useState<Blob | File | undefined>(undefined);
  const [uploadType, setUploadType] = useState<Volo_Abp_Account_ProfilePictureType>(2);

  const handleSaveImage = () => {
    startTransition(() => {
      void postProfilePictureApi({
        formData: {
          ImageContent: selectedImage,
        },
        type: uploadType,
      }).then((response) => {
        handlePutResponse(response, router);
      });
    });
  };

  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <div className="flex h-64 w-64 items-center justify-center overflow-hidden rounded-lg border border-gray-300 bg-gray-100">
        {selectedImage ? (
          <></>
        ) : (
          // <img
          // src={selectedImage}
          // alt="Selected Profile Picture"
          // className="h-full w-full object-cover"
          // />
          <span className="text-gray-500">{languageData["No.Picture.Selected"]}</span>
        )}
      </div>
      <form data-testid="personal-picture-form">
        <div className="flex flex-col items-start gap-4 px-96 pl-64 pt-4">
          <label className="flex items-center gap-2" data-testid="upload-type-0-label">
            <input
              checked={uploadType === 0}
              data-testid="upload-type-0-input"
              name="uploadType"
              onChange={() => {
                setUploadType(0);
                setSelectedImage(undefined);
              }}
              type="radio"
              value={0}
            />
            {languageData["Default.Avatar"]}
          </label>
          <label className="flex items-center gap-2" data-testid="upload-type-1-label">
            <input
              checked={uploadType === 1}
              data-testid="upload-type-1-label"
              name="uploadType"
              onChange={() => {
                setUploadType(1);
                setSelectedImage(undefined);
              }}
              type="radio"
              value={1}
            />
            {languageData["Use.Gravatar"]}
          </label>
          <label className="flex items-center gap-2" data-testid="upload-type-2-label">
            <input
              checked={uploadType === 2}
              data-testid="upload-type-2-label"
              name="uploadType"
              onChange={() => {
                setUploadType(2);
              }}
              type="radio"
              value={2}
            />
            {languageData["Upload.File"]}
          </label>
        </div>

        {uploadType === 2 && (
          <div>
            <input
              className="block w-full cursor-pointer rounded-lg border border-gray-300 bg-gray-50 p-2 text-sm text-gray-900 hover:bg-gray-100 focus:outline-none"
              data-testid="file-input"
              id="file"
              type="file"
            />
          </div>
        )}
        <div className="flex justify-end pr-72 pt-8">
          <Button
            data-testid="save-button"
            disabled={isPending}
            onClick={() => {
              handleSaveImage();
            }}>
            {languageData["Edit.Save"]}
          </Button>
        </div>
      </form>
    </div>
  );
}
