// ../../node_modules/@orpc/shared/dist/index.mjs
function resolveMaybeOptionalOptions(rest) {
  return rest[0] ?? {};
}
function toArray(value) {
  return Array.isArray(value) ? value : value === undefined || value === null ? [] : [value];
}
var ORPC_NAME = "orpc";
var ORPC_SHARED_PACKAGE_NAME = "@orpc/shared";
var ORPC_SHARED_PACKAGE_VERSION = "1.8.5";
function once(fn) {
  let cached;
  return () => {
    if (cached) {
      return cached.result;
    }
    const result = fn();
    cached = { result };
    return result;
  };
}
function sequential(fn) {
  let lastOperationPromise = Promise.resolve();
  return (...args) => {
    return lastOperationPromise = lastOperationPromise.catch(() => {}).then(() => {
      return fn(...args);
    });
  };
}
var SPAN_ERROR_STATUS = 2;
var GLOBAL_OTEL_CONFIG_KEY = `__${ORPC_SHARED_PACKAGE_NAME}@${ORPC_SHARED_PACKAGE_VERSION}/otel/config__`;
function getGlobalOtelConfig() {
  return globalThis[GLOBAL_OTEL_CONFIG_KEY];
}
function startSpan(name, options = {}, context) {
  const tracer = getGlobalOtelConfig()?.tracer;
  return tracer?.startSpan(name, options, context);
}
function setSpanError(span, error, options = {}) {
  if (!span) {
    return;
  }
  const exception = toOtelException(error);
  span.recordException(exception);
  if (!options.signal?.aborted || options.signal.reason !== error) {
    span.setStatus({
      code: SPAN_ERROR_STATUS,
      message: exception.message
    });
  }
}
function toOtelException(error) {
  if (error instanceof Error) {
    const exception = {
      message: error.message,
      name: error.name,
      stack: error.stack
    };
    if ("code" in error && (typeof error.code === "string" || typeof error.code === "number")) {
      exception.code = error.code;
    }
    return exception;
  }
  return { message: String(error) };
}
async function runWithSpan({ name, context, ...options }, fn) {
  const tracer = getGlobalOtelConfig()?.tracer;
  if (!tracer) {
    return fn();
  }
  const callback = async (span) => {
    try {
      return await fn(span);
    } catch (e) {
      setSpanError(span, e, options);
      throw e;
    } finally {
      span.end();
    }
  };
  if (context) {
    return tracer.startActiveSpan(name, options, context, callback);
  } else {
    return tracer.startActiveSpan(name, options, callback);
  }
}
async function runInSpanContext(span, fn) {
  const otelConfig = getGlobalOtelConfig();
  if (!span || !otelConfig) {
    return fn();
  }
  const ctx = otelConfig.trace.setSpan(otelConfig.context.active(), span);
  return otelConfig.context.with(ctx, fn);
}
function isAsyncIteratorObject(maybe) {
  if (!maybe || typeof maybe !== "object") {
    return false;
  }
  return "next" in maybe && typeof maybe.next === "function" && Symbol.asyncIterator in maybe && typeof maybe[Symbol.asyncIterator] === "function";
}
var fallbackAsyncDisposeSymbol = Symbol.for("asyncDispose");
var asyncDisposeSymbol = Symbol.asyncDispose ?? fallbackAsyncDisposeSymbol;

class AsyncIteratorClass {
  #isDone = false;
  #isExecuteComplete = false;
  #cleanup;
  #next;
  constructor(next, cleanup) {
    this.#cleanup = cleanup;
    this.#next = sequential(async () => {
      if (this.#isDone) {
        return { done: true, value: undefined };
      }
      try {
        const result = await next();
        if (result.done) {
          this.#isDone = true;
        }
        return result;
      } catch (err) {
        this.#isDone = true;
        throw err;
      } finally {
        if (this.#isDone && !this.#isExecuteComplete) {
          this.#isExecuteComplete = true;
          await this.#cleanup("next");
        }
      }
    });
  }
  next() {
    return this.#next();
  }
  async return(value) {
    this.#isDone = true;
    if (!this.#isExecuteComplete) {
      this.#isExecuteComplete = true;
      await this.#cleanup("return");
    }
    return { done: true, value };
  }
  async throw(err) {
    this.#isDone = true;
    if (!this.#isExecuteComplete) {
      this.#isExecuteComplete = true;
      await this.#cleanup("throw");
    }
    throw err;
  }
  async[asyncDisposeSymbol]() {
    this.#isDone = true;
    if (!this.#isExecuteComplete) {
      this.#isExecuteComplete = true;
      await this.#cleanup("dispose");
    }
  }
  [Symbol.asyncIterator]() {
    return this;
  }
}
function asyncIteratorWithSpan({ name, ...options }, iterator) {
  let span;
  return new AsyncIteratorClass(async () => {
    span ??= startSpan(name);
    try {
      const result = await runInSpanContext(span, () => iterator.next());
      span?.addEvent(result.done ? "completed" : "yielded");
      return result;
    } catch (err) {
      setSpanError(span, err, options);
      throw err;
    }
  }, async (reason) => {
    try {
      if (reason !== "next") {
        await runInSpanContext(span, () => iterator.return?.());
      }
    } catch (err) {
      setSpanError(span, err, options);
      throw err;
    } finally {
      span?.end();
    }
  });
}

