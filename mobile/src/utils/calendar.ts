/**
 * Превращает объект Date в строку формата YYYY-MM-DD
 */
export function formatDate(date: Date | string): string {
  let formatedDate: Date;
  if (typeof date === "string") {
    formatedDate = new Date(date);
  } else {
    formatedDate = date;
  }
  const year = formatedDate.getFullYear();
  const month = String(formatedDate.getMonth() + 1).padStart(2, "0");

  const day = String(formatedDate.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}
