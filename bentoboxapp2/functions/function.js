

export function formatDuration(durationString){
    const [hoursString, a, minutesString, b] = durationString.split(' ');
    console.log(hoursString);
    console.log(minutesString);
    // Convert hours and minutes to integers
    const hours = parseInt(hoursString); // "1" -> 1
    const minutes = parseInt(minutesString); // "52" -> 52

    // Calculate the total duration in minutes
    const totalMinutes = hours * 60 + minutes;
    console.log(totalMinutes);
    return totalMinutes;
}

export function ratingFormat(rating){

    let array = rating.split('-');


    return array[0]
}

export function formatPlot(plot){

    const format = plot.split("[Written by MAL Rewrite]");

    return format;
}