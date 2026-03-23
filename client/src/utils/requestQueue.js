/**
 * Request Queue Manager
 * 
 * Handles request queuing during token refresh:
 * - Prevents multiple concurrent 401 refreshes
 * - Queues failed requests and retries with new token
 * - Clears queue on successful refresh or final failure
 * 
 * Usage: Already integrated into api.js interceptor
 */

class RequestQueueManager {
  constructor() {
    this.isRefreshing = false;
    this.failedQueue = [];
  }

  /**
   * Add request to queue
   * @param {Function} onResolved - Callback when token refresh succeeds
   * @param {Function} onRejected - Callback when token refresh fails
   */
  addToQueue(onResolved, onRejected) {
    this.failedQueue.push({
      onResolved,
      onRejected,
    });
  }

  /**
   * Process all queued requests after successful token refresh
   * @param {string} token - New access token
   */
  processQueue(token) {
    this.failedQueue.forEach((prom) => {
      prom.onResolved(token);
    });

    this.resetQueue();
  }

  /**
   * Reject all queued requests on token refresh failure
   * @param {Error} error - Error that occurred during refresh
   */
  rejectQueue(error) {
    this.failedQueue.forEach((prom) => {
      prom.onRejected(error);
    });

    this.resetQueue();
  }

  /**
   * Reset queue state
   */
  resetQueue() {
    this.isRefreshing = false;
    this.failedQueue = [];
  }

  /**
   * Set refreshing state
   */
  setRefreshing(value) {
    this.isRefreshing = value;
  }

  /**
   * Check if currently refreshing
   */
  getIsRefreshing() {
    return this.isRefreshing;
  }

  /**
   * Get queue size
   */
  getQueueSize() {
    return this.failedQueue.length;
  }
}

// Export singleton instance
export const requestQueue = new RequestQueueManager();
