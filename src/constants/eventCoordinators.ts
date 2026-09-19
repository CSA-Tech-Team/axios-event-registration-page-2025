/**
 * Student coordinators per event, keyed by event id, from the "Event
 * Descriptions for Website" sheet. The Event table has no column for these,
 * so they live here; the event page falls back to the DB conveners when an
 * event has no entry.
 */
export const EVENT_COORDINATORS: Record<string, { name: string; phone: string }[]> = {
  // Tech Triathlon
  TIMEE2600001: [
    { name: "Arulkevin J", phone: "8056990243" },
    { name: "Anirudhan S", phone: "8088572371" },
    { name: "Nivithasri A", phone: "8056623614" },
    { name: "Deepadharshan S", phone: "8610999867" },
  ],
  // Math Mania
  TIMEE2600008: [
    { name: "Niveda R", phone: "9363258127" },
    { name: "Keerthi Menon", phone: "9003061998" },
  ],
  // Survivors' Court
  TIMEE2600010: [
    { name: "Mithun Senthil V", phone: "7418250339" },
    { name: "Ranjana G", phone: "9495771225" },
  ],
  // QFactor
  TIMEE2600009: [
    { name: "L Shambhavi", phone: "8095943626" },
    { name: "Kaaviya S S", phone: "6382580231" },
  ],
  // Big Bull
  TIMEE2600003: [
    { name: "N B Shansita Shri", phone: "8334812473" },
    { name: "Durga Nandhini S", phone: "9698920880" },
  ],
  // Game Over - Valorant
  TIMEE2600007: [
    { name: "Harshavardhan E", phone: "6369721991" },
    { name: "Dharaneesh N J", phone: "8667857284" },
  ],
  // Game Over - FIFA
  TIMEE2600006: [
    { name: "Harshavardhan E", phone: "6369721991" },
    { name: "Dharaneesh N J", phone: "8667857284" },
  ],
  // Game Over - Chess
  TIMEE2600005: [
    { name: "Harshavardhan E", phone: "6369721991" },
    { name: "Dharaneesh N J", phone: "8667857284" },
  ],
  // Data Quest
  TIMEE2600002: [
    { name: "Tanaz I", phone: "6380022981" },
    { name: "Livin Joseph", phone: "9994392653" },
  ],
  // Breach Point
  TIMEE2600004: [
    { name: "Saivenketraj K.S", phone: "8056992112" },
    { name: "Aditya Hariharan M", phone: "7795588955" },
  ],
};
