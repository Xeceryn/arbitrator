# packages/logger

Thin winston wrapper. Use `createLogger(title)` — do not construct a winston
logger directly in an app.

- Always logs to the console (colorized, label = `title`, with metadata).
- With `NODE_ENV=production` it **also** writes a file transport at
  `${process.cwd()}/logs/<title>.log`. The `logs/` dir is gitignored; the file
  path depends on cwd, so run services from their own app directory (the
  Dockerfiles do).
- Level is `info` in production, `debug` otherwise.
- `logger` is a default instance titled `arbitrator`.

Deps: `winston` (`catalog:tools`), `@arbitrator/env-loader`.
