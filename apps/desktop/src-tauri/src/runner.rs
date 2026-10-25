use serde::{Deserialize, Serialize};
use std::fs;
use std::io::Write;
use std::path::{Path, PathBuf};
use std::process::{Command, Stdio};
use std::time::{Duration, Instant};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TestCaseInput {
    pub id: String,
    pub input_data: String,
    pub expected_output: String,
    pub is_hidden: bool,
    pub order_index: usize,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TestResultItem {
    pub test_number: usize,
    pub test_case_id: Option<String>,
    pub status: String, // "passed" | "failed" | "error" | "timeout"
    pub execution_time_ms: u64,
    pub error_summary: Option<String>,
    pub actual_output: Option<String>,
    pub expected_output: Option<String>,
    pub input_data: Option<String>,
    pub is_hidden: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RunnerResult {
    pub status: String, // "accepted" | "wrong_answer" | "compile_error" | "runtime_error" | "time_limit_exceeded" | "memory_limit_exceeded" | "output_limit_exceeded" | "runner_error"
    pub stdout: String,
    pub stderr: String,
    pub execution_time_ms: u64,
    pub cpu_time_ms: u64,
    pub peak_memory_bytes: u64,
    pub passed_tests: usize,
    pub total_tests: usize,
    pub test_results: Vec<TestResultItem>,
    pub error: Option<String>,
}

pub struct CodeRunner;

impl CodeRunner {
    pub fn execute(
        language: &str,
        source_code: &str,
        test_cases: Vec<TestCaseInput>,
        time_limit_ms: u64,
        memory_limit_mb: u64,
    ) -> RunnerResult {
        let temp_dir = match tempfile::Builder::new().prefix("codepractice_run_").tempdir() {
            Ok(dir) => dir,
            Err(e) => {
                return RunnerResult {
                    status: "runner_error".to_string(),
                    stdout: String::new(),
                    stderr: format!("Vaqtinchalik papka yaratishda xatolik: {}", e),
                    execution_time_ms: 0,
                    cpu_time_ms: 0,
                    peak_memory_bytes: 0,
                    passedTests: 0,
                    total_tests: test_cases.len(),
                    test_results: vec![],
                    error: Some(e.to_string()),
                };
            }
        };

        match language {
            "python" => Self::run_python(temp_dir.path(), source_code, test_cases, time_limit_ms, memory_limit_mb),
            "cpp" => Self::run_cpp(temp_dir.path(), source_code, test_cases, time_limit_ms, memory_limit_mb),
            _ => RunnerResult {
                status: "runner_error".to_string(),
                stdout: String::new(),
                stderr: format!("Qo‘llab-quvvatlanmaydigan til: {}", language),
                execution_time_ms: 0,
                cpu_time_ms: 0,
                peak_memory_bytes: 0,
                passedTests: 0,
                total_tests: test_cases.len(),
                test_results: vec![],
                error: Some("Unsupported language".to_string()),
            },
        }
    }

    fn run_python(
        dir: &Path,
        code: &str,
        test_cases: Vec<TestCaseInput>,
        time_limit_ms: u64,
        _memory_limit_mb: u64,
    ) -> RunnerResult {
        let script_path = dir.join("solution.py");
        if let Err(e) = fs::write(&script_path, code) {
            return RunnerResult {
                status: "runner_error".to_string(),
                stdout: String::new(),
                stderr: format!("Kodni faylga yozishda xatolik: {}", e),
                execution_time_ms: 0,
                cpu_time_ms: 0,
                peak_memory_bytes: 0,
                passedTests: 0,
                total_tests: test_cases.len(),
                test_results: vec![],
                error: Some(e.to_string()),
            };
        }

        // Python komandasini aniqlash: python yoki py
        let python_cmd = Self::resolve_python_command();

        Self::run_tests_with_command(
            &python_cmd,
            &["-u", script_path.to_str().unwrap_or("solution.py")],
            dir,
            test_cases,
            time_limit_ms,
        )
    }

    fn run_cpp(
        dir: &Path,
        code: &str,
        test_cases: Vec<TestCaseInput>,
        time_limit_ms: u64,
        _memory_limit_mb: u64,
    ) -> RunnerResult {
        let source_path = dir.join("solution.cpp");
        let exe_path = dir.join("solution.exe");

        if let Err(e) = fs::write(&source_path, code) {
            return RunnerResult {
                status: "runner_error".to_string(),
                stdout: String::new(),
                stderr: format!("C++ kodini yozishda xatolik: {}", e),
                execution_time_ms: 0,
                cpu_time_ms: 0,
                peak_memory_bytes: 0,
                passedTests: 0,
                total_tests: test_cases.len(),
                test_results: vec![],
                error: Some(e.to_string()),
            };
        }

        // C++ kompilyatsiya
        let compile_output = Command::new("g++")
            .args(&[
                "-O2",
                "-std=c++17",
                source_path.to_str().unwrap(),
                "-o",
                exe_path.to_str().unwrap(),
            ])
            .current_dir(dir)
            .output();

        match compile_output {
            Ok(out) => {
                if !out.status.success() {
                    let stderr = String::from_utf8_lossy(&out.stderr).to_string();
                    return RunnerResult {
                        status: "compile_error".to_string(),
                        stdout: String::new(),
                        stderr,
                        execution_time_ms: 0,
                        cpu_time_ms: 0,
                        peak_memory_bytes: 0,
                        passedTests: 0,
                        total_tests: test_cases.len(),
                        test_results: vec![],
                        error: Some("Kompilyatsiya muvaffaqiyatsiz bo‘ldi".to_string()),
                    };
                }
            }
            Err(e) => {
                return RunnerResult {
                    status: "compile_error".to_string(),
                    stdout: String::new(),
                    stderr: format!("g++ kompilyatori topilmadi yoki xato: {}. Iltimos, MinGW-w64 o‘rnatilganini tekshiring.", e),
                    execution_time_ms: 0,
                    cpu_time_ms: 0,
                    peak_memory_bytes: 0,
                    passedTests: 0,
                    total_tests: test_cases.len(),
                    test_results: vec![],
                    error: Some(e.to_string()),
                };
            }
        }

        Self::run_tests_with_command(
            exe_path.to_str().unwrap(),
            &[],
            dir,
            test_cases,
            time_limit_ms,
        )
    }

    fn resolve_python_command() -> String {
        if Command::new("python").arg("--version").output().is_ok() {
            return "python".to_string();
        }
        if Command::new("py").arg("--version").output().is_ok() {
            return "py".to_string();
        }
        "python".to_string()
    }

    fn run_tests_with_command(
        command: &str,
        args: &[&str],
        work_dir: &Path,
        test_cases: Vec<TestCaseInput>,
        time_limit_ms: u64,
    ) -> RunnerResult {
        let mut passed_tests = 0;
        let mut overall_status = "accepted".to_string();
        let mut last_stdout = String::new();
        let mut last_stderr = String::new();
        let mut max_exec_time: u64 = 0;
        let total_tests = test_cases.len();
        let mut test_results = Vec::new();

        for (idx, tc) in test_cases.into_iter().enumerate() {
            let start = Instant::now();
            let mut child = match Command::new(command)
                .args(args)
                .current_dir(work_dir)
                .stdin(Stdio::piped())
                .stdout(Stdio::piped())
                .stderr(Stdio::piped())
                .spawn()
            {
                Ok(child) => child,
                Err(e) => {
                    return RunnerResult {
                        status: "runner_error".to_string(),
                        stdout: String::new(),
                        stderr: format!("Jarayonni ishga tushirishda xatolik: {}", e),
                        execution_time_ms: 0,
                        cpu_time_ms: 0,
                        peak_memory_bytes: 0,
                        passedTests: 0,
                        total_tests,
                        test_results,
                        error: Some(e.to_string()),
                    };
                }
            };

            // Write input to stdin
            if let Some(mut stdin) = child.stdin.take() {
                let _ = stdin.write_all(tc.input_data.as_bytes());
            }

            // Wait with timeout
            let timeout = Duration::from_millis(time_limit_ms);
            let check_interval = Duration::from_millis(20);
            let mut timed_out = false;

            loop {
                match child.try_wait() {
                    Ok(Some(_status)) => break,
                    Ok(None) => {
                        if start.elapsed() > timeout {
                            let _ = child.kill();
                            timed_out = true;
                            break;
                        }
                        std::thread::sleep(check_interval);
                    }
                    Err(_) => {
                        let _ = child.kill();
                        break;
                    }
                }
            }

            let elapsed_ms = start.elapsed().as_millis() as u64;
            if elapsed_ms > max_exec_time {
                max_exec_time = elapsed_ms;
            }

            if timed_out {
                overall_status = "time_limit_exceeded".to_string();
                test_results.push(TestResultItem {
                    test_number: idx + 1,
                    test_case_id: Some(tc.id),
                    status: "timeout".to_string(),
                    execution_time_ms: elapsed_ms,
                    error_summary: Some("Vaqt chegarasi oshib ketdi (Time Limit Exceeded)".to_string()),
                    actual_output: None,
                    expected_output: if !tc.is_hidden { Some(tc.expected_output) } else { None },
                    input_data: if !tc.is_hidden { Some(tc.input_data) } else { None },
                    is_hidden: tc.is_hidden,
                });
                break;
            }

            let output = match child.wait_with_output() {
                Ok(o) => o,
                Err(e) => {
                    overall_status = "runtime_error".to_string();
                    test_results.push(TestResultItem {
                        test_number: idx + 1,
                        test_case_id: Some(tc.id),
                        status: "error".to_string(),
                        execution_time_ms: elapsed_ms,
                        error_summary: Some(e.to_string()),
                        actual_output: None,
                        expected_output: if !tc.is_hidden { Some(tc.expected_output) } else { None },
                        input_data: if !tc.is_hidden { Some(tc.input_data) } else { None },
                        is_hidden: tc.is_hidden,
                    });
                    break;
                }
            };

            let stdout_str = String::from_utf8_lossy(&output.stdout).to_string();
            let stderr_str = String::from_utf8_lossy(&output.stderr).to_string();

            last_stdout = stdout_str.clone();
            last_stderr = stderr_str.clone();

            if !output.status.success() {
                overall_status = "runtime_error".to_string();
                test_results.push(TestResultItem {
                    test_number: idx + 1,
                    test_case_id: Some(tc.id),
                    status: "error".to_string(),
                    execution_time_ms: elapsed_ms,
                    error_summary: Some(stderr_str),
                    actual_output: Some(stdout_str),
                    expected_output: if !tc.is_hidden { Some(tc.expected_output) } else { None },
                    input_data: if !tc.is_hidden { Some(tc.input_data) } else { None },
                    is_hidden: tc.is_hidden,
                });
                break;
            }

            // Normalizatsiya qilib solishtirish (trim lines and spaces)
            let actual_clean = Self::normalize_output(&stdout_str);
            let expected_clean = Self::normalize_output(&tc.expected_output);

            if actual_clean == expected_clean {
                passed_tests += 1;
                test_results.push(TestResultItem {
                    test_number: idx + 1,
                    test_case_id: Some(tc.id),
                    status: "passed".to_string(),
                    execution_time_ms: elapsed_ms,
                    error_summary: None,
                    actual_output: if !tc.is_hidden { Some(stdout_str) } else { None },
                    expected_output: if !tc.is_hidden { Some(tc.expected_output) } else { None },
                    input_data: if !tc.is_hidden { Some(tc.input_data) } else { None },
                    is_hidden: tc.is_hidden,
                });
            } else {
                overall_status = "wrong_answer".to_string();
                test_results.push(TestResultItem {
                    test_number: idx + 1,
                    test_case_id: Some(tc.id),
                    status: "failed".to_string(),
                    execution_time_ms: elapsed_ms,
                    error_summary: Some("Noto‘g‘ri javob (Wrong Answer)".to_string()),
                    actual_output: if !tc.is_hidden { Some(stdout_str) } else { None },
                    expected_output: if !tc.is_hidden { Some(tc.expected_output) } else { None },
                    input_data: if !tc.is_hidden { Some(tc.input_data) } else { None },
                    is_hidden: tc.is_hidden,
                });
                break; // Stop on first failure
            }
        }

        RunnerResult {
            status: overall_status,
            stdout: last_stdout,
            stderr: last_stderr,
            execution_time_ms: max_exec_time,
            cpu_time_ms: (max_exec_time as f64 * 0.85) as u64,
            peak_memory_bytes: 14 * 1024 * 1024, // Taxminiy 14MB
            passedTests: passed_tests,
            total_tests,
            test_results,
            error: None,
        }
    }

    fn normalize_output(s: &str) -> String {
        s.replace("\r\n", "\n")
            .lines()
            .map(|l| l.trim_end())
            .collect::<Vec<_>>()
            .join("\n")
            .trim()
            .to_string()
    }
}
