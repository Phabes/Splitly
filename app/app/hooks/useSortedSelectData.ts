import { useMemo } from "react";
import { SelectData } from "@/app/types";

export const useSortedSelectData = (
  selectData: SelectData[],
  selectedValue: string,
  selectedFirst: boolean = true,
): SelectData[] => {
  return useMemo(() => {
    if (!selectData.length) {
      return [];
    }

    return [...selectData].sort((a, b) => {
      if (selectedFirst) {
        if (a.value === selectedValue) {
          return -1;
        }
        if (b.value === selectedValue) {
          return 1;
        }
      }

      return a.label.localeCompare(b.label);
    });
  }, [selectData, selectedValue, selectedFirst]);
};

export default useSortedSelectData;