class EventPublisher {
  #listenersMap = /* @__PURE__ */ new Map;
  #maxBufferedEvents;
  constructor(options = {}) {
    this.#maxBufferedEvents = options.maxBufferedEvents ?? 100;
  }
  get size() {
    return this.#listenersMap.size;
  }
  publish(event, payload) {
    const listeners = this.#listenersMap.get(event);
    if (!listeners) {
      return;
    }
    for (const listener of listeners) {
      listener(payload);
    }
  }
  subscribe(event, listenerOrOptions) {
    if (typeof listenerOrOptions === "function") {
      let listeners = this.#listenersMap.get(event);
      if (!listeners) {
        this.#listenersMap.set(event, listeners = /* @__PURE__ */ new Set);
      }
      listeners.add(listenerOrOptions);
      return () => {
        listeners.delete(listenerOrOptions);
        if (listeners.size === 0) {
          this.#listenersMap.delete(event);
        }
      };
    }
    const signal = listenerOrOptions?.signal;
    const maxBufferedEvents = listenerOrOptions?.maxBufferedEvents ?? this.#maxBufferedEvents;
    signal?.throwIfAborted();
    const bufferedEvents = [];
    const pullResolvers = [];
    const unsubscribe = this.subscribe(event, (payload) => {
      const resolver = pullResolvers.shift();
      if (resolver) {
        resolver[0]({ done: false, value: payload });
      } else {
        bufferedEvents.push(payload);
        if (bufferedEvents.length > maxBufferedEvents) {
          bufferedEvents.shift();
        }
      }
    });
    const abortListener = (event2) => {
      unsubscribe();
      pullResolvers.forEach((resolver) => resolver[1](event2.target.reason));
      pullResolvers.length = 0;
      bufferedEvents.length = 0;
    };
    signal?.addEventListener("abort", abortListener, { once: true });
    return new AsyncIteratorClass(async () => {
      if (signal?.aborted) {
        throw signal.reason;
      }
      if (bufferedEvents.length > 0) {
        return { done: false, value: bufferedEvents.shift() };
      }
      return new Promise((resolve, reject) => {
        pullResolvers.push([resolve, reject]);
      });
    }, async () => {
      unsubscribe();
      signal?.removeEventListener("abort", abortListener);
      pullResolvers.forEach((resolver) => resolver[0]({ done: true, value: undefined }));
      pullResolvers.length = 0;
      bufferedEvents.length = 0;
    });
  }
}

class SequentialIdGenerator {
  index = BigInt(0);
  generate() {
    const id = this.index.toString(32);
    this.index++;
    return id;
  }
}
function intercept(interceptors, options, main) {
  const next = (options2, index) => {
    const interceptor = interceptors[index];
    if (!interceptor) {
      return main(options2);
    }
    return interceptor({
      ...options2,
      next: (newOptions = options2) => next(newOptions, index + 1)
    });
  };
  return next(options, 0);
}
function parseEmptyableJSON(text) {
  if (!text) {
    return;
  }
  return JSON.parse(text);
}
function stringifyJSON(value) {
  return JSON.stringify(value);
}
function isObject(value) {
  if (!value || typeof value !== "object") {
    return false;
  }
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || !proto || !proto.constructor;
}
function isTypescriptObject(value) {
  return !!value && (typeof value === "object" || typeof value === "function");
}
function preventNativeAwait(target) {
  return new Proxy(target, {
    get(target2, prop, receiver) {
      const value = Reflect.get(target2, prop, receiver);
      if (prop !== "then" || typeof value !== "function") {
        return value;
      }
      return new Proxy(value, {
        apply(targetFn, thisArg, args) {
          if (args.length !== 2 || args.some((arg) => !isNativeFunction(arg))) {
            return Reflect.apply(targetFn, thisArg, args);
          }
          let shouldOmit = true;
          args[0].call(thisArg, preventNativeAwait(new Proxy(target2, {
            get: (target3, prop2, receiver2) => {
              if (shouldOmit && prop2 === "then") {
                shouldOmit = false;
                return;
              }
              return Reflect.get(target3, prop2, receiver2);
            }
          })));
        }
      });
    }
  });
}
var NATIVE_FUNCTION_REGEX = /^\s*function\s*\(\)\s*\{\s*\[native code\]\s*\}\s*$/;
function isNativeFunction(fn) {
  return typeof fn === "function" && NATIVE_FUNCTION_REGEX.test(fn.toString());
}
function tryDecodeURIComponent(value) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}
function value(value2, ...args) {
  if (typeof value2 === "function") {
    return value2(...args);
  }
  return value2;
}
// ../../node_modules/@orpc/standard-server/dist/index.mjs
class EventEncoderError extends TypeError {
}

class EventDecoderError extends TypeError {
}

class ErrorEvent extends Error {
  data;
  constructor(options) {
    super(options?.message ?? "An error event was received", options);
    this.data = options?.data;
  }
}
function decodeEventMessage(encoded) {
  const lines = encoded.replace(/\n+$/, "").split(/\n/);
  const message = {
    data: undefined,
    event: undefined,
    id: undefined,
    retry: undefined,
    comments: []
  };
  for (const line of lines) {
    const index = line.indexOf(":");
    const key = index === -1 ? line : line.slice(0, index);
    const value2 = index === -1 ? "" : line.slice(index + 1).replace(/^\s/, "");
    if (index === 0) {
      message.comments.push(value2);
    } else if (key === "data") {
      message.data ??= "";
      message.data += `${value2}
`;
    } else if (key === "event") {
      message.event = value2;
    } else if (key === "id") {
      message.id = value2;
    } else if (key === "retry") {
      const maybeInteger = Number.parseInt(value2);
      if (Number.isInteger(maybeInteger) && maybeInteger >= 0 && maybeInteger.toString() === value2) {
        message.retry = maybeInteger;
      }
    }
  }
  message.data = message.data?.replace(/\n$/, "");
  return message;
}

