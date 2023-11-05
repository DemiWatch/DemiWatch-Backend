const getManeuvers = (routes) => {
    const allManeuvers = [];
    routes.forEach((route) => {
      route.legs.forEach((leg) => {
        leg.steps.forEach((step) => {
          allManeuvers.push(step.maneuver);
        });
      });
    });
  
    return allManeuvers;
};

module.exports = {
    getManeuvers
}
