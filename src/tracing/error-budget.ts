import { logger } from "../logging/logger.js";

// Error budget configuration
const ERROR_BUDGET = 0.01; // 1% error rate
const ALERT_THRESHOLD = 0.005; // 0.5% error rate (early warning)

// Error metrics tracking
const errorMetrics = {
	totalRequests: 0,
	errorCount: 0,
	lastAlertTime: 0,
};

// Record a successful request
export function recordSuccess() {
	errorMetrics.totalRequests++;
}

// Record an error
export function recordError() {
	errorMetrics.totalRequests++;
	errorMetrics.errorCount++;
}

// Calculate current error rate
export function getErrorRate() {
	if (errorMetrics.totalRequests === 0) {
		return 0;
	}
	return errorMetrics.errorCount / errorMetrics.totalRequests;
}

export async function checkErrorBudget() {
	const errorRate = getErrorRate();

	// Early warning alert
	if (errorRate > ALERT_THRESHOLD && Date.now() - errorMetrics.lastAlertTime > 60000) {
		logger.warn("Error rate approaching budget threshold", {
			errorRate: `${(errorRate * 100).toFixed(2)}%`,
			threshold: `${(ALERT_THRESHOLD * 100).toFixed(2)}%`,
			errorCount: errorMetrics.errorCount,
			totalRequests: errorMetrics.totalRequests,
		});

		errorMetrics.lastAlertTime = Date.now();
	}

	// Budget exceeded alert
	if (errorRate > ERROR_BUDGET) {
		logger.error("🚨 Error budget exceeded!", {
			errorRate: `${(errorRate * 100).toFixed(2)}%`,
			budget: `${(ERROR_BUDGET * 100).toFixed(2)}%`,
			errorCount: errorMetrics.errorCount,
			totalRequests: errorMetrics.totalRequests,
			recommendation: "Investigate root cause immediately and consider rolling back",
		});

		// In a real implementation, you would send alerts to Slack, email, etc.
		await sendAlert({
			channel: "#alerts",
			message: `🚨 Error budget exceeded! Current error rate: ${(errorRate * 100).toFixed(
				2,
			)}% (Budget: ${(ERROR_BUDGET * 100).toFixed(2)}%)`,
		});
	}
}

// Send alert to monitoring system
async function sendAlert(alert: { channel: string; message: string }) {
	// This would integrate with your alerting system (Slack, PagerDuty, etc.)
	logger.info("Alert sent", alert);

	// Example integration with a webhook
	/*
  try {
    await fetch(process.env.ALERT_WEBHOOK_URL!, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        channel: alert.channel,
        text: alert.message,
      }),
    });
  } catch (error) {
    logger.error("Failed to send alert", { error });
  }
  */
}

// Reset metrics (useful for testing)
export function resetMetrics() {
	errorMetrics.totalRequests = 0;
	errorMetrics.errorCount = 0;
	errorMetrics.lastAlertTime = 0;
}

// Get current metrics
export function getMetrics() {
	return {
		...errorMetrics,
		errorRate: getErrorRate(),
	};
}
