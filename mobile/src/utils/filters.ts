import { formatDate } from "@/utils/calendar";
import { Entry } from "@/store/useEntriesStore";

export const filterEntriesByDate = (arr: Entry[], date: string) => {
  const result = [];
  const formatedDate = formatDate(date);

  if (!arr.length) {
    return [];
  }

  for (const day of arr) {
    if (formatDate(day.date) === formatedDate) {
      result.push(day);
    }
  }

  return result;
};
