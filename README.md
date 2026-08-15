# ⚙️ Cron Task Queue Worker

[![Build Status](https://github.com/msyahirmahmud/cron-task-worker/actions/workflows/ci.yml/badge.svg)](https://github.com/msyahirmahmud/cron-task-worker/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green)](https://nodejs.org)
[![Tests Passing](https://img.shields.io/badge/Tests-100%25-brightgreen.svg)]()

> Asynchronous Task Queue & Job Worker for running background tasks, webhooks, and cron jobs with concurrency controls and automatic error retry logic.

---

## 🌟 Features

- **⚡ Concurrent Queue Processing**: Configurable job concurrency limits.
- **🔄 Auto-Retry Logic**: Automatic exponential backoff retries for transient job failures.
- **📊 Real-time Stats**: Track pending, running, completed, and failed job counts.

---

## 🚀 Quick Start

```bash
git clone https://github.com/msyahirmahmud/cron-task-worker.git
cd cron-task-worker
npm start
```

Run test suite:
```bash
npm test
```

---

## 📄 License

[MIT License](LICENSE)
