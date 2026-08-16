const assert = require('assert');
const { test, describe } = require('node:test');
const TaskQueueWorker = require('../worker.js');

describe('Task Queue Worker Unit Tests', () => {
  test('enqueue adds job to pending queue', () => {
    const worker = new TaskQueueWorker();
    const job = worker.enqueue('send_email', { to: 'test@example.com' });
    assert.strictEqual(job.taskName, 'send_email');
    assert.strictEqual(worker.getStats().pending, 1);
  });

  test('failed jobs route to Dead Letter Queue (DLQ)', async () => {
    const worker = new TaskQueueWorker();
    worker.enqueue('fatal_job', {}, 1);

    await worker.processNext(async () => { throw new Error('Unrecoverable error'); });
    const dlq = worker.getDeadLetterQueue();
    assert.strictEqual(dlq.length, 1);
    assert.strictEqual(dlq[0].status, 'dead_letter');
  });

  test('processNext executes job successfully', async () => {
    const worker = new TaskQueueWorker();
    worker.enqueue('sync_db', { table: 'users' });

    const processed = await worker.processNext(async (job) => {
      assert.strictEqual(job.taskName, 'sync_db');
    });

    assert.strictEqual(processed.status, 'completed');
    assert.strictEqual(worker.getStats().completed, 1);
  });

  test('failed jobs auto-retry up to maxRetries', async () => {
    const worker = new TaskQueueWorker();
    worker.enqueue('unstable_job', {}, 2);

    // First attempt fails -> re-queued
    await worker.processNext(async () => { throw new Error('Network transient error'); });
    assert.strictEqual(worker.getStats().pending, 1);

    // Second attempt fails -> marked failed
    await worker.processNext(async () => { throw new Error('Network transient error'); });
    assert.strictEqual(worker.getStats().failed, 1);
  });
});
