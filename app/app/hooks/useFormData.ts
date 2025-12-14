import { useState } from "react";

export const useFormData = () => {
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | undefined>(undefined);

  return { value, setValue, error, setError };
};

export default useFormData;
