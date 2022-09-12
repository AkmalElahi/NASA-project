const {
  getAllLaunches,
  scheduleNewLaunch,
  existLaunchWithId,
  abortLaunchWithId,
} = require("../../models/launches.model");

async function httpGetAllLaunches(req, res) {
  console.log(getAllLaunches());
  return res.status(200).json(await getAllLaunches());
}

async function httpAddNewLaunch(req, res) {
  const launch = req.body;
  console.log("BODY", req.body);
  if (!launch.mission || !launch.rocket || !launch.target || !launch.launchDate)
    return res.status(400).json({ error: "Missing required launch data" });
  launch.launchDate = new Date(launch.launchDate);
  if (isNaN(launch.launchDate))
    return res.status(400).json({ error: "Invalid launch date" });
  await scheduleNewLaunch(launch);
  return res.status(201).json(launch);
}

async function httpAbortLaunch(req, res) {
  const launchId = Number(req.params.id);
  const existsLaunch = await existLaunchWithId(launchId);
  if (!existsLaunch) {
    return res.status(400).json({
      error: "Launch not found",
    });
  }
  const aborted = await abortLaunchWithId(launchId);
  if (!aborted) {
    return res.status(400).json({ error: "Launch not aboreted" });
  }
  return res.status(200).json({ ok: true });
}

module.exports = {
  httpGetAllLaunches,
  httpAddNewLaunch,
  httpAbortLaunch,
};
