#include <Arduino.h>
#include <rgb_lcd.h>
#include <CurieBLE.h>

#define TOUCH_PIN 3
#define REFRESH_RATE 60 // in Hz

rgb_lcd lcd;

BLEPeripheral pillBottle;
BLEService counterService("12345678-1280-1280-1280-67676deltah0");
BLEUnsignedIntCharacteristic counterCharacteristic("87654321-1280-1280-1280-deltah676767", BLERead | BLENotify);
unsigned int counterValue = 0;

bool touchState = LOW;
bool lastTouchState = LOW;

unsigned long lastRefreshTime = 0;

void setup() {
    lcd.begin(16, 2); // Initialize a 16x2 LCD
    lcd.setRGB(255, 255, 255);
    lcd.print("Hello, World!");
    
    // Initialize BLE
    pillBottle.setLocalName("LeBron's Secret Stash");
    pillBottle.setAdvertisedServiceUuid(counterService.uuid());
    pillBottle.addAttribute(counterService);
    pillBottle.addAttribute(counterCharacteristic);
    counterCharacteristic.setValue(counterValue);
    pillBottle.begin();
    
    // Initialize touch sensor pin
    pinMode(TOUCH_PIN, INPUT);

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

    // Read touch sensor state
    touchState = digitalRead(TOUCH_PIN);

    // Update LCD timer
    lcd.setCursor(0, 0);
    lcd.print(millis());
    lcd.print(" ms");

    if (touchState != lastTouchState) {
        lcd.setCursor(0, 1);

        // Touched
        if (touchState == HIGH) {
            lcd.print("Touched!        ");
            counterValue++;
            counterCharacteristic.setValue(counterValue);
            Serial.println("Counter updated: " + String(counterValue));
        } 
        
        // Released
        else {
            lcd.print("                ");
        }

        lastTouchState = touchState;
    }
}