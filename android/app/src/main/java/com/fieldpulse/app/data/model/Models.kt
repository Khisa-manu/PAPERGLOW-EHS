package com.fieldpulse.app.data.model

import androidx.room.Entity
import androidx.room.PrimaryKey
import java.util.UUID

enum class ShiftType {
    REGULAR_MORNING,
    AFTERNOON_FIELD,
    EMERGENCY_ON_CALL,
    NIGHT_OVERHAUL
}

enum class VerificationMethod {
    QR_FACILITY,
    GEO_FENCE,
    MANUAL_PIN,
    SUPERVISOR_OVERRIDE
}

enum class SyncStatus {
    PENDING_OFFLINE,
    SYNCING,
    SYNCED,
    CONFLICT
}

enum class RiskLevel {
    LOW,
    MEDIUM,
    HIGH,
    CRITICAL_STOP_WORK
}

enum class IncidentType {
    NEAR_MISS,
    HAZARD_IDENTIFIED,
    FIRST_AID,
    EQUIPMENT_FAILURE,
    CHEMICAL_SPILL,
    ENVIRONMENTAL_BREACH
}

@Entity(tableName = "clock_records")
data class ClockRecord(
    @PrimaryKey
    val id: String = UUID.randomUUID().toString(),
    val technicianId: String,
    val technicianName: String,
    val type: String, // "CLOCK_IN" or "CLOCK_OUT"
    val timestamp: Long = System.currentTimeMillis(),
    val latitude: Double? = null,
    val longitude: Double? = null,
    val accuracyMeters: Float? = null,
    val isMockLocation: Boolean = false,
    val facilityCode: String? = null,
    val verificationMethod: VerificationMethod = VerificationMethod.GEO_FENCE,
    val shiftType: ShiftType = ShiftType.REGULAR_MORNING,
    val syncStatus: SyncStatus = SyncStatus.SYNCED,
    val notes: String = "",
    val photoBase64: String? = null
)

@Entity(tableName = "ehs_incidents")
data class EHSIncident(
    @PrimaryKey
    val id: String = UUID.randomUUID().toString(),
    val technicianId: String,
    val technicianName: String,
    val title: String,
    val incidentType: IncidentType,
    val riskLevel: RiskLevel,
    val description: String,
    val immediateActionTaken: String,
    val latitude: Double? = null,
    val longitude: Double? = null,
    val timestamp: Long = System.currentTimeMillis(),
    val syncStatus: SyncStatus = SyncStatus.SYNCED,
    val photoBase64: String? = null
)

data class Technician(
    val id: String,
    val name: String,
    val employeeCode: String,
    val role: String,
    val assignedSite: String,
    val isClockedIn: Boolean = false
)
