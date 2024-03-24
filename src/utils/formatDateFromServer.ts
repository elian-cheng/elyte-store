import dayjs from 'dayjs';

export const formatDate = (
  dateString: string | number | Date | dayjs.Dayjs | null | undefined
) => {
  if (!dateString) return null;
  const formattedDate = dayjs(dateString).format('DD-MM-YYYY');
  return formattedDate;
};
