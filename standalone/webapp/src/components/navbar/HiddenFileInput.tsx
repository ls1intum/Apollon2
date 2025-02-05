import React, { FC, ChangeEvent } from "react"

interface HiddenFileInputProps {
  accept?: string
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void
  inputRef: React.RefObject<HTMLInputElement>
}

export const HiddenFileInput: FC<HiddenFileInputProps> = ({
  accept = ".json,application/json",
  onFileChange,
  inputRef,
}) => {
  return (
    <input
      type="file"
      accept={accept}
      ref={inputRef}
      style={{ display: "none" }}
      onChange={onFileChange}
    />
  )
}
