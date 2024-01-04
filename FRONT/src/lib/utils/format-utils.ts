import { DateTime } from "luxon";
	
export const DATETIME_FULL_TS : Intl.DateTimeFormatOptions = {...DateTime.DATETIME_MED, hourCycle: 'h24'}

export const localDateTime = (isoDate?: string | Date) : string => {
    if (!isoDate) {
        return '';
    }
    if (isoDate instanceof Date) {
        return DateTime.fromJSDate(isoDate).toLocaleString(DATETIME_FULL_TS);
    }
    return DateTime.fromISO(isoDate).toLocaleString(DATETIME_FULL_TS);
}


// File size formatted to proper unit
export const getReadableFileSize = (size: number, decimals = 1) : string => {
    function smartRound(sizeStr: string) : string {
        if (sizeStr.endsWith('0') && parseInt(sizeStr.substring(sizeStr.indexOf('.')+1)) === 0) {
            return sizeStr.substring(0, sizeStr.indexOf('.'));
        }
        return sizeStr;
    }
    const megas = Math.floor(size / 1024 / 1024);
    if (megas > 0) {
        return smartRound(megas.toFixed(decimals)) + ' MB';
    }
    const kilos = Math.floor(size / 1024);
    if (kilos > 0) {
        return smartRound(kilos.toFixed(decimals)) + ' KB';
    }
    return size + ' B';    
}

// File size formatted to proper unit
export const ellipsis = (str: string, size = 24) : string => {
    if (!str || str.length <= size) {
        return str;
    }
    return str.substr(0, size-3) + '...';
}
