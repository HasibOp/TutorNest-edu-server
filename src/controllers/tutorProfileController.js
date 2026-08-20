const tutorProfileServices = require('../services/tutorProfileServices');

const getAllProfiles = async (req, res) => {
  try {
    const { categoryId } = req.query;
    const profiles = await tutorProfileServices.getAllProfiles({ categoryId });
    res.send(profiles);
  } catch (error) {
    res.status(500).send({ message: 'failed to fetch tutor profiles' });
  }
};

const getProfile = async (req, res) => {
  try {
    const profile = await tutorProfileServices.getProfileById(req.params.id);
    if (!profile) {
      return res.status(404).send({ message: 'tutor profile not found' });
    }
    res.send(profile);
  } catch (error) {
    res.status(500).send({ message: 'failed to fetch tutor profile' });
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
  getProfile,
  getMyProfile,
  upsertMyProfile,
};
