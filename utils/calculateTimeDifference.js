const moment = require('moment');

const calculateTimeDifference = (locationHistory) => {
  const durations = [];
  let segmentStart = null;

  locationHistory.forEach((entry, index) => {
    if (entry.message === "At home") {
      segmentStart = moment(entry.timestamp).format('YYYY-MM-DD HH:mm:ss')
    } else if (entry.message === "Arrived at destination." && segmentStart) {
      const duration = moment.duration(moment(entry.timestamp).diff(moment(segmentStart)));
      durations.push({
        duration: duration.humanize(),
        start: segmentStart,
        end: moment(entry.timestamp).format('YYYY-MM-DD HH:mm:ss')
      });
      segmentStart = null;
    }
  });

  return durations;
};

module.exports = {
    calculateTimeDifference
}