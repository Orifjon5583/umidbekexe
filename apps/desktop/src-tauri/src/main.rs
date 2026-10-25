// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod runner;

use runner::{CodeRunner, RunnerResult, TestCaseInput};
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct SystemInfo {
    pub os: String,
    pub arch: String,
    pub hostname: String,
}

#[tauri::command]
fn run_code(
    language: String,
    source_code: String,
    test_cases: Vec<TestCaseInput>,
    time_limit_ms: u64,
    memory_limit_mb: u64,
) -> RunnerResult {
    CodeRunner::execute(
        &language,
        &source_code,
        test_cases,
        time_limit_ms,
        memory_limit_mb,
    )
}

#[tauri::command]
fn verify_exit_code(input_code: String, expected_code: String) -> bool {
    let clean_input = input_code.trim();
    let clean_expected = expected_code.trim();
    clean_input == clean_expected
}

#[tauri::command]
fn get_system_info() -> SystemInfo {
    SystemInfo {
        os: std::env::consts::OS.to_string(),
        arch: std::env::consts::ARCH.to_string(),
        hostname: whoami_or_default(),
    }
}

fn whoami_or_default() -> String {
    std::env::var("COMPUTERNAME").unwrap_or_else(|_| "Windows-11-PC".to_string())
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            run_code,
            verify_exit_code,
            get_system_info
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
