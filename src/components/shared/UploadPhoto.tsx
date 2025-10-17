import React, { useRef } from "react";
import { Upload } from "lucide-react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";

type UploadPhotoType = {
  image: File | null;
  imagePreview: string | null;
  onSetImage: React.Dispatch<React.SetStateAction<File | null>>;
};

const UploadPhoto = ({ image, onSetImage, imagePreview }: UploadPhotoType) => {
  const imageRef = useRef(null);

  return (
    <div className="flex flex-col">
      <Label className="mb-2">Photo</Label>
      <Input
        id="photo"
        type="file"
        ref={imageRef}
        className="hidden"
        onChange={(e) => {
          onSetImage(e.target.files && e.target.files[0]);
        }}
      />
      <div className="flex items-center gap-x-3">
        <label
          htmlFor="photo"
          className={`${
            imagePreview ? "w-[85%]" : "w-full"
          } relative flex items-center justify-between bg-white rounded-md py-1 pe-3 ${
            imagePreview ? "pl-3" : "pl-10"
          } text-md h-[36px] outline-none focus:border-green-500 cursor-pointer`}
        >
          {imagePreview ? (
            <div className="w-full flex justify-between items-center">
              <span className="text-[14px] text-gray-700 w-[75%] truncate">
                {image?.name}
              </span>
              <Button
                className="text-[13px] font-normal h-[24px] text-white cursor-pointer p-1 rounded-md bg-red-400 hover:bg-[#ff0000] transition-all duration-200"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  onSetImage(null);
                  if (imageRef.current) {
                    (imageRef.current as HTMLInputElement).value = "";
                  }
                }}
              >
                Remove
              </Button>
            </div>
          ) : (
            <div className="w-full flex items-center">
              <Upload className="authIconClasses" />
              <span className="text-[#3f3f3f]">No file chosen</span>
            </div>
          )}
        </label>
        {imagePreview && (
          <img
            alt="avatar"
            src={imagePreview ? imagePreview : ""}
            className="w-[45px] h-[45px] object-fill rounded-full"
          />
        )}
      </div>
    </div>
  );
};

export default UploadPhoto;
