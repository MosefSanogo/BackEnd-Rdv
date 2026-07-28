import ReservationModel from "../models/reservation.model.js";
import rulesModel from "../models/rules.model.js";
import timeSlotModel from "../models/timeSlot.model.js";
import crypto from "crypto";

const register = async (data) => {
  let result;
  try {
    // 0. Vérifier si le client n'a pas atteint le nombre maximum de réservations pour ce service
    const clientCount = await ReservationModel.countClientReservationsWithDateAndService(
      data.citoyenId,
      data.date,
      data.serviceId,
    );
    const rules = await rulesModel.findByServiceId(data.serviceId);
    console.log(rules);
    if(clientCount >= rules?.client_max) {
      return {
        message: "Vous avez atteint le nombre maximum de réservations pour ce service",
        qrToken: null,
        id: null,
      };
    }
    // 1. Diminuer la capacité
    result = await timeSlotModel.decrementCapacity(data.timeSlotId);
    if (result.affectedRows === 0) {
      return {
        message: "Créneau complet, veuillez choisir un autre créneau",
        qrToken: null,
        id: null,
      };
    }

    const qrToken = crypto.randomUUID();

    // 2. Créer la réservation
    const { id } = await ReservationModel.create({
      ...data,
      qrToken,
    });

    if (!id) {
      // 3. Restaurer si création mal retournée (rare)
      await timeSlotModel.incrementCapacity(data.timeSlotId);
      return {
        message: "Erreur lors de la création de la réservation",
        qrToken: null,
        id: null,
      };
    }

    return { message: "Réservation confirmée", qrToken, id };
  } catch (error) {
    // 4. Restaurer la capacité en cas d’erreur (SQL, etc.)
    console.error("Error during reservation:", error);
    await timeSlotModel.incrementCapacity(data.timeSlotId);

    return {
      message: "Erreur lors de l'enregistrement de la réservation",
      qrToken: null,
      id: null,
    };
  }
};

const deleteReservationById = async (id) => {
  const reservation = await ReservationModel.findById(id);
  console.log(reservation.time_slot_id)
  if (!reservation) {
    throw new Error("Réservation introuvable");
  }
  await timeSlotModel.incrementCapacity(reservation.time_slot_id);
  return await ReservationModel.deleteReservationById(id);
};

const getByDateAndSousService = async (date, sousServiceId) => {
  return await ReservationModel.findByDateAndSousService(date, sousServiceId);
};

const getByDateAndService = async (date, serviceId) => {
  return await ReservationModel.findByDateAndService(date, serviceId);
};

const getByDateAndServiceGroupByTime = async (date, serviceId) => {
  return await ReservationModel.findByDateAndServiceGroupByTime(
    date,
    serviceId,
  );
};

const getByQrCode = async (qrCode) => {
  const result = await ReservationModel.findByQrToken(qrCode);
  if (result.id) {
    const update = await ReservationModel.updateStatus(result.id, "Valide");
    if (update.affectedRows === 0) {
      throw new Error("Réservation introuvable");
    }
  }
  return result;
};

const setStatus = async (id, statut) => {
  const result = await ReservationModel.updateStatus(id, statut);
  if (result.affectedRows === 0) {
    throw new Error("Réservation introuvable");
  }

  return { message: "Statut mise à jour avec succès" };
};

const getAllClientReservation = async (serviceId) => {
  return await ReservationModel.findAllClientReservation(serviceId);
};

const getClientReservation = async (clientId) => {
  return await ReservationModel.findClientReservation(clientId);
};
const getClientAllReservation = async (clientId) => {
  return await ReservationModel.findClientAllReservation(clientId);
};

const getStatisticByServiceId = async (serviceId) => {
  return await ReservationModel.findStatisticByServiceId(serviceId);
};
const getHourlyDataByServiceIdAndDate = async (serviceId, date) => {
  const rows1 = await ReservationModel.findByDateAndServiceGroupByTime(
    date,
    serviceId,
  );
  const rows2 =
    await ReservationModel.findTimeSlotCapacityByDateAndServiceGroupByTime(
      serviceId,
    );

  const reservationsMap = new Map(
    rows1.map((item) => [item.time, item.total_reservations]),
  );

  const rows = rows2.map((item2) => ({
    hour: item2.time,
    appointments: reservationsMap.get(item2.time) || 0,
    capacity: Number(item2.capacity),
  }));
  return rows;
};
const getDayServiceDistributionByServiceIdAndDate = async (serviceId, date) => {
  return await ReservationModel.findDayServiceDistributionByServiceIdAndDate(
    serviceId,
    date,
  );
};

const getWeeklyDataByServiceIdAndDate = async (serviceId, date) => {
  return await ReservationModel.findWeeklyDataByServiceIdAndDate(serviceId, date);
}
const getWeeklyServiceDistributionByServiceIdAndDate = async (serviceId, date) => {
  return await ReservationModel.findWeeklyServiceDistributionByServiceIdAndDate(serviceId, date);
}
const getMonthlyByServiceIdAndDate = async (serviceId, date) => {
  return await ReservationModel.findMonthlyByServiceIdAndDate(serviceId, date);
}
const getMonthlyServiceDistributionByServiceIdAndDate = async (serviceId, date) => {
  return await ReservationModel.findMonthlyServiceDistributionByServiceIdAndDate(serviceId, date);
}
const getYearlyByServiceIdAndDate = async (serviceId, date) => {
  return await ReservationModel.findYearlyByServiceIdAndDate(serviceId, date);
}
const getYearlyServiceDistributionByServiceIdAndDate = async (serviceId, date) => {
  return await ReservationModel.findYearlyServiceDistributionByServiceIdAndDate(serviceId, date);
}

export default {
  register,
  getByDateAndSousService,
  getByDateAndService,
  getByQrCode,
  setStatus,
  getByDateAndServiceGroupByTime,
  getAllClientReservation,
  getClientReservation,
  getStatisticByServiceId,
  getHourlyDataByServiceIdAndDate,
  getDayServiceDistributionByServiceIdAndDate,
  getWeeklyDataByServiceIdAndDate,
  getWeeklyServiceDistributionByServiceIdAndDate,
  getMonthlyByServiceIdAndDate,
  getMonthlyServiceDistributionByServiceIdAndDate,
  getYearlyByServiceIdAndDate,
  getYearlyServiceDistributionByServiceIdAndDate,
  getClientAllReservation,
  deleteReservationById,
};
