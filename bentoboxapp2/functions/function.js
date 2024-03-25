

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

    if(rating != null){
        let array = rating.split('-');
        return array[0]
    }
   else{
    return null;
   }
}

export function formatPlot(plot){

    if(plot != null){
        const format = plot.split("[Written by MAL Rewrite]");

    return format[0].trim();
    }
    else{
        return null;
    }
}

// Throttle function
export const debounce = (func, delay) => {
    let timeoutId;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func.apply(context, args);
        }, delay);
    };
};