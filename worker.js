/**
 * Async Task Queue Worker & Retry Scheduler
 */

class TaskQueueWorker {
  constructor(concurrency = 2) {
    this.concurrency = concurrency;
    this.queue = [];
    this.completed = [];
    this.failed = [];
    this.dlq = []; // Dead Letter Queue
    this.running = 0;
  }

  enqueue(taskName, payload, maxRetries = 3) {
    const job = {
      id: `job-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      taskName,
      payload,
      status: 'pending',
      retries: 0,
      maxRetries,
      createdAt: new Date().toISOString()
    };
    this.queue.push(job);
    return job;
  }

  async processNext(handler) {
    if (this.queue.length === 0 || this.running >= this.concurrency) {
      return null;
    }

    const job = this.queue.shift();
    job.status = 'running';
    this.running++;

    try {
      await handler(job);
      job.status = 'completed';
      job.completedAt = new Date().toISOString();
      this.completed.push(job);
    } catch (err) {
      job.retries++;
      if (job.retries < job.maxRetries) {
        job.status = 'pending';
        this.queue.push(job); // re-queue for retry
      } else {
        job.status = 'dead_letter';
        job.error = err.message;
        job.failedAt = new Date().toISOString();
        this.failed.push(job);
        this.dlq.push(job); // Move to Dead Letter Queue
      }
    } finally {
      this.running--;
    }

    return job;
  }

  getDeadLetterQueue() {
    return this.dlq;
  }

  getStats() {
    return {
      pending: this.queue.length,
      running: this.running,
      completed: this.completed.length,
      failed: this.failed.length,
      deadLetter: this.dlq.length
    };
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = TaskQueueWorker;
}
