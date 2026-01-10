#include <Arduino.h>
#include <rgb_lcd.h>
#include <CurieBLE.h>

#define TOUCH_PIN 3
#define REFRESH_RATE 60 // in Hz

rgb_lcd lcd;
BLEPeripheral pillBottle;

bool touchState = LOW;
bool lastTouchState = LOW;

unsigned long lastRefreshTime = 0;

void setup() {
    lcd.begin(16, 2); // Initialize a 16x2 LCD
    lcd.setRGB(255, 255, 255);
    lcd.print("Hello, World!");
    
    Serial.begin(9600);
    Serial.println("LCD Initialized");
    
    pinMode(TOUCH_PIN, INPUT);
    
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


        } 
        
        // Released
        else {
            lcd.print("                ");


        }

        lastTouchState = touchState;
    }
}