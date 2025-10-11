import React, { useRef } from "react";
import { Upload } from "lucide-react";

type UploadPhotoType = {
  image: File | null;
  imagePreview: string | null;
  onSetImage: React.Dispatch<React.SetStateAction<File | null>>;
};

const UploadPhoto = ({ image, imagePreview, onSetImage }: UploadPhotoType) => {
  const imageRef = useRef(null);

  return (
    <div className="flex flex-col">
      <span className="mb-1 ms-[2px] text-lg font-bold text-indigo-700">
        Photo
      </span>
      <input
        type="file"
        id="photo"
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
          } flex items-center justify-between border-2 border-yellow-200 rounded-md px-2 text-md h-[2.5vw] outline-none focus:border-green-500 cursor-pointer`}
        >
          {imagePreview ? (
            <div className="w-full flex justify-between items-center">
              <span className="text-[14px] text-white w-[75%] truncate">
                {image?.name}
              </span>
              <button
                className="text-[14px] text-white cursor-pointer p-1 rounded-md hover:bg-[#ff0000] transition-all duration-200"
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
              </button>
            </div>
          ) : (
            <div className="w-full flex items-center justify-between">
              <span className="text-[#3f3f3f]">No file chosen</span>
              <Upload className="w-4 h-4 text-white" />
            </div>
          )}
        </label>
        {imagePreview && (
          <img
            src={imagePreview ? imagePreview : ""}
            alt="avatar"
            className="w-[48px] h-[48px] object-fill rounded-full"
          />
        )}
      </div>
    </div>
  );
};

export default UploadPhoto;
