# @snapback-oss/infrastructure

[![npm version](https://badge.fury.io/js/@snapback-oss%2Finfrastructure.svg)](https://www.npmjs.com/package/@snapback-oss/infrastructure)
[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

> Generic logging, metrics, and tracing utilities for Node.js applications

Part of the [SnapBack](https://snapback.dev) open-core ecosystem. This package provides production-ready infrastructure utilities that work with any Node.js application.

## Installation

```bash
npm install @snapback-oss/infrastructure
# or pnpm add @snapback-oss/infrastructure
```

## Features

- 🪵 **Structured Logging** - Pino-based logger with context support
- 📊 **Metrics Collection** - Generic metrics interface
- 🔍 **Distributed Tracing** - OpenTelemetry integration
- ⚡ **Zero Dependencies** (on proprietary code)
- 🔒 **Type-Safe** - Full TypeScript support

## Usage

### Logging

```typescript
import { createLogger } from '@snapback-oss/infrastructure/logging';

const logger = createLogger({
  name: 'my-app',
  level: 'info',
});

logger.info({ userId: '123' }, 'User logged in');
logger.error({ err }, 'Operation failed');
```

### Metrics

```typescript
import { createMetrics } from '@snapback-oss/infrastructure/metrics';

const metrics = createMetrics();

metrics.counter('requests_total').inc();
metrics.gauge('active_users').set(42);
metrics.histogram('request_duration').observe(123);
```

### Tracing

```typescript
import { createTracer } from '@snapback-oss/infrastructure/tracing';

const tracer = createTracer({ serviceName: 'my-service' });

await tracer.span('operation', async (span) => {
  span.setAttribute('user.id', userId);
  // Your code here
});
```

## What's Included

### Public API (OSS)
- ✅ Pino logger configuration
- ✅ Generic metrics interfaces
- ✅ OpenTelemetry tracing
- ✅ Context propagation
- ✅ Error formatting

### Not Included (Proprietary)
- ❌ PostHog analytics integration
- ❌ SnapBack-specific event tracking
- ❌ Proprietary correlation analysis

## Architecture

These infrastructure utilities are **framework-agnostic** and can be used in any Node.js application, not just SnapBack.

```
@snapback-oss/infrastructure (this package)
  ↓ provides
Generic utilities (logging, metrics, tracing)
  ↓ used by
Any Node.js application
```

## API Reference

### Logging

```typescript
// Create logger
const logger = createLogger(options);

// Log levels
logger.trace(obj, msg);
logger.debug(obj, msg);
logger.info(obj, msg);
logger.warn(obj, msg);
logger.error(obj, msg);
logger.fatal(obj, msg);

// Child logger with context
const childLogger = logger.child({ requestId: '123' });
```

### Metrics

```typescript
const metrics = createMetrics();

// Counter
metrics.counter('name', { labels }).inc(value);

// Gauge
metrics.gauge('name', { labels }).set(value);

// Histogram
metrics.histogram('name', { labels }).observe(value);
```

### Tracing

```typescript
const tracer = createTracer(config);

// Create span
await tracer.span('operationName', async (span) => {
  span.setAttribute('key', 'value');
  span.setStatus({ code: SpanStatusCode.OK });
  return result;
});

// Manual span control
const span = tracer.startSpan('name');
// ... do work
span.end();
```

## Configuration

### Environment Variables

```bash
# Logging
LOG_LEVEL=info
LOG_PRETTY=true

# Tracing
OTEL_SERVICE_NAME=my-service
OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4318
```

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for development guidelines.

```bash
# Development
pnpm install
pnpm build
pnpm test
pnpm typecheck
```

## Links

- **Documentation**: [docs.snapback.dev](https://docs.snapback.dev)
- **Main Repository**: [Marcelle-Labs/snapback.dev](https://github.com/Marcelle-Labs/snapback.dev)
- **NPM**: [@snapback-oss/infrastructure](https://www.npmjs.com/package/@snapback-oss/infrastructure)

## Related Packages

- [`@snapback-oss/contracts`](https://github.com/snapback-dev/contracts) - Type definitions
- [`@snapback-oss/sdk`](https://github.com/snapback-dev/sdk) - Client SDK

## License

Apache-2.0 © SnapBack
