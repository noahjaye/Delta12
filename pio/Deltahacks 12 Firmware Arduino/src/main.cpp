#include <Arduino.h>
#include <CurieBLE.h>
#include <CurieTime.h>
#include <ctime>
#include <rgb_lcd.h>

#define TOUCH_PIN_MED1 3 // Tylenol
#define TOUCH_PIN_MED2 4 // Vivace (reserved for future use)
#define REFRESH_RATE 60  // in Hz

rgb_lcd lcd;

BLEPeripheral pillBottle;
BLEService counterService("12345678-1280-1280-1280-676767abcdef");
BLECharacteristic counterCharacteristic("87654321-1280-1280-1280-abcdef676767",
                                        BLERead | BLENotify,
                                        8); // 8 bytes for 2 unsigned ints
unsigned int med1Counter = 0;               // First med
unsigned int med2Counter = 0;               // Second med

bool touchStates[2] = {LOW, LOW};
bool lastTouchStates[2] = {LOW, LOW};

unsigned long lastRefreshTime = 0;
unsigned long lastResetTime = 0;
const unsigned long DAY_LENGTH = 300000000; // 30s for testing (in milliseconds)

// Flash the LCD backlight white a few times to indicate daily limit reached
void flashWhite(int times = 3, int onMs = 150, int offMs = 150) {
  for (int i = 0; i < times; ++i) {
    lcd.setRGB(255, 255, 255);
    delay(onMs);
    lcd.setRGB(0, 0, 0);
    delay(offMs);
  }
  // leave backlight on white after flashing
  lcd.setRGB(255, 255, 255);
}

void setup() {
  lcd.begin(16, 2); // Initialize a 16x2 LCD
  lcd.setRGB(255, 255, 255);
  lcd.print("Initializing...");

  // Initialize BLE
  pillBottle.setLocalName("LeBron's Secret Stash");
  pillBottle.setAdvertisedServiceUuid(counterService.uuid());
  pillBottle.addAttribute(counterService);
  pillBottle.addAttribute(counterCharacteristic);

  // Initialize characteristic with both counters (8 bytes: 4 bytes med1 + 4
  // bytes med2)
  unsigned char counterValues[8];
  memcpy(&counterValues[0], &med1Counter, 4);
  memcpy(&counterValues[4], &med2Counter, 4);
  counterCharacteristic.setValue(counterValues, 8);

  pillBottle.begin();

  // Initialize touch sensor pins
  pinMode(TOUCH_PIN_MED1, INPUT);
  pinMode(TOUCH_PIN_MED2, INPUT);

  // Initialize reset timer
  lastResetTime = millis();

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

  // Check if a day has passed and reset counters
  if (millis() - lastResetTime >= DAY_LENGTH) {
    med1Counter = 0;
    med2Counter = 0;
    lastResetTime = millis();

    // Update BLE characteristic with both reset values
    unsigned char counterValues[8];
    memcpy(&counterValues[0], &med1Counter, 4);
    memcpy(&counterValues[4], &med2Counter, 4);
    counterCharacteristic.setValue(counterValues, 8);

    Serial.println("Day reset! Counters reset to 0.");
  }

  Serial.println(millis());

  // Read touch sensor states for both medications
  touchStates[0] = digitalRead(TOUCH_PIN_MED1); // Tylenol
  touchStates[1] = digitalRead(TOUCH_PIN_MED2); // Vivace

  // Display Med 1 (Tylenol) on line 0
  lcd.setCursor(0, 0);
  lcd.print("Tylenol: ");
  lcd.print(med1Counter);
  lcd.print("/102  ");

  // Display Med 2 (Vivace) on line 1
  lcd.setCursor(0, 1);
  lcd.print("Vivace: ");
  lcd.print(med2Counter);
  lcd.print("/3   ");

  // Handle touch sensor for Med 1 (Tylenol)
  if (touchStates[0] != lastTouchStates[0]) {
    if (touchStates[0] == HIGH) {
      if (med1Counter < 102) { // Daily dosage limit for Tylenol is 1
        med1Counter++;

        // Update BLE characteristic with both values
        unsigned char counterValues[8];
        memcpy(&counterValues[0], &med1Counter, 4);
        memcpy(&counterValues[4], &med2Counter, 4);
        counterCharacteristic.setValue(counterValues, 8);

        Serial.println("Tylenol doses: " + String(med1Counter));
      } else {
        flashWhite(3, 150, 150);
      }
    }
    lastTouchStates[0] = touchStates[0];
  }

  // Handle touch sensor for Med 2 (Vivace)
  if (touchStates[1] != lastTouchStates[1]) {
    if (touchStates[1] == HIGH) {
      if (med2Counter < 3) { // Daily dosage limit for Vivace is 3
        med2Counter++;

        // Update BLE characteristic with both values
        unsigned char counterValues[8];
        memcpy(&counterValues[0], &med1Counter, 4);
        memcpy(&counterValues[4], &med2Counter, 4);
        counterCharacteristic.setValue(counterValues, 8);

        Serial.println("Vivace doses: " + String(med2Counter));
      } else {
        flashWhite(3, 150, 150);
      }
    }
    lastTouchStates[1] = touchStates[1];
  }
}