const { getAllLaunches, addNewLaunch, existLaunchWithId, abortLaunchWithId } = require("../../models/launches.model");

function httpGetAllLaunches(req, res) {
  console.log(getAllLaunches());
  return res.status(200).json(getAllLaunches());
}

function httpAddNewLaunch(req, res) {
  const launch = req.body;
  console.log("BODY", req.body);
  if (!launch.mission || !launch.rocket || !launch.target || !launch.launchDate)
    return res.status(400).json({ error: "Missing required launch data" });
  launch.launchDate = new Date(launch.launchDate);
  if (isNaN(launch.launchDate))
    return res.status(400).json({ error: "Invalid launch date" });
  addNewLaunch(launch);
  return res.status(201).json(launch);
}

function httpAbortLaunch(req, res) {
  const launchId = Number(req.params.id);
  if (!existLaunchWithId(launchId)) {
    return res.status(400).json({
      error: "Launch not found",
    });
  }
  const aborted = abortLaunchWithId(launchId);
  return res.status(200).json(aborted)
}

module.exports = {
  httpGetAllLaunches,
  httpAddNewLaunch,
  httpAbortLaunch,
};
