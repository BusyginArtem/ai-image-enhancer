import React from "react";
import clsx from "clsx";
import { FieldError } from "react-hook-form";

import { Input } from "./input";

type FormInputProps = React.ComponentProps<"input"> & {
  error?: FieldError;
};

const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  ({ error, ...props }, ref) => {
    return (
      <div>
        <Input
          className={clsx({
            "focus-visible:outline-red-400": !!error?.message,
          })}
          ref={ref}
          {...props}
        />

        <span className="inline-block h-4 text-xs text-red-400">
          {error?.message ? error.message : ""}
        </span>
      </div>
    );
  },
);
FormInput.displayName = "FormInput";

export default FormInput;
