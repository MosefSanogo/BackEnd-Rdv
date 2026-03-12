import rulesModel from "../models/rules.model.js";
const register = async (data) => {
  return await rulesModel.create(data);
};
const getByServiceId = async (serviceId) => {
  const result = await rulesModel.findByServiceId(serviceId);
  const formated = {
    minDelay: result?.delay_min,
    maxAdvance: result?.delay_max,
    maxPerDay: result?.client_max,
    cancellationDelay: result?.delay_cancel,
  };
  return formated;
};

export default {
  register,
  getByServiceId,
};
