import { DateTime } from "luxon";
	
export const DATETIME_FULL_TS : Intl.DateTimeFormatOptions = {...DateTime.DATETIME_MED, hourCycle: 'h24'}