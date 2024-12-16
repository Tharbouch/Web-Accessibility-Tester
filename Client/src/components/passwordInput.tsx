import { ChangeEvent, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

interface PasswordInputProps {
  value: string;
  handler: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

const PasswordInput = ({ value, handler, error }: PasswordInputProps) => {
  const [checked, setChecked] = useState<boolean>(false);

  return (
    <div className="flex w-full flex-col gap-2">
      <div className="flex flex-col w-full gap-2">
        <label htmlFor="Password">Password</label>
        <div className="relative w-full">
          <div className={`flex items-center w-full border ${error !== "" ? 'border-red-600' :' border-gray-300'} rounded focus-within:border-blue-500 transition-colors`}>
            <input
              id="Password"
              value={value}
              type={!checked ? "password" : "text"}
              name="password"
              autoComplete="false"
              onChange={(e: ChangeEvent<HTMLInputElement>) => handler(e)}
              required
              className="flex-1 px-3 py-2 rounded-l outline-none focus:outline-none focus:ring-0 border-none"
            />
            
            <button
              type="button"
              onClick={() => setChecked(!checked)}
              className="px-3 text-gray-600 hover:text-gray-800 focus:outline-none"
            >
              {!checked ? <FaEye /> : <FaEyeSlash />}
            </button>
          </div>
        </div>
      </div>
      
      {error !== "" && <p className="font-bold text-red-600 text-sm mb-1">{error}</p>}
    </div>
  );
};

export default PasswordInput;
