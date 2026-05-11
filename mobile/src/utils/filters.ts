// import { EntryType } from "@/screens/EditEntryScreen";
import { Entry } from "@/store/useEntriesStore";
import { formatDate } from "@/utils/calendar";

export type SearchType = "content" | "tag";

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

export const filterEntriesBySearch = (
  arr: Entry[],
  query: string,
  type: SearchType,
  tagsIndex?: Record<string, string[]>,
) => {
  const result = [];
  const trimmedQuery = query.trim();

  if (!arr.length) {
    return [];
  }

  if (!trimmedQuery.length) {
    return arr;
  }

  const normalizedQuery = trimmedQuery.toLowerCase();

  for (const entry of arr) {
    if (type === "content" && entry.content.includes(normalizedQuery)) {
      result.push(entry);
    } else if (type === "tag" && entry.tags.length && tagsIndex) {
      const matchingIds = tagsIndex[normalizedQuery];
      if (!matchingIds || matchingIds.length === 0) return [];
      result.concat(
        arr.filter((entry) => matchingIds.includes(entry.id.toString())),
      );
    }
  }

  return result;
};
