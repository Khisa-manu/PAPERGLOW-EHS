package com.fieldpulse.app.ui

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.fieldpulse.app.data.local.FieldPulseDatabase
import com.fieldpulse.app.data.model.*
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch

data class UIState(
    val currentTechnician: Technician = Technician(
        id = "tech-01",
        name = "Marcus Rodriguez",
        employeeCode = "FP-7842",
        role = "Lead Automation Specialist",
        assignedSite = "Facility Delta - Compressor Station #4",
        isClockedIn = false
    ),
    val isClockedIn: Boolean = false,
    val lastClockTime: Long? = null,
    val isOfflineMode: Boolean = false,
    val pendingSyncCount: Int = 0,
    val currentLatitude: Double = 29.7604,
    val currentLongitude: Double = -95.3698,
    val facilityCode: String = "FAC-TX-HOU-04",
    val gpsAccuracyMeters: Float = 4.2f,
    val isMockLocationDetected: Boolean = false,
    val activeTab: Int = 0 // 0: Clock-in, 1: EHS Report, 2: Records, 3: Admin
)

class FieldPulseViewModel(application: Application) : AndroidViewModel(application) {
    private val database = FieldPulseDatabase.getDatabase(application)
    private val clockDao = database.clockRecordDao()
    private val ehsDao = database.ehsIncidentDao()

    private val _uiState = MutableStateFlow(UIState())
    val uiState: StateFlow<UIState> = _uiState.asStateFlow()

    val clockRecords: StateFlow<List<ClockRecord>> = clockDao.getAllRecords()
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val ehsIncidents: StateFlow<List<EHSIncident>> = ehsDao.getAllIncidents()
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    init {
        // Observe pending offline sync items
        viewModelScope.launch {
            clockDao.getAllRecords().collect { records ->
                val pending = records.count { it.syncStatus == SyncStatus.PENDING_OFFLINE }
                _uiState.update { it.copy(pendingSyncCount = pending) }
            }
        }
    }

    fun setTab(index: Int) {
        _uiState.update { it.copy(activeTab = index) }
    }

    fun toggleOfflineSimulation() {
        _uiState.update { it.copy(isOfflineMode = !it.isOfflineMode) }
    }

    fun clockIn(
        shiftType: ShiftType = ShiftType.REGULAR_MORNING,
        verificationMethod: VerificationMethod = VerificationMethod.GEO_FENCE,
        notes: String = ""
    ) {
        viewModelScope.launch {
            val state = _uiState.value
            val isOffline = state.isOfflineMode
            val record = ClockRecord(
                technicianId = state.currentTechnician.id,
                technicianName = state.currentTechnician.name,
                type = "CLOCK_IN",
                latitude = state.currentLatitude,
                longitude = state.currentLongitude,
                accuracyMeters = state.gpsAccuracyMeters,
                isMockLocation = state.isMockLocationDetected,
                facilityCode = state.facilityCode,
                verificationMethod = verificationMethod,
                shiftType = shiftType,
                syncStatus = if (isOffline) SyncStatus.PENDING_OFFLINE else SyncStatus.SYNCED,
                notes = notes
            )
            clockDao.insertRecord(record)
            _uiState.update {
                it.copy(
                    isClockedIn = true,
                    lastClockTime = System.currentTimeMillis()
                )
            }
        }
    }

    fun clockOut(notes: String = "") {
        viewModelScope.launch {
            val state = _uiState.value
            val isOffline = state.isOfflineMode
            val record = ClockRecord(
                technicianId = state.currentTechnician.id,
                technicianName = state.currentTechnician.name,
                type = "CLOCK_OUT",
                latitude = state.currentLatitude,
                longitude = state.currentLongitude,
                accuracyMeters = state.gpsAccuracyMeters,
                facilityCode = state.facilityCode,
                verificationMethod = VerificationMethod.GEO_FENCE,
                syncStatus = if (isOffline) SyncStatus.PENDING_OFFLINE else SyncStatus.SYNCED,
                notes = notes
            )
            clockDao.insertRecord(record)
            _uiState.update {
                it.copy(
                    isClockedIn = false,
                    lastClockTime = System.currentTimeMillis()
                )
            }
        }
    }

    fun submitEHSIncident(
        title: String,
        type: IncidentType,
        risk: RiskLevel,
        description: String,
        actionTaken: String
    ) {
        viewModelScope.launch {
            val state = _uiState.value
            val incident = EHSIncident(
                technicianId = state.currentTechnician.id,
                technicianName = state.currentTechnician.name,
                title = title,
                incidentType = type,
                riskLevel = risk,
                description = description,
                immediateActionTaken = actionTaken,
                latitude = state.currentLatitude,
                longitude = state.currentLongitude,
                syncStatus = if (state.isOfflineMode) SyncStatus.PENDING_OFFLINE else SyncStatus.SYNCED
            )
            ehsDao.insertIncident(incident)
        }
    }

    fun triggerSyncNow() {
        viewModelScope.launch {
            val pendingClock = clockDao.getPendingOfflineRecords()
            for (rec in pendingClock) {
                delay(150) // simulate upload network hop
                clockDao.updateRecord(rec.copy(syncStatus = SyncStatus.SYNCED))
            }
            val pendingEhs = ehsDao.getPendingOfflineIncidents()
            for (inc in pendingEhs) {
                delay(150)
                ehsDao.updateIncident(inc.copy(syncStatus = SyncStatus.SYNCED))
            }
            _uiState.update { it.copy(isOfflineMode = false, pendingSyncCount = 0) }
        }
    }
}
