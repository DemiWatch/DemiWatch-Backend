const moment = require('moment');

const calculateTimeDifference = (locationHistory) => {
  const durations = [];
  let segmentStart = null;
  let condition = "aman";
  
  locationHistory.forEach((entry, index) => {
    if (entry.message === "At home") {
      segmentStart = moment(entry.timestamp)
    } else if (entry.message === "Arrived at destination." && segmentStart) {
      const endMoment = moment(entry.timestamp);
      const duration = moment.duration(endMoment.diff(segmentStart));
      const hours = Math.floor(duration.asHours());
      const minutes = duration.minutes();
      if (duration.asMinutes()>60) {
        condition = "kendala";
      }
      // const duration = moment.duration(moment(entry.timestamp).diff(moment(segmentStart)));
      durations.push({
        condition,
        duration: `${hours} hours, ${minutes} minutes`,
        start: segmentStart.format('YYYY-MM-DD HH:mm:ss'),
        end: endMoment.format('YYYY-MM-DD HH:mm:ss')
      });
      segmentStart = null;
    }
  });

  return durations;
};

module.exports = {
    calculateTimeDifference
}