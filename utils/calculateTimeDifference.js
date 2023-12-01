const moment = require('moment-timezone');

const calculateTimeDifference = (locationHistory) => {
  const durations = [];
  let segmentStart = null;
  
  locationHistory.forEach((entry, index) => {
    if (entry.message === "At home") {
      segmentStart = moment(entry.timestamp)
    } else if (entry.message === "Arrived at destination." && segmentStart) {
      const endMoment = moment(entry.timestamp);
      const duration = moment.duration(endMoment.diff(segmentStart));
      const hours = Math.floor(duration.asHours());
      const minutes = duration.minutes();
      const seconds = duration.seconds();
      let condition = "aman";
      if (duration.asMinutes()>60) {
        condition = "kendala";
      }
      durations.push({
        condition,
        duration: `${hours} hours, ${minutes} minutes, ${seconds} seconds`,
        start: segmentStart.tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss'),
        end: endMoment.tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss')
      });
      segmentStart = null;
    }
  });

  return durations;
};

module.exports = {
    calculateTimeDifference
}
