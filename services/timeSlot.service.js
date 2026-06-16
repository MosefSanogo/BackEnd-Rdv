import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween.js";
dayjs.extend(isBetween);

import timeSlotModel from "../models/timeSlot.model.js";
import horaireTravailModel from "../models/horaireTravail.model.js";
import feriesModel from "../models/feries.model.js";
import pauseModel from "../models/pause.model.js";

const generateTimeSlotsIfNotExist = async (date, serviceId, sousServiceId) => {
  // 1. Jours fériés
  const feries = await feriesModel.findByServiceIdAndDate(date, serviceId);
  if (feries) {
    return [];
  }

  // 2. Existence des slots
  const existing = await timeSlotModel.findByDateAndSousService(
    date,
    sousServiceId,
  );
  if (existing.length > 0) {
    return existing;
  }

  const jourSemaine = dayjs(date).day();
  const jourDB = jourSemaine === 0 ? 7 : jourSemaine;

  // 3. Horaires de travail
  const horaires = await horaireTravailModel.findBySousServiceAndDay(
    sousServiceId,
    jourDB,
  );
  if (!horaires || horaires.actif === 0) {
    return [];
  }

  const { heure_debut, heure_fin, capacity_heure } = horaires;

  // 4. Horaires de pause
  const pauseHoraires =
    await pauseModel.findAllPausesBySousServiceId(sousServiceId);
  // 5. Générer les slots
  const slotDuration = Math.floor(60 / capacity_heure);
  let current = dayjs(`${date} ${heure_debut}`);
  const end = dayjs(`${date} ${heure_fin}`);

  const slotsToCreate = [];

  while (current.isBefore(end)) {
    const slotHeure = current.format("HH:mm:ss");

    // 6. Exclure si le slot est dans une pause
    let isInPause = false;
    for (const pause of pauseHoraires) {
      const pauseStart = dayjs(`${date} ${pause.heure_debut}`);
      const pauseEnd = dayjs(`${date} ${pause.heure_fin}`);
      const slotTime = dayjs(`${date} ${slotHeure}`);

      if (slotTime.isBetween(pauseStart, pauseEnd, null, "[)")) {
        // slot entre début (inclus) et fin (exclus) de la pause
        isInPause = true;
        break;
      }
    }

    if (!isInPause) {
      slotsToCreate.push({
        service_id: serviceId,
        sous_service_id: sousServiceId,
        date,
        heure: slotHeure,
        capacite_totale: 1,
        capacite_restante: 1,
      });
    }

    current = current.add(slotDuration, "minute");
  }

  if (slotsToCreate.length > 0) {
    
    await timeSlotModel.bulkInsert(slotsToCreate);
  }

  return await timeSlotModel.findByDateAndSousService(date, sousServiceId);
};

const isPeakHour = (slot) => {
  const percentageUsed =
    ((slot.capacity - slot.available) / slot.capacity) * 100;

  return percentageUsed >= 80;
};

const getTimeSlots = async (serviceId, sousServiceId, date) => {
  const { timeslots, count } =
    await timeSlotModel.findByServiceAndSousServiceAndDate(
      serviceId,
      sousServiceId,
      date,
    );
  const formattedSlots = timeslots.map((slot) => ({
    time: slot.time,
    available: parseInt(slot.available),
    capacity: parseInt(slot.capacity),
    percentage:
      slot.capacity > 0
        ? Math.round(((slot.capacity - slot.available) / slot.capacity) * 100)
        : 0,
    isPeakHour: isPeakHour(slot),
    isCompleted: slot.available === 0,
  }));
  return { slots: formattedSlots, count };
};

export default {
  generateTimeSlotsIfNotExist,
  getTimeSlots,
};
