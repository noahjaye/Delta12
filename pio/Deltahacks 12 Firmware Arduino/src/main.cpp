#include <Arduino.h>
#include <rgb_lcd.h>
#include <CurieBLE.h>
#include <EEPROM.h>

#define TOUCH_PIN_MED1 3  // Tylenol
#define TOUCH_PIN_MED2 4  // Vivace (reserved for future use)
#define REFRESH_RATE 60   // in Hz

rgb_lcd lcd;

BLEPeripheral pillBottle;
BLEService counterService("12345678-1280-1280-1280-676767abcdef");
BLECharacteristic commandCharacteristic("12345678-1280-1280-1280-abcdefabcdef", BLEWrite, 1);
BLEUnsignedIntCharacteristic counterCharacteristic("87654321-1280-1280-1280-abcdef676767", BLERead | BLENotify);
unsigned int tylenolCounter = 0;  // First med
unsigned int vivaceCounter = 0;   // Second med

bool touchState = LOW;
bool lastTouchState = LOW;

unsigned long lastRefreshTime = 0;

void setup() {
    lcd.begin(16, 2); // Initialize a 16x2 LCD
    lcd.setRGB(255, 255, 255);
    lcd.print("Initializing...");
    
    // Initialize BLE
    pillBottle.setLocalName("LeBron's Secret Stash");
    pillBottle.setAdvertisedServiceUuid(counterService.uuid());
    pillBottle.addAttribute(counterService);
    pillBottle.addAttribute(counterCharacteristic);
    pillBottle.addAttribute(commandCharacteristic);
    counterCharacteristic.setValue(tylenolCounter);
    pillBottle.begin();
    
    // Initialize touch sensor pins
    pinMode(TOUCH_PIN_MED1, INPUT);
    pinMode(TOUCH_PIN_MED2, INPUT);

    // Initialize Serial for debugging
    Serial.begin(9600);
    Serial.println("Setup complete.");
    
    delay(1000);
    lcd.clear();
    delay(500);
}

void loop() {
    // Regular refresh rate defined in REFRESH_RATE
    if (millis() - lastRefreshTime >= (1000 / REFRESH_RATE)) {
        lastRefreshTime = millis();
        return;
    }

    // Read touch sensor state for Med 1 (Tylenol)
    touchState = digitalRead(TOUCH_PIN_MED1);

    // Display Med 1 (Tylenol) on line 0
    lcd.setCursor(0, 0);
    lcd.print("Tylenol: ");
    lcd.print(tylenolCounter);
    if (tylenolCounter < 10) lcd.print(" "); // Padding for single digit

    // Display Med 2 (Vivace) on line 1
    lcd.setCursor(0, 1);
    lcd.print("Vivace: ");
    lcd.print(vivaceCounter);
    if (vivaceCounter < 10) lcd.print("  "); // Padding for single digit

    if (touchState != lastTouchState) {
        // Touched - only update Tylenol (first med)
        if (touchState == HIGH) {
            tylenolCounter++;
            counterCharacteristic.setValue(tylenolCounter);
            Serial.println("Tylenol doses: " + String(tylenolCounter));
        } 

        lastTouchState = touchState;
    }

    if (commandCharacteristic.written()) {
        uint8_t cmd = commandCharacteristic.value()[0];
        if (cmd == 1) { // Decrement Tylenol
            if (tylenolCounter > 0) tylenolCounter--;
            counterCharacteristic.setValue(tylenolCounter);
        }
        else if (cmd == 2) { // Increment Tylenol
            tylenolCounter++;
            counterCharacteristic.setValue(tylenolCounter);
        }
    }
}