import { DateTime } from "luxon";

export const dateIsoConversor = {
    mapFromDriverValue: (value: Date) => {
        if (!value) return null;
        return DateTime.fromJSDate(value).toISO();
    },
}