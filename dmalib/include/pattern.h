#ifndef PATTERN_H
#define PATTERN_H

#include <stdint.h>

typedef enum { BUY, SELL } OrderType;

typedef uint32_t pattern_t;

#define ORDER_TYPE_SHIFT 31
#define ORDER_TYPE_MASK 0x1U

#define PRICE_SHIFT 15
#define PRICE_MASK 0xFFFFU // 16 bits

#define QUANTITY_SHIFT 0
#define QUANTITY_MASK 0x7FFFU // 15 bits

// pack pattern data into 32bit
static inline pattern_t pack_pattern(OrderType order_type, uint16_t price,
                                     uint16_t quantity) {
  pattern_t pattern = 0;
  pattern |= ((pattern_t)(order_type & ORDER_TYPE_MASK)) << ORDER_TYPE_SHIFT;
  pattern |= ((pattern_t)(price & PRICE_MASK)) << PRICE_SHIFT;
  pattern |= ((pattern_t)(quantity & QUANTITY_MASK)) << QUANTITY_SHIFT;
  return pattern;
}

// unpack pattern from a 32bit
static inline void unpack_pattern(pattern_t pattern, OrderType *order_type,
                                  uint16_t *price, uint16_t *quantity) {
  *order_type = (OrderType)((pattern >> ORDER_TYPE_SHIFT) & ORDER_TYPE_MASK);
  *price = (pattern >> PRICE_SHIFT) & PRICE_MASK;
  *quantity = (pattern >> QUANTITY_SHIFT) & QUANTITY_MASK;
}

#endif
