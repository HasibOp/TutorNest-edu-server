const tutorProfileServices = require('../services/tutorProfileServices');

const getAllProfiles = async (req, res) => {
  try {
    const profiles = await tutorProfileServices.getAllProfiles();
    res.send(profiles);
  } catch (error) {
    res.status(500).send({ message: 'failed to fetch tutor profiles' });
  }
};

const getMyProfile = async (req, res) => {
  try {
    const profile = await tutorProfileServices.getProfileByEmail(req.decoded.email);
    res.send(profile || null);
  } catch (error) {
    res.status(500).send({ message: 'failed to fetch tutor profile' });
  }
};

const upsertMyProfile = async (req, res) => {
  try {
    const result = await tutorProfileServices.upsertProfile(req.decoded.email, req.body);
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: 'failed to save tutor profile' });
  }
};

module.exports = {
  getAllProfiles,
  getMyProfile,
  upsertMyProfile,
};
