import dayjs from "dayjs";

export const formatFecha = (fecha) =>
  dayjs(fecha).format("DD/MM/YYYY HH:mm");