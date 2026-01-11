#include <Arduino.h>
#include <CurieBLE.h>
#include <Wire.h>
#include <rgb_lcd.h>

#define REFRESH_RATE 50
#define DAY_LENGTH 30000 // 30s for testing
#define MAX_DRUGS 2      // LIMITED by LCD + BLE payload

rgb_lcd lcd;

/* ---------- DRUG MODEL ---------- */

struct Drug {
  const char *name;
  uint8_t touchPin;
  uint8_t dailyLimit;
  uint32_t counter;
};

Drug drugs[MAX_DRUGS] = {{"Tylenol", 3, 1, 0}, {"Vivace", 4, 3, 0}};

bool touchStates[MAX_DRUGS];
bool lastTouchStates[MAX_DRUGS];

/* ---------- BLE ---------- */

BLEPeripheral pillBottle;
BLEService counterService("12345678-1280-1280-1280-676767abcdef");

/*
  4 bytes per drug counter
  MAX_DRUGS * 4 bytes
*/
BLECharacteristic counterCharacteristic("87654321-1280-1280-1280-abcdef676767",
                                        BLERead | BLENotify, MAX_DRUGS * 4);

/* ---------- TIMING ---------- */

unsigned long lastRefreshTime = 0;
unsigned long lastResetTime = 0;

/* ---------- HELPERS ---------- */

void updateBleCounters() {
  uint8_t payload[MAX_DRUGS * 4];

  for (int i = 0; i < MAX_DRUGS; i++) {
    memcpy(&payload[i * 4], &drugs[i].counter, 4);
  }

  counterCharacteristic.setValue(payload, sizeof(payload));
}

void flashWhite(int times = 3, int onMs = 100, int offMs = 100) {
  for (int i = 0; i < times; i++) {
    lcd.setRGB(255, 255, 255);
    delay(onMs);
    lcd.setRGB(0, 0, 0);
    delay(offMs);
  }
  lcd.setRGB(255, 255, 255);
}

/* ---------- SETUP ---------- */

void setup() {
  lcd.begin(16, 2);
  lcd.print("Initializing...");

  pillBottle.setLocalName("Smart Pill Bottle");
  pillBottle.setAdvertisedServiceUuid(counterService.uuid());
  pillBottle.addAttribute(counterService);
  pillBottle.addAttribute(counterCharacteristic);

  updateBleCounters();
  pillBottle.begin();

  for (int i = 0; i < MAX_DRUGS; i++) {
    pinMode(drugs[i].touchPin, INPUT);
    touchStates[i] = LOW;
    lastTouchStates[i] = LOW;
  }

  lastResetTime = millis();

  Serial.begin(9600);
  Serial.println("Setup complete");

  delay(1000);
  lcd.clear();
}

/* ---------- LOOP ---------- */

void loop() {
  if (millis() - lastRefreshTime < (1000 / REFRESH_RATE))
    return;
  lastRefreshTime = millis();

  /* Daily reset */
  if (millis() - lastResetTime >= DAY_LENGTH) {
    for (int i = 0; i < MAX_DRUGS; i++) {
      drugs[i].counter = 0;
    }
    updateBleCounters();
    lastResetTime = millis();
    Serial.println("Daily reset");
  }

  /* Read inputs */
  for (int i = 0; i < MAX_DRUGS; i++) {
    touchStates[i] = digitalRead(drugs[i].touchPin);

    if (touchStates[i] != lastTouchStates[i] && touchStates[i] == HIGH) {
      if (drugs[i].counter < drugs[i].dailyLimit) {
        drugs[i].counter++;
        updateBleCounters();
        Serial.println(String(drugs[i].name) + " -> " + drugs[i].counter);
      } else {
        flashWhite();
      }
    }

    lastTouchStates[i] = touchStates[i];
  }

  /* LCD display (2 drugs max) */
  lcd.setCursor(0, 0);
  lcd.print(drugs[0].name);
  lcd.print(": ");
  lcd.print(drugs[0].counter);
  lcd.print("/");
  lcd.print(drugs[0].dailyLimit);

  lcd.setCursor(0, 1);
  lcd.print(drugs[1].name);
  lcd.print(": ");
  lcd.print(drugs[1].counter);
  lcd.print("/");
  lcd.print(drugs[1].dailyLimit);
}
