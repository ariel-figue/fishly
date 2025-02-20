import React from "react";
import { FaEyeSlash, FaEye } from "react-icons/fa";

interface InputFieldProps {
  name: string;
  value: string;
  setValue: (value: string) => void;
  error?: string;
  type?: string;
}

export const InputField: React.FC<InputFieldProps> = ({
  name,
  value,
  setValue,
  error,
  type = "text",
}) => (
  <div className="flex flex-col gap-1 w-full">
    <input
      type={type}
      placeholder={name}
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
    name: string;
    value: string;
    setValue: (value: string) => void;
    showPassword: boolean;
    setShowPassword: (show: boolean) => void;
    error?: string;
  }> = ({ name, value, setValue, showPassword, setShowPassword, error }) => (
    <div className="flex flex-col gap-1 w-full">
      {/* Input & Eye Icon Wrapper */}
      <div className="relative flex items-center">
        <input
          type={showPassword ? "text" : "password"}
          placeholder={name}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          className={`border p-2 pr-10 rounded-md w-full placeholder:text-[#4c4c4c] border-gray-300 font-semibold ${
            error ? "border-red-500" : ""
          }`}
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
  
      {/* Error Message (Placed outside so it doesn't affect input height) */}
      {error && <div className="text-red-500 text-xs">{error}</div>}
    </div>
  );
  
