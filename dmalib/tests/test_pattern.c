#include <stdio.h>
#include <assert.h>
#include "../include/pattern.h"

int main() {
    // test 1: BUY, price=0, quantity=0
    OrderType order_type1 = BUY;
    uint16_t price1 = 0;
    uint16_t quantity1 = 0;
    pattern_t pattern1 = pack_pattern(order_type1, price1, quantity1);

    OrderType unpacked_order_type1;
    uint16_t unpacked_price1;
    uint16_t unpacked_quantity1;
    unpack_pattern(pattern1, &unpacked_order_type1, &unpacked_price1, &unpacked_quantity1);

    assert(unpacked_order_type1 == BUY);
    assert(unpacked_price1 == price1);
    assert(unpacked_quantity1 == quantity1);
    printf("Test Case 1 Passed\n");

    // test 2: SELL, price=65535, quantity=32767
    OrderType order_type2 = SELL;
    uint16_t price2 = 65535;
    uint16_t quantity2 = 32767;
    pattern_t pattern2 = pack_pattern(order_type2, price2, quantity2);

    OrderType unpacked_order_type2;
    uint16_t unpacked_price2;
    uint16_t unpacked_quantity2;
    unpack_pattern(pattern2, &unpacked_order_type2, &unpacked_price2, &unpacked_quantity2);

    assert(unpacked_order_type2 == SELL);
    assert(unpacked_price2 == price2);
    assert(unpacked_quantity2 == quantity2);
    printf("Test Case 2 Passed\n");

    // test 3: BUY, price=12345, quantity=1000
    OrderType order_type3 = BUY;
    uint16_t price3 = 12345;
    uint16_t quantity3 = 1000;
    pattern_t pattern3 = pack_pattern(order_type3, price3, quantity3);

    OrderType unpacked_order_type3;
    uint16_t unpacked_price3;
    uint16_t unpacked_quantity3;
    unpack_pattern(pattern3, &unpacked_order_type3, &unpacked_price3, &unpacked_quantity3);

    assert(unpacked_order_type3 == BUY);
    assert(unpacked_price3 == price3);
    assert(unpacked_quantity3 == quantity3);
    printf("Test Case 3 Passed\n");

    return 0;
}