class EventDecoder {
  constructor(options = {}) {
    this.options = options;
  }
  incomplete = "";
  feed(chunk) {
    this.incomplete += chunk;
    const lastCompleteIndex = this.incomplete.lastIndexOf(`

`);
    if (lastCompleteIndex === -1) {
      return;
    }
    const completes = this.incomplete.slice(0, lastCompleteIndex).split(/\n\n/);
    this.incomplete = this.incomplete.slice(lastCompleteIndex + 2);
    for (const encoded of completes) {
      const message = decodeEventMessage(`${encoded}

`);
      if (this.options.onEvent) {
        this.options.onEvent(message);
      }
    }
    this.incomplete = "";
  }
  end() {
    if (this.incomplete) {
      throw new EventDecoderError("Event Iterator ended before complete");
    }
  }
}

class EventDecoderStream extends TransformStream {
  constructor() {
    let decoder;
    super({
      start(controller) {
        decoder = new EventDecoder({
          onEvent: (event) => {
            controller.enqueue(event);
          }
        });
      },
      transform(chunk) {
        decoder.feed(chunk);
      },
      flush() {
        decoder.end();
      }
    });
  }
}
function assertEventId(id) {
  if (id.includes(`
`)) {
    throw new EventEncoderError("Event's id must not contain a newline character");
  }
}
function assertEventName(event) {
  if (event.includes(`
`)) {
    throw new EventEncoderError("Event's event must not contain a newline character");
  }
}
function assertEventRetry(retry) {
  if (!Number.isInteger(retry) || retry < 0) {
    throw new EventEncoderError("Event's retry must be a integer and >= 0");
  }
}
function assertEventComment(comment) {
  if (comment.includes(`
`)) {
    throw new EventEncoderError("Event's comment must not contain a newline character");
  }
}
function encodeEventData(data) {
  const lines = data?.split(/\n/) ?? [];
  let output = "";
  for (const line of lines) {
    output += `data: ${line}
`;
  }
  return output;
}
function encodeEventComments(comments) {
  let output = "";
  for (const comment of comments ?? []) {
    assertEventComment(comment);
    output += `: ${comment}
`;
  }
  return output;
}
function encodeEventMessage(message) {
  let output = "";
  output += encodeEventComments(message.comments);
  if (message.event !== undefined) {
    assertEventName(message.event);
    output += `event: ${message.event}
`;
  }
  if (message.retry !== undefined) {
    assertEventRetry(message.retry);
    output += `retry: ${message.retry}
`;
  }
  if (message.id !== undefined) {
    assertEventId(message.id);
    output += `id: ${message.id}
`;
  }
  output += encodeEventData(message.data);
  output += `
`;
  return output;
}
var EVENT_SOURCE_META_SYMBOL = Symbol("ORPC_EVENT_SOURCE_META");
function withEventMeta(container, meta) {
  if (meta.id !== undefined) {
    assertEventId(meta.id);
  }
  if (meta.retry !== undefined) {
    assertEventRetry(meta.retry);
  }
  if (meta.comments !== undefined) {
    for (const comment of meta.comments) {
      assertEventComment(comment);
    }
  }
  return new Proxy(container, {
    get(target, prop, receiver) {
      if (prop === EVENT_SOURCE_META_SYMBOL) {
        return meta;
      }
      return Reflect.get(target, prop, receiver);
    }
  });
}
function getEventMeta(container) {
  return isTypescriptObject(container) ? Reflect.get(container, EVENT_SOURCE_META_SYMBOL) : undefined;
}
function generateContentDisposition(filename) {
  const escapedFileName = filename.replace(/"/g, "\\\"");
  const encodedFilenameStar = encodeURIComponent(filename).replace(/['()*]/g, (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`).replace(/%(7C|60|5E)/g, (str, hex) => String.fromCharCode(Number.parseInt(hex, 16)));
  return `inline; filename="${escapedFileName}"; filename*=utf-8''${encodedFilenameStar}`;
}
function getFilenameFromContentDisposition(contentDisposition) {
  const encodedFilenameStarMatch = contentDisposition.match(/filename\*=(UTF-8'')?([^;]*)/i);
  if (encodedFilenameStarMatch && typeof encodedFilenameStarMatch[2] === "string") {
    return tryDecodeURIComponent(encodedFilenameStarMatch[2]);
  }
  const encodedFilenameMatch = contentDisposition.match(/filename="((?:\\"|[^"])*)"/i);
  if (encodedFilenameMatch && typeof encodedFilenameMatch[1] === "string") {
    return encodedFilenameMatch[1].replace(/\\"/g, '"');
  }
}
function mergeStandardHeaders(a, b) {
  const merged = { ...a };
  for (const key in b) {
    if (Array.isArray(b[key])) {
      merged[key] = [...toArray(merged[key]), ...b[key]];
    } else if (b[key] !== undefined) {
      if (Array.isArray(merged[key])) {
        merged[key] = [...merged[key], b[key]];
      } else if (merged[key] !== undefined) {
        merged[key] = [merged[key], b[key]];
      } else {
        merged[key] = b[key];
      }
    }
  }
  return merged;
}

// ../../node_modules/@orpc/client/dist/shared/client.txdq_i5V.mjs
var COMMON_ORPC_ERROR_DEFS = {
  BAD_REQUEST: {
    status: 400,
    message: "Bad Request"
  },
  UNAUTHORIZED: {
    status: 401,
    message: "Unauthorized"
  },
  FORBIDDEN: {
    status: 403,
    message: "Forbidden"
  },
  NOT_FOUND: {
    status: 404,
    message: "Not Found"
  },
  METHOD_NOT_SUPPORTED: {
    status: 405,
    message: "Method Not Supported"
  },
  NOT_ACCEPTABLE: {
    status: 406,
    message: "Not Acceptable"
  },
  TIMEOUT: {
    status: 408,
    message: "Request Timeout"
  },
  CONFLICT: {
    status: 409,
    message: "Conflict"
  },
  PRECONDITION_FAILED: {
    status: 412,
    message: "Precondition Failed"
  },
  PAYLOAD_TOO_LARGE: {
    status: 413,
    message: "Payload Too Large"
  },
  UNSUPPORTED_MEDIA_TYPE: {
    status: 415,
    message: "Unsupported Media Type"
  },
  UNPROCESSABLE_CONTENT: {
    status: 422,
    message: "Unprocessable Content"
  },
  TOO_MANY_REQUESTS: {
    status: 429,
    message: "Too Many Requests"
  },
  CLIENT_CLOSED_REQUEST: {
    status: 499,
    message: "Client Closed Request"
  },
  INTERNAL_SERVER_ERROR: {
    status: 500,
    message: "Internal Server Error"
  },
  NOT_IMPLEMENTED: {
    status: 501,
    message: "Not Implemented"
  },
  BAD_GATEWAY: {
    status: 502,
    message: "Bad Gateway"
  },
  SERVICE_UNAVAILABLE: {
    status: 503,
    message: "Service Unavailable"
  },
  GATEWAY_TIMEOUT: {
    status: 504,
    message: "Gateway Timeout"
  }
};
function fallbackORPCErrorStatus(code, status) {
  return status ?? COMMON_ORPC_ERROR_DEFS[code]?.status ?? 500;
}
function fallbackORPCErrorMessage(code, message) {
  return message || COMMON_ORPC_ERROR_DEFS[code]?.message || code;
}

class ORPCError extends Error {
  defined;
  code;
  status;
  data;
  constructor(code, ...rest) {
    const options = resolveMaybeOptionalOptions(rest);
    if (options.status !== undefined && !isORPCErrorStatus(options.status)) {
      throw new Error("[ORPCError] Invalid error status code.");
    }
    const message = fallbackORPCErrorMessage(code, options.message);
    super(message, options);
    this.code = code;
    this.status = fallbackORPCErrorStatus(code, options.status);
    this.defined = options.defined ?? false;
    this.data = options.data;
  }
  toJSON() {
    return {
      defined: this.defined,
      code: this.code,
      status: this.status,
      message: this.message,
      data: this.data
    };
  }
}
function isDefinedError(error) {
  return error instanceof ORPCError && error.defined;
}
function toORPCError(error) {
  return error instanceof ORPCError ? error : new ORPCError("INTERNAL_SERVER_ERROR", {
    message: "Internal server error",
    cause: error
  });
}
function isORPCErrorStatus(status) {
  return status < 200 || status >= 400;
}
function isORPCErrorJson(json) {
  if (!isObject(json)) {
    return false;
  }
  const validKeys = ["defined", "code", "status", "message", "data"];
  if (Object.keys(json).some((k) => !validKeys.includes(k))) {
    return false;
  }
  return "defined" in json && typeof json.defined === "boolean" && "code" in json && typeof json.code === "string" && "status" in json && typeof json.status === "number" && isORPCErrorStatus(json.status) && "message" in json && typeof json.message === "string";
}
function createORPCErrorFromJson(json, options = {}) {
  return new ORPCError(json.code, {
    ...options,
    ...json
  });
}
function mapEventIterator(iterator, maps) {
  const mapError = async (error) => {
    let mappedError = await maps.error(error);
    if (mappedError !== error) {
      const meta = getEventMeta(error);
      if (meta && isTypescriptObject(mappedError)) {
        mappedError = withEventMeta(mappedError, meta);
      }
    }
    return mappedError;
  };
  return new AsyncIteratorClass(async () => {
    const { done, value: value2 } = await (async () => {
      try {
        return await iterator.next();
      } catch (error) {
        throw await mapError(error);
      }
    })();
    let mappedValue = await maps.value(value2, done);
    if (mappedValue !== value2) {
      const meta = getEventMeta(value2);
      if (meta && isTypescriptObject(mappedValue)) {
        mappedValue = withEventMeta(mappedValue, meta);
      }
    }
    return { done, value: mappedValue };
  }, async () => {
    try {
      await iterator.return?.();
    } catch (error) {
      throw await mapError(error);
    }
  });
}

// ../../node_modules/@orpc/client/dist/index.mjs
async function safe(promise) {
  try {
    const output = await promise;
    return Object.assign([null, output, false, true], { error: null, data: output, isDefined: false, isSuccess: true });
  } catch (e) {
    const error = e;
    if (isDefinedError(error)) {
      return Object.assign([error, undefined, true, false], { error, data: undefined, isDefined: true, isSuccess: false });
    }
    return Object.assign([error, undefined, false, false], { error, data: undefined, isDefined: false, isSuccess: false });
  }
}
function resolveFriendlyClientOptions(options) {
  return {
    ...options,
    context: options.context ?? {}
  };
}
function createORPCClient(link, options = {}) {
  const path = options.path ?? [];
  const procedureClient = async (...[input, options2 = {}]) => {
    return await link.call(path, input, resolveFriendlyClientOptions(options2));
  };
  const recursive = new Proxy(procedureClient, {
    get(target, key) {
      if (typeof key !== "string") {
        return Reflect.get(target, key);
      }
      return createORPCClient(link, {
        ...options,
        path: [...path, key]
      });
    }
  });
  return preventNativeAwait(recursive);
}
function createSafeClient(client) {
  const proxy = new Proxy((...args) => safe(client(...args)), {
    get(_, prop, receiver) {
      const value2 = Reflect.get(client, prop, receiver);
      if (typeof prop !== "string") {
        return value2;
      }
      if (!isTypescriptObject(value2)) {
        return value2;
      }
      return createSafeClient(value2);
    }
  });
  return proxy;
}

// ../../node_modules/@orpc/standard-server-fetch/dist/index.mjs
function toEventIterator(stream, options = {}) {
  const eventStream = stream?.pipeThrough(new TextDecoderStream).pipeThrough(new EventDecoderStream);
  const reader = eventStream?.getReader();
  let span;
  return new AsyncIteratorClass(async () => {
    span ??= startSpan("consume_event_iterator_stream");
    try {
      while (true) {
        if (reader === undefined) {
          return { done: true, value: undefined };
        }
        const { done, value: value2 } = await runInSpanContext(span, () => reader.read());
        if (done) {
          return { done: true, value: undefined };
        }
        switch (value2.event) {
          case "message": {
            let message = parseEmptyableJSON(value2.data);
            if (isTypescriptObject(message)) {
              message = withEventMeta(message, value2);
            }
            span?.addEvent("message");
            return { done: false, value: message };
          }
          case "error": {
            let error = new ErrorEvent({
              data: parseEmptyableJSON(value2.data)
            });
            error = withEventMeta(error, value2);
            span?.addEvent("error");
            throw error;
          }
          case "done": {
            let done2 = parseEmptyableJSON(value2.data);
            if (isTypescriptObject(done2)) {
              done2 = withEventMeta(done2, value2);
            }
            span?.addEvent("done");
            return { done: true, value: done2 };
          }
          default: {
            span?.addEvent("maybe_keepalive");
          }
        }
      }
    } catch (e) {
      if (!(e instanceof ErrorEvent)) {
        setSpanError(span, e, options);
      }
      throw e;
    }
  }, async (reason) => {
    try {
      if (reason !== "next") {
        span?.addEvent("cancelled");
      }
      await runInSpanContext(span, () => reader?.cancel());
    } catch (e) {
      setSpanError(span, e, options);
      throw e;
    } finally {
      span?.end();
    }
  });
}
function toEventStream(iterator, options = {}) {
  const keepAliveEnabled = options.eventIteratorKeepAliveEnabled ?? true;
  const keepAliveInterval = options.eventIteratorKeepAliveInterval ?? 5000;
  const keepAliveComment = options.eventIteratorKeepAliveComment ?? "";
  let cancelled = false;
  let timeout;
  let span;
  const stream = new ReadableStream({
    start() {
      span = startSpan("stream_event_iterator");
    },
    async pull(controller) {
      try {
        if (keepAliveEnabled) {
          timeout = setInterval(() => {
            controller.enqueue(encodeEventMessage({
              comments: [keepAliveComment]
            }));
            span?.addEvent("keepalive");
          }, keepAliveInterval);
        }
        const value2 = await runInSpanContext(span, () => iterator.next());
        clearInterval(timeout);
        if (cancelled) {
          return;
        }
        const meta = getEventMeta(value2.value);
        if (!value2.done || value2.value !== undefined || meta !== undefined) {
          const event = value2.done ? "done" : "message";
          controller.enqueue(encodeEventMessage({
            ...meta,
            event,
            data: stringifyJSON(value2.value)
          }));
          span?.addEvent(event);
        }
        if (value2.done) {
          controller.close();
          span?.end();
        }
      } catch (err) {
        clearInterval(timeout);
        if (cancelled) {
          return;
        }
        if (err instanceof ErrorEvent) {
          controller.enqueue(encodeEventMessage({
            ...getEventMeta(err),
            event: "error",
            data: stringifyJSON(err.data)
          }));
          span?.addEvent("error");
          controller.close();
        } else {
          setSpanError(span, err);
          controller.error(err);
        }
        span?.end();
      }
    },
    async cancel() {
      try {
        cancelled = true;
        clearInterval(timeout);
        span?.addEvent("cancelled");
        await runInSpanContext(span, () => iterator.return?.());
      } catch (e) {
        setSpanError(span, e);
        throw e;
      } finally {
        span?.end();
      }
    }
  }).pipeThrough(new TextEncoderStream);
  return stream;
}
function toStandardBody(re, options = {}) {
  return runWithSpan({ name: "parse_standard_body", signal: options.signal }, async () => {
    const contentDisposition = re.headers.get("content-disposition");
    if (typeof contentDisposition === "string") {
      const fileName = getFilenameFromContentDisposition(contentDisposition) ?? "blob";
      const blob2 = await re.blob();
      return new File([blob2], fileName, {
        type: blob2.type
      });
    }
    const contentType = re.headers.get("content-type");
    if (!contentType || contentType.startsWith("application/json")) {
      const text = await re.text();
      return parseEmptyableJSON(text);
    }
    if (contentType.startsWith("multipart/form-data")) {
      return await re.formData();
    }
    if (contentType.startsWith("application/x-www-form-urlencoded")) {
      const text = await re.text();
      return new URLSearchParams(text);
    }
    if (contentType.startsWith("text/event-stream")) {
      return toEventIterator(re.body, options);
    }
    if (contentType.startsWith("text/plain")) {
      return await re.text();
    }
    const blob = await re.blob();
    return new File([blob], "blob", {
      type: blob.type
    });
  });
}
function toFetchBody(body, headers, options = {}) {
  const currentContentDisposition = headers.get("content-disposition");
  headers.delete("content-type");
  headers.delete("content-disposition");
  if (body === undefined) {
    return;
  }
  if (body instanceof Blob) {
    headers.set("content-type", body.type);
    headers.set("content-length", body.size.toString());
    headers.set("content-disposition", currentContentDisposition ?? generateContentDisposition(body instanceof File ? body.name : "blob"));
    return body;
  }
  if (body instanceof FormData) {
    return body;
  }
  if (body instanceof URLSearchParams) {
    return body;
  }
  if (isAsyncIteratorObject(body)) {
    headers.set("content-type", "text/event-stream");
    return toEventStream(body, options);
  }
  headers.set("content-type", "application/json");
  return stringifyJSON(body);
}
function toStandardHeaders(headers, standardHeaders = {}) {
  for (const [key, value2] of headers) {
    if (Array.isArray(standardHeaders[key])) {
      standardHeaders[key].push(value2);
    } else if (standardHeaders[key] !== undefined) {
      standardHeaders[key] = [standardHeaders[key], value2];
    } else {
      standardHeaders[key] = value2;
    }
  }
  return standardHeaders;
}
function toFetchHeaders(headers, fetchHeaders = new Headers) {
  for (const [key, value2] of Object.entries(headers)) {
    if (Array.isArray(value2)) {
      for (const v of value2) {
        fetchHeaders.append(key, v);
      }
    } else if (value2 !== undefined) {
      fetchHeaders.append(key, value2);
    }
  }
  return fetchHeaders;
}
function toFetchRequest(request, options = {}) {
  const headers = toFetchHeaders(request.headers);
  const body = toFetchBody(request.body, headers, options);
  return new Request(request.url, {
    signal: request.signal,
    method: request.method,
    headers,
    body
  });
}
function toStandardLazyResponse(response, options = {}) {
  return {
    body: once(() => toStandardBody(response, options)),
    status: response.status,
    get headers() {
      const headers = toStandardHeaders(response.headers);
      Object.defineProperty(this, "headers", { value: headers, writable: true });
      return headers;
    },
    set headers(value2) {
      Object.defineProperty(this, "headers", { value: value2, writable: true });
    }
  };
}

// ../../node_modules/@orpc/client/dist/shared/client.DKmRtVO2.mjs
class CompositeStandardLinkPlugin {
  plugins;
  constructor(plugins = []) {
    this.plugins = [...plugins].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }
  init(options) {
    for (const plugin of this.plugins) {
      plugin.init?.(options);
    }
  }
}

class StandardLink {
  constructor(codec, sender, options = {}) {
    this.codec = codec;
    this.sender = sender;
    const plugin = new CompositeStandardLinkPlugin(options.plugins);
    plugin.init(options);
    this.interceptors = toArray(options.interceptors);
    this.clientInterceptors = toArray(options.clientInterceptors);
  }
  interceptors;
  clientInterceptors;
  call(path, input, options) {
    return runWithSpan({ name: `${ORPC_NAME}.${path.join("/")}`, signal: options.signal }, (span) => {
      span?.setAttribute("rpc.system", ORPC_NAME);
      span?.setAttribute("rpc.method", path.join("."));
      if (isAsyncIteratorObject(input)) {
        input = asyncIteratorWithSpan({ name: "consume_event_iterator_input", signal: options.signal }, input);
      }
      return intercept(this.interceptors, { ...options, path, input }, async ({ path: path2, input: input2, ...options2 }) => {
        const otelConfig = getGlobalOtelConfig();
        let otelContext;
        const currentSpan = otelConfig?.trace.getActiveSpan() ?? span;
        if (currentSpan && otelConfig) {
          otelContext = otelConfig?.trace.setSpan(otelConfig.context.active(), currentSpan);
        }
        const request = await runWithSpan({ name: "encode_request", context: otelContext }, () => this.codec.encode(path2, input2, options2));
        const response = await intercept(this.clientInterceptors, { ...options2, input: input2, path: path2, request }, ({ input: input3, path: path3, request: request2, ...options3 }) => {
          return runWithSpan({ name: "send_request", signal: options3.signal, context: otelContext }, () => this.sender.call(request2, options3, path3, input3));
        });
        const output = await runWithSpan({ name: "decode_response", context: otelContext }, () => this.codec.decode(response, options2, path2, input2));
        if (isAsyncIteratorObject(output)) {
          return asyncIteratorWithSpan({ name: "consume_event_iterator_output", signal: options2.signal }, output);
        }
        return output;
      });
    });
  }
}
var STANDARD_RPC_JSON_SERIALIZER_BUILT_IN_TYPES = {
  BIGINT: 0,
  DATE: 1,
  NAN: 2,
  UNDEFINED: 3,
  URL: 4,
  REGEXP: 5,
  SET: 6,
  MAP: 7
};

class StandardRPCJsonSerializer {
  customSerializers;
  constructor(options = {}) {
    this.customSerializers = options.customJsonSerializers ?? [];
    if (this.customSerializers.length !== new Set(this.customSerializers.map((custom) => custom.type)).size) {
      throw new Error("Custom serializer type must be unique.");
    }
  }
  serialize(data, segments = [], meta = [], maps = [], blobs = []) {
    for (const custom of this.customSerializers) {
      if (custom.condition(data)) {
        const result = this.serialize(custom.serialize(data), segments, meta, maps, blobs);
        meta.push([custom.type, ...segments]);
        return result;
      }
    }
    if (data instanceof Blob) {
      maps.push(segments);
      blobs.push(data);
      return [data, meta, maps, blobs];
    }
    if (typeof data === "bigint") {
      meta.push([STANDARD_RPC_JSON_SERIALIZER_BUILT_IN_TYPES.BIGINT, ...segments]);
      return [data.toString(), meta, maps, blobs];
    }
    if (data instanceof Date) {
      meta.push([STANDARD_RPC_JSON_SERIALIZER_BUILT_IN_TYPES.DATE, ...segments]);
      if (Number.isNaN(data.getTime())) {
        return [null, meta, maps, blobs];
      }
      return [data.toISOString(), meta, maps, blobs];
    }
    if (Number.isNaN(data)) {
      meta.push([STANDARD_RPC_JSON_SERIALIZER_BUILT_IN_TYPES.NAN, ...segments]);
      return [null, meta, maps, blobs];
    }
    if (data instanceof URL) {
      meta.push([STANDARD_RPC_JSON_SERIALIZER_BUILT_IN_TYPES.URL, ...segments]);
      return [data.toString(), meta, maps, blobs];
    }
    if (data instanceof RegExp) {
      meta.push([STANDARD_RPC_JSON_SERIALIZER_BUILT_IN_TYPES.REGEXP, ...segments]);
      return [data.toString(), meta, maps, blobs];
    }
    if (data instanceof Set) {
      const result = this.serialize(Array.from(data), segments, meta, maps, blobs);
      meta.push([STANDARD_RPC_JSON_SERIALIZER_BUILT_IN_TYPES.SET, ...segments]);
      return result;
    }
    if (data instanceof Map) {
      const result = this.serialize(Array.from(data.entries()), segments, meta, maps, blobs);
      meta.push([STANDARD_RPC_JSON_SERIALIZER_BUILT_IN_TYPES.MAP, ...segments]);
      return result;
    }
    if (Array.isArray(data)) {
      const json = data.map((v, i) => {
        if (v === undefined) {
          meta.push([STANDARD_RPC_JSON_SERIALIZER_BUILT_IN_TYPES.UNDEFINED, ...segments, i]);
          return v;
        }
        return this.serialize(v, [...segments, i], meta, maps, blobs)[0];
      });
      return [json, meta, maps, blobs];
    }
    if (isObject(data)) {
      const json = {};
      for (const k in data) {
        if (k === "toJSON" && typeof data[k] === "function") {
          continue;
        }
        json[k] = this.serialize(data[k], [...segments, k], meta, maps, blobs)[0];
      }
      return [json, meta, maps, blobs];
    }
    return [data, meta, maps, blobs];
  }
  deserialize(json, meta, maps, getBlob) {
    const ref = { data: json };
    if (maps && getBlob) {
      maps.forEach((segments, i) => {
        let currentRef = ref;
        let preSegment = "data";
        segments.forEach((segment) => {
          currentRef = currentRef[preSegment];
          preSegment = segment;
        });
        currentRef[preSegment] = getBlob(i);
      });
    }
    for (const item of meta) {
      const type = item[0];
      let currentRef = ref;
      let preSegment = "data";
      for (let i = 1;i < item.length; i++) {
        currentRef = currentRef[preSegment];
        preSegment = item[i];
      }
      for (const custom of this.customSerializers) {
        if (custom.type === type) {
          currentRef[preSegment] = custom.deserialize(currentRef[preSegment]);
          break;
        }
      }
      switch (type) {
        case STANDARD_RPC_JSON_SERIALIZER_BUILT_IN_TYPES.BIGINT:
          currentRef[preSegment] = BigInt(currentRef[preSegment]);
          break;
        case STANDARD_RPC_JSON_SERIALIZER_BUILT_IN_TYPES.DATE:
          currentRef[preSegment] = new Date(currentRef[preSegment] ?? "Invalid Date");
          break;
        case STANDARD_RPC_JSON_SERIALIZER_BUILT_IN_TYPES.NAN:
          currentRef[preSegment] = Number.NaN;
          break;
        case STANDARD_RPC_JSON_SERIALIZER_BUILT_IN_TYPES.UNDEFINED:
          currentRef[preSegment] = undefined;
          break;
        case STANDARD_RPC_JSON_SERIALIZER_BUILT_IN_TYPES.URL:
          currentRef[preSegment] = new URL(currentRef[preSegment]);
          break;
        case STANDARD_RPC_JSON_SERIALIZER_BUILT_IN_TYPES.REGEXP: {
          const [, pattern, flags] = currentRef[preSegment].match(/^\/(.*)\/([a-z]*)$/);
          currentRef[preSegment] = new RegExp(pattern, flags);
          break;
        }
        case STANDARD_RPC_JSON_SERIALIZER_BUILT_IN_TYPES.SET:
          currentRef[preSegment] = new Set(currentRef[preSegment]);
          break;
        case STANDARD_RPC_JSON_SERIALIZER_BUILT_IN_TYPES.MAP:
          currentRef[preSegment] = new Map(currentRef[preSegment]);
          break;
      }
    }
    return ref.data;
  }
}
function toHttpPath(path) {
  return `/${path.map(encodeURIComponent).join("/")}`;
}
function getMalformedResponseErrorCode(status) {
  return Object.entries(COMMON_ORPC_ERROR_DEFS).find(([, def]) => def.status === status)?.[0] ?? "MALFORMED_ORPC_ERROR_RESPONSE";
}

class StandardRPCLinkCodec {
  constructor(serializer, options) {
    this.serializer = serializer;
    this.baseUrl = options.url;
    this.maxUrlLength = options.maxUrlLength ?? 2083;
    this.fallbackMethod = options.fallbackMethod ?? "POST";
    this.expectedMethod = options.method ?? this.fallbackMethod;
    this.headers = options.headers ?? {};
  }
  baseUrl;
  maxUrlLength;
  fallbackMethod;
  expectedMethod;
  headers;
  async encode(path, input, options) {
    const expectedMethod = await value(this.expectedMethod, options, path, input);
    let headers = await value(this.headers, options, path, input);
    const baseUrl = await value(this.baseUrl, options, path, input);
    const url = new URL(baseUrl);
    url.pathname = `${url.pathname.replace(/\/$/, "")}${toHttpPath(path)}`;
    if (options.lastEventId !== undefined) {
      headers = mergeStandardHeaders(headers, { "last-event-id": options.lastEventId });
    }
    const serialized = this.serializer.serialize(input);
    if (expectedMethod === "GET" && !(serialized instanceof FormData) && !isAsyncIteratorObject(serialized)) {
      const maxUrlLength = await value(this.maxUrlLength, options, path, input);
      const getUrl = new URL(url);
      getUrl.searchParams.append("data", stringifyJSON(serialized));
      if (getUrl.toString().length <= maxUrlLength) {
        return {
          body: undefined,
          method: expectedMethod,
          headers,
          url: getUrl,
          signal: options.signal
        };
      }
    }
    return {
      url,
      method: expectedMethod === "GET" ? this.fallbackMethod : expectedMethod,
      headers,
      body: serialized,
      signal: options.signal
    };
  }
  async decode(response) {
    const isOk = !isORPCErrorStatus(response.status);
    const deserialized = await (async () => {
      let isBodyOk = false;
      try {
        const body = await response.body();
        isBodyOk = true;
        return this.serializer.deserialize(body);
      } catch (error) {
        if (!isBodyOk) {
          throw new Error("Cannot parse response body, please check the response body and content-type.", {
            cause: error
          });
        }
        throw new Error("Invalid RPC response format.", {
          cause: error
        });
      }
    })();
    if (!isOk) {
      if (isORPCErrorJson(deserialized)) {
        throw createORPCErrorFromJson(deserialized);
      }
      throw new ORPCError(getMalformedResponseErrorCode(response.status), {
        status: response.status,
        data: { ...response, body: deserialized }
      });
    }
    return deserialized;
  }
}

class StandardRPCSerializer {
  constructor(jsonSerializer) {
    this.jsonSerializer = jsonSerializer;
  }
  serialize(data) {
    if (isAsyncIteratorObject(data)) {
      return mapEventIterator(data, {
        value: async (value2) => this.#serialize(value2, false),
        error: async (e) => {
          return new ErrorEvent({
            data: this.#serialize(toORPCError(e).toJSON(), false),
            cause: e
          });
        }
      });
    }
    return this.#serialize(data, true);
  }
  #serialize(data, enableFormData) {
    const [json, meta_, maps, blobs] = this.jsonSerializer.serialize(data);
    const meta = meta_.length === 0 ? undefined : meta_;
    if (!enableFormData || blobs.length === 0) {
      return {
        json,
        meta
      };
    }
    const form = new FormData;
    form.set("data", stringifyJSON({ json, meta, maps }));
    blobs.forEach((blob, i) => {
      form.set(i.toString(), blob);
    });
    return form;
  }
  deserialize(data) {
    if (isAsyncIteratorObject(data)) {
      return mapEventIterator(data, {
        value: async (value2) => this.#deserialize(value2),
        error: async (e) => {
          if (!(e instanceof ErrorEvent)) {
            return e;
          }
          const deserialized = this.#deserialize(e.data);
          if (isORPCErrorJson(deserialized)) {
            return createORPCErrorFromJson(deserialized, { cause: e });
          }
          return new ErrorEvent({
            data: deserialized,
            cause: e
          });
        }
      });
    }
    return this.#deserialize(data);
  }
  #deserialize(data) {
    if (data === undefined) {
      return;
    }
    if (!(data instanceof FormData)) {
      return this.jsonSerializer.deserialize(data.json, data.meta ?? []);
    }
    const serialized = JSON.parse(data.get("data"));
    return this.jsonSerializer.deserialize(serialized.json, serialized.meta ?? [], serialized.maps, (i) => data.get(i.toString()));
  }
}

class StandardRPCLink extends StandardLink {
  constructor(linkClient, options) {
    const jsonSerializer = new StandardRPCJsonSerializer(options);
    const serializer = new StandardRPCSerializer(jsonSerializer);
    const linkCodec = new StandardRPCLinkCodec(serializer, options);
    super(linkCodec, linkClient, options);
  }
}

// ../../node_modules/@orpc/client/dist/adapters/fetch/index.mjs
class CompositeLinkFetchPlugin extends CompositeStandardLinkPlugin {
  initRuntimeAdapter(options) {
    for (const plugin of this.plugins) {
      plugin.initRuntimeAdapter?.(options);
    }
  }
}

class LinkFetchClient {
  fetch;
  toFetchRequestOptions;
  adapterInterceptors;
  constructor(options) {
    const plugin = new CompositeLinkFetchPlugin(options.plugins);
    plugin.initRuntimeAdapter(options);
    this.fetch = options.fetch ?? globalThis.fetch.bind(globalThis);
    this.toFetchRequestOptions = options;
    this.adapterInterceptors = toArray(options.adapterInterceptors);
  }
  async call(standardRequest, options, path, input) {
    const request = toFetchRequest(standardRequest, this.toFetchRequestOptions);
    const fetchResponse = await intercept(this.adapterInterceptors, { ...options, request, path, input, init: { redirect: "manual" } }, ({ request: request2, path: path2, input: input2, init, ...options2 }) => this.fetch(request2, init, options2, path2, input2));
    const lazyResponse = toStandardLazyResponse(fetchResponse, { signal: request.signal });
    return lazyResponse;
  }
}

class RPCLink extends StandardRPCLink {
  constructor(options) {
    const linkClient = new LinkFetchClient(options);
    super(linkClient, options);
  }
}

// assets/lister.ts
var link = new RPCLink({
  url: "http://localhost:3000"
});
var listerUnsafeClient = createORPCClient(link);
var listerClient = createSafeClient(listerUnsafeClient);
var idButton = document.getElementById("test");
idButton?.addEventListener("click", async () => {
  const result = await listerClient.exchange.list();
  console.log(result);
});
export {
  listerClient
};
