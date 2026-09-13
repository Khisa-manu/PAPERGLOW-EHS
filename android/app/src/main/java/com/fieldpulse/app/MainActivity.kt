package com.fieldpulse.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.viewModels
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Assessment
import androidx.compose.material.icons.filled.ListAlt
import androidx.compose.material.icons.filled.Schedule
import androidx.compose.material.icons.filled.Warning
import androidx.compose.material3.*
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import com.fieldpulse.app.ui.FieldPulseViewModel
import com.fieldpulse.app.ui.screens.ClockInScreen
import com.fieldpulse.app.ui.screens.EHSReportScreen
import com.fieldpulse.app.ui.screens.RecordsScreen
import com.fieldpulse.app.ui.theme.FieldPulseTheme

class MainActivity : ComponentActivity() {
    private val viewModel: FieldPulseViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            FieldPulseTheme {
                val uiState by viewModel.uiState.collectAsState()

                Scaffold(
                    modifier = Modifier.fillMaxSize(),
                    bottomBar = {
                        NavigationBar {
                            NavigationBarItem(
                                selected = uiState.activeTab == 0,
                                onClick = { viewModel.setTab(0) },
                                icon = { Icon(Icons.Default.Schedule, contentDescription = "Clock In") },
                                label = { Text("Clock In") }
                            )
                            NavigationBarItem(
                                selected = uiState.activeTab == 1,
                                onClick = { viewModel.setTab(1) },
                                icon = { Icon(Icons.Default.Warning, contentDescription = "EHS Safety") },
                                label = { Text("EHS Safety") }
                            )
                            NavigationBarItem(
                                selected = uiState.activeTab == 2,
                                onClick = { viewModel.setTab(2) },
                                icon = { Icon(Icons.Default.ListAlt, contentDescription = "Records") },
                                label = { Text("Records") }
                            )
                        }
                    }
                ) { innerPadding ->
                    Surface(
                        modifier = Modifier
                            .fillMaxSize()
                            .padding(innerPadding),
                        color = MaterialTheme.colorScheme.background
                    ) {
                        when (uiState.activeTab) {
                            0 -> ClockInScreen(viewModel)
                            1 -> EHSReportScreen(viewModel)
                            2 -> RecordsScreen(viewModel)
                        }
                    }
                }
            }
        }
    }
}
