import moment from 'moment';

export const FormatDate = (timestamp) => {
    return new Date(timestamp).setHours(0, 0, 0, 0);
}

export const FormatDateForText = (timestamp) => {
    return moment(timestamp).format('LL');
}

export const FormatTime = (timestamp) => {
    const date = new Date(timestamp);
    const timeString = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    return timeString;
}

export const getDatesRange = (startDate, endDate) => {
    const start = moment(new Date(startDate), 'MM/DD/YYYY');
    const end = moment(new Date(endDate), 'MM/DD/YYYY');
    const dates = [];
    while (start.isSameOrBefore(end)) {
        dates.push(start.format('YYYY-MM-DD'));
        start.add(1, 'day');
    }
    return dates;
}

export const  GetDateRangeToDisplay = () => {
    const dateList = [];
    for(let  i = 0; i <= 7; i++){
        dateList.push({
            date: moment().add(i, 'days').format('DD'),
            day: moment().add(i, 'days').format('dd'),
            formattedDate: moment().add(i, 'days').format('YYYY-MM-DD')
        });
    }
    return dateList;
}


export const  GetPrevDateRangeToDisplay = () => {
    const dateList = [];
    for(let  i = 0; i <= 7; i++){
        const date = moment().subtract(i, 'days').format('YYYY-MM-DD');
        dateList.push({
            date: moment(date).format('DD'),
            day: moment(date).format('dd'),
            formattedDate: date
        });
    }
    return dateList.reverse();
}
