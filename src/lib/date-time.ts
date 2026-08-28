export function formatDataTime(date: Date){
    return Intl.DateTimeFormat('en-US', {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
    }).format(date);
}