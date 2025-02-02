"use client";

import { convertFileToUrl } from "@/app/lib/utils";
import Image from "next/image";
import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";

type FileUploaderProps = {
  files: File[] | undefined;
  onChange: (files: File[]) => void;
};

const FileUploader = ({ files, onChange }: FileUploaderProps) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    onChange(acceptedFiles);
  }, [onChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div {...getRootProps()} className="file-upload">
      <input {...getInputProps()} />
      {files && files.length > 0 ? (
        <Image
          src={convertFileToUrl(files[0])}
          width={1000}
          height={1000}
          alt="file"
          className="max-h-[400px] object-cover overflow-hidden"
        />
      ) : (
        <>
          <Image
            src="/assets/icons/upload.svg"
            width={40}
            height={40}
            alt="file"
            className="max-h-400px object-cover overflow-hidden"
          />
          <div className="file-upload_label">
            <p className="text-12-regular">
              <span className="font-semibold text-green-500">
                Drag and drop your file here
              </span>{" "}
              or Click to Upload
            </p>
            <p>SVG, PNG, JPG or GIF (max 10MB)</p>
          </div>
        </>
      )}
      {isDragActive ? (
        <p>Drop the files here ...</p>
      ) : (
        <p></p>
      )}
    </div>
  );
};

export default FileUploader;

