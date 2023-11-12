const moment = require('moment');

const calculateTimeDifference = (locationHistory) => {
  const durations = [];
  let segmentStart = null;

  locationHistory.forEach((entry, index) => {
    if (entry.message === "At home") {
      segmentStart = moment(entry.timestamp).format('YYYY-MM-DD HH:mm:ss')
    } else if (entry.message === "Arrived at destination." && segmentStart) {
      const endMoment = moment(entry.timestamp);
      const duration = moment.duration(endMoment.diff(segmentStart));
      const hours = Math.floor(duration.asHours());
      const minutes = duration.minutes();
      // const duration = moment.duration(moment(entry.timestamp).diff(moment(segmentStart)));
      durations.push({
        duration: `${hours} hours, ${minutes} minutes`,
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