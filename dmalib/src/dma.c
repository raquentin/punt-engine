#include "../include/log.h"
#include "../include/pattern.h"
#include <errno.h>
#include <fcntl.h>
#include <stdint.h>
#include <stdio.h>
#include <string.h>
#include <sys/mman.h>
#include <unistd.h>

#define FPGA_DEVICE_PATH "/dev/fpga_dma" // TODO: make this real
#define FPGA_MEM_SIZE 0x10000            // TODO: make this real

static int fpga_fd = -1;
static volatile uint32_t *fpga_mem = NULL;

int fpga_init() {
  fpga_fd = open(FPGA_DEVICE_PATH, O_RDWR | O_SYNC);
  if (fpga_fd < 0) {
    log_message(LOG_LEVEL_ERROR, "Failed to open FPGA device '%s': %s",
                FPGA_DEVICE_PATH, strerror(errno));
    return -1;
  }
  log_message(LOG_LEVEL_INFO, "FPGA device '%s' opened successfully",
              FPGA_DEVICE_PATH);

  fpga_mem =
      mmap(NULL, FPGA_MEM_SIZE, PROT_READ | PROT_WRITE, MAP_SHARED, fpga_fd, 0);
  if (fpga_mem == MAP_FAILED) {
    log_message(LOG_LEVEL_ERROR, "Failed to mmap FPGA memory: %s",
                strerror(errno));
    close(fpga_fd);
    fpga_fd = -1;
    return -1;
  }

  log_message(LOG_LEVEL_INFO, "FPGA memory mapped successfully at %p",
              (void *)fpga_mem);
  return 0;
}

void fpga_cleanup() {
  if (fpga_mem && fpga_mem != MAP_FAILED) {
    munmap((void *)fpga_mem, FPGA_MEM_SIZE);
    log_message(LOG_LEVEL_INFO, "FPGA memory unmapped");
    fpga_mem = NULL;
  }

  if (fpga_fd >= 0) {
    close(fpga_fd);
    log_message(LOG_LEVEL_INFO, "FPGA device '%s' closed", FPGA_DEVICE_PATH);
    fpga_fd = -1;
  }
}

int send_pattern(pattern_t pattern, uint32_t offset) {
  if (!fpga_mem) {
    log_message(LOG_LEVEL_ERROR, "FPGA memory not mapped");
    return -1;
  }

  if (offset >= (FPGA_MEM_SIZE - sizeof(pattern_t))) {
    log_message(LOG_LEVEL_ERROR, "Offset %u out of bounds (max %lu)", offset,
                (FPGA_MEM_SIZE - sizeof(pattern_t)));
    return -1;
  }

  fpga_mem[offset / sizeof(pattern_t)] = pattern;
  __sync_synchronize();

  log_message(LOG_LEVEL_INFO, "Pattern 0x%08X sent to FPGA at offset %u",
              pattern, offset);
  return 0;
}
