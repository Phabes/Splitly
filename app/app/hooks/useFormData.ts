import { useCallback, useState } from "react";

export const useFormData = () => {
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | undefined>(undefined);

  const handleSetValue = useCallback((newValue: string) => {
    setValue(newValue);
    setError(undefined);
  }, []);

  return { value, setValue: handleSetValue, error, setError };
};

export default useFormData;
