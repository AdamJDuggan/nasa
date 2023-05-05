const launchesDatabase = require("./launches.mongo");
const planets = require("./planets.mongo");
const launches = new Map();

const DEFAULT_FLIGHT_NUMBER = 100;

const launch = {
  flightNumber: 100,
  mission: "Kelper Explore X",
  rocket: "Explorer Is1",
  launchDate: new Date("December 27, 2030"),
  target: "Kepler-442 b",
  customers: ["NASA", "ZM"],
  upcoming: true,
  success: true,
};

async function existsLaunchWithId(launchId) {
  return await launchesDatabase.findOne({ flightNumber: launchId });
}

async function getLatestFlightNumber() {
  // Sort desending and return  first document
  const latestLaunch = await launchesDatabase.findOne().sort("-flightNumber");
  return latestLaunch ? latestLaunch.flightNumber : DEFAULT_FLIGHT_NUMBER;
}

async function getAllLaunches() {
  return await launchesDatabase.find({}, { _id: 0, __v: 0 });
}

async function scheduleNewLaunch(launch) {
  const flightNumber = (await getLatestFlightNumber()) + 1;
  const newLaunch = {
    ...launch,
    flightNumber,
    success: true,
    upcoming: true,
    customers: ["NASA", "ZM"],
  };
  await saveLaunch(newLaunch);
}

async function saveLaunch(launch) {
  const planet = await planets.findOne({ keplerName: launch.target });
  if (planet) {
    await launchesDatabase.updateOne(
      {
        flightNumber: launch.flightNumber,
      },
      launch,
      {
        upsert: true,
      }
    );
  } else {
    throw new Error("No matching planet was found");
  }
}

saveLaunch(launch);

async function abortLaunchById(launchId) {
  const aborted = await launchesDatabase.updateOne(
    { flightNumber: launchId },
    { upcoming: false, success: false }
  );
  return aborted.modifiedCount === 1;
}

module.exports = {
  existsLaunchWithId,
  getAllLaunches,
  scheduleNewLaunch,
  abortLaunchById,
};
