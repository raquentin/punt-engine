#include "../include/log.h"

static FILE *log_file = NULL;

void log_init() {
  log_file = stderr;
  // could use file as well, console for now
}

void log_cleanup() {
  if (log_file && log_file != stderr) {
    fclose(log_file);
    log_file = NULL;
  }
}

void log_message(LogLevel level, const char *format, ...) {
  if (!log_file) {
    log_file = stderr;
  }

  time_t now = time(NULL);
  char time_buf[64];
  struct tm *tm_info = localtime(&now);
  strftime(time_buf, sizeof(time_buf), "%Y-%m-%d %H:%M:%S", tm_info);

  // log level string
  const char *level_str;
  switch (level) {
  case LOG_LEVEL_INFO:
    level_str = "INFO";
    break;
  case LOG_LEVEL_WARN:
    level_str = "WARN";
    break;
  case LOG_LEVEL_ERROR:
    level_str = "ERROR";
    break;
  default:
    level_str = "UNKNOWN";
  }

  // print timestamp and log level
  fprintf(log_file, "[%s] %s: ", time_buf, level_str);

  // print the actual log message
  va_list args;
  va_start(args, format);
  vfprintf(log_file, format, args);
  va_end(args);

  fprintf(log_file, "\n");
}
