// =========================================================================
// 2. OBTENER BLOQUE ACTUAL Y TIEMPO DE INICIO (ESTandarizado en UTC)
// =========================================================================

function getRotationSlot() {
    const now = Date.now();
    // Punto de referencia fijo global en UTC (Ej: 1 de Enero de 2026, 00:00 UTC)
    const anchorDate = Date.UTC(2026, 0, 1, 0, 0, 0); 
    const elapsed = now - anchorDate;
    // Retorna cuántas bloques de 2 horas han pasado desde la fecha ancla
    return Math.floor(elapsed / (2 * 60 * 60 * 1000));
}

function getCurrentSlotStartTime() {
    const now = new Date();
    // Normalizamos usando métodos UTC para evitar desfases de horario local
    const utcHours = now.getUTCHours();
    const currentEvenHour = utcHours - (utcHours % 2);
    
    const startTime = new Date(Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate(),
        currentEvenHour,
        0, 0, 0
    ));
    return startTime;
}