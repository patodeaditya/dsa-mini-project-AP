# SmartPark Web Application (React + TypeScript)

A smart parking management dashboard demonstrating five core computer science data structures in real time.

## Overview
SmartPark manages 12 parking slots, handles waiting vehicles when capacity is reached, logs vehicles that exit, and tracks the full timeline of parking activity.

### Five Data Structures
1. **Fixed Array** (`Slot[12]`): Tracks the 12 fixed parking slots (P1 to P12), their occupancy states, and assigned vehicle numbers.
2. **Queue** (FIFO): Manages waiting vehicles in first-in, first-out order when all 12 slots are occupied. When a vehicle leaves, the first waiting vehicle automatically receives the freed slot.
3. **Stack** (LIFO): Records recently exited vehicles with the most recent exit at the top.
4. **Linked List** (`HistoryNode`): Maintains an append-only sequential log of all parking actions (parking, queueing, exiting).
5. **Hash Map** (`Map<string, number>`): Provides fast O(1) lookups mapping active vehicle registration numbers to their slot indexes.

## Features
- **Real-Time Dashboard**: Live count of available slots, occupied slots, and vehicles in the waiting queue.
- **Visual Parking Grid**: Color-coded indicators showing slot availability (green) and occupancy (red) with car icons and license plates.
- **Vehicle Operations**:
  - **Park vehicle**: Parks a car into the first available slot, or places it in the FIFO waiting queue if full.
  - **Exit vehicle**: Removes a vehicle from its slot, pushes it to the exited stack, and pulls the next car from the waiting queue if any exist.
  - **Search vehicle**: Locates whether a car is currently parked (with slot number), in the waiting queue, or not present.
  - **Clear input**: Resets the registration input field.
- **Keyboard Shortcut**: Press `Enter` in the registration input field to park quickly.

## Development

```bash
# Install dependencies
npm install

# Start development server on port 3000
npm run dev

# Build for production
npm run build
```
