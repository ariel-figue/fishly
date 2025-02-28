import React from "react";
import { FaEyeSlash, FaEye } from "react-icons/fa";

interface InputFieldProps {
  name: string;
  value: string;
  setValue: (value: string) => void;
  error?: string;
  type?: string;
  placeholder?: string;
}

export const InputField: React.FC<InputFieldProps> = ({
  name,
  value,
  setValue,
  error,
  type = "text",
  placeholder,
}) => (
  <div className="flex flex-col gap-1 w-full">
    <input
      type={type}
      placeholder={placeholder ? placeholder : name}
      value={value}
      onChange={(event) => setValue(event.target.value)}
      className={`border p-2 rounded-md w-full placeholder:text-[#4c4c4c] border-gray-300 font-semibold ${
        error ? "border-red-500" : ""
      }`}
    />
    {error && <div className="text-red-500 text-xs">{error}</div>}
  </div>
);

export const PasswordInputField: React.FC<{
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
} & InputFieldProps> = ({
  name,
  value,
  setValue,
  showPassword,
  setShowPassword,
  error,
  type = "password",
  placeholder,
}) => (
  <div className="flex flex-col gap-1 w-full">
    {/* Input & Eye Icon Wrapper */}
    <div className="relative flex items-center">
      <InputField
        name={name}
        value={value}
        setValue={setValue}
        error={error}
        type={showPassword ? "text" : type}
        placeholder={placeholder}
      />
      {/* Eye Icon (Ensured it remains fixed) */}
      <button
        type="button"
        className="absolute right-3 text-[#2c3e50] hover:opacity-75 flex"
        style={{ fontSize: "1.5rem" }}
        onClick={() => setShowPassword(!showPassword)}
      >
        {showPassword ? <FaEyeSlash /> : <FaEye />}
      </button>
    </div>
  </div>
);
  
