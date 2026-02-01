import dayjs from "dayjs";
import timeSlotModel from "../models/timeSlot.model.js"
import horaireTravailModel from "../models/horaireTravail.model.js";
import feriesModel from "../models/feries.model.js";

const generateTimeSlotsIfNotExist = async (date, serviceId, sousServiceId) => {

    // Verifions si c'est pas un jour ferié

    const feries = await feriesModel.findByServiceIdAndDate(date,serviceId);

    if(feries){
        throw new Error('Jour férié')
    }

    // Verifions si le slot existe 
    const existing = await timeSlotModel.findByDateAndSousService(date,sousServiceId);
    console.log(existing)
    if(existing.length > 0){
        return existing;
    }
      const jourSemaine = dayjs(date).day(); 
      const jourDB = jourSemaine === 0 ? 7 : jourSemaine

      // Recuperation de l'horaire 
      const horaires = await horaireTravailModel.findBySousServiceAndDay(sousServiceId,jourDB);

      if (!horaires || horaires.actif === 0) {
        throw new Error("Service fermé ce jour");
        };

    const {
        heure_debut,
        heure_fin,
        capacity_heure
    } = horaires;
    // Generation des slots
    const slotDuration = Math.floor(60 / capacity_heure);
    let current = dayjs(`${date} ${heure_debut}`);
    const end = dayjs(`${date} ${heure_fin}`);

    const slotsToCreate = [];

    while (current.isBefore(end)) {
        slotsToCreate.push({
        service_id: serviceId,
        sous_service_id: sousServiceId,
        date,
        heure: current.format("HH:mm:ss"),
        capacite_totale: 1,
        capacite_restante: 1
        });

        current = current.add(slotDuration, "minute");
    }
    console.log(slotsToCreate)
    if (slotsToCreate.length > 0) {
        await timeSlotModel.bulkInsert(slotsToCreate);
    }

    return await timeSlotModel.findByDateAndSousService(date, sousServiceId);

}

export default{
    generateTimeSlotsIfNotExist
}