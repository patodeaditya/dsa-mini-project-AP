// Data Structures and Algorithms implementation for SmartPark

export interface Slot {
  occupied: boolean;
  vehicle: string;
}

// 4) LINKED LIST NODE: parking activity history
export class HistoryNode {
  text: string;
  next: HistoryNode | null;
  constructor(text: string) {
    this.text = text;
    this.next = null;
  }
}

export class SmartPark {
  private static readonly SLOT_COUNT = 12;

  // 1) ARRAY: fixed number of parking slots
  private slots: Slot[];

  // 2) QUEUE: vehicles waiting for a free slot (FIFO)
  private waitingQueue: string[];

  // 3) STACK: recently exited vehicles (LIFO)
  private exitedStack: string[];

  // 4) LINKED LIST: parking activity history
  private historyHead: HistoryNode | null = null;
  private historyTail: HistoryNode | null = null;

  // 5) HASH TABLE: active vehicle registration -> slot index (0-indexed)
  private vehicleToSlot: Map<string, number>;

  constructor() {
    this.slots = Array.from({ length: SmartPark.SLOT_COUNT }, () => ({
      occupied: false,
      vehicle: '',
    }));
    this.waitingQueue = [];
    this.exitedStack = [];
    this.vehicleToSlot = new Map();
  }

  // Normalizes vehicle strings: uppercase and removes whitespace
  private static normalize(input: string): string {
    let result = '';
    for (let i = 0; i < input.length; i++) {
      const ch = input[i];
      if (ch.trim() !== '') {
        result += ch.toUpperCase();
      }
    }
    return result;
  }

  private addHistory(text: string): void {
    const node = new HistoryNode(text);
    if (this.historyHead === null) {
      this.historyHead = node;
      this.historyTail = node;
    } else {
      if (this.historyTail) {
        this.historyTail.next = node;
      }
      this.historyTail = node;
    }
  }

  private isWaiting(vehicle: string): boolean {
    return this.waitingQueue.includes(vehicle);
  }

  private findFreeSlot(): number {
    for (let i = 0; i < SmartPark.SLOT_COUNT; ++i) {
      if (!this.slots[i].occupied) {
        return i;
      }
    }
    return -1;
  }

  private assignVehicleToSlot(vehicle: string, index: number): void {
    this.slots[index].occupied = true;
    this.slots[index].vehicle = vehicle;
    this.vehicleToSlot.set(vehicle, index);
    this.addHistory(vehicle + ' parked in slot P' + (index + 1));
  }

  public getSlots(): number[] {
    return this.slots.map((s) => (s.occupied ? 1 : 0));
  }

  public getSlotVehicle(slotNumber: number): string {
    if (slotNumber < 1 || slotNumber > SmartPark.SLOT_COUNT) return '';
    const slot = this.slots[slotNumber - 1];
    return slot.occupied ? slot.vehicle : '';
  }

  public availableCount(): number {
    return this.slots.filter((s) => !s.occupied).length;
  }

  public occupiedCount(): number {
    return SmartPark.SLOT_COUNT - this.availableCount();
  }

  public waitingCount(): number {
    return this.waitingQueue.length;
  }

  public totalSlots(): number {
    return SmartPark.SLOT_COUNT;
  }

  public parkVehicle(rawInput: string): string {
    const vehicle = SmartPark.normalize(rawInput);
    if (!vehicle) return 'Please enter a vehicle registration number.';
    if (this.vehicleToSlot.has(vehicle)) {
      return vehicle + ' is already parked.';
    }
    if (this.isWaiting(vehicle)) {
      return vehicle + ' is already in the waiting queue.';
    }

    const freeIndex = this.findFreeSlot();
    if (freeIndex === -1) {
      this.waitingQueue.push(vehicle);
      this.addHistory(vehicle + ' joined the waiting queue');
      return 'Parking is full. ' + vehicle + ' was added to the waiting queue.';
    }

    this.assignVehicleToSlot(vehicle, freeIndex);
    return vehicle + ' parked successfully in P' + (freeIndex + 1) + '.';
  }

  public exitVehicle(rawInput: string): string {
    const vehicle = SmartPark.normalize(rawInput);
    if (!vehicle) return 'Please enter a vehicle registration number.';

    const index = this.vehicleToSlot.get(vehicle);
    if (index === undefined) {
      return vehicle + ' is not currently parked.';
    }

    this.slots[index].occupied = false;
    this.slots[index].vehicle = '';
    this.vehicleToSlot.delete(vehicle);
    this.exitedStack.push(vehicle);
    this.addHistory(vehicle + ' exited from P' + (index + 1));

    let message = vehicle + ' exited from P' + (index + 1) + '.';

    // The first waiting vehicle receives the newly freed slot (FIFO).
    if (this.waitingQueue.length > 0) {
      const nextVehicle = this.waitingQueue.shift()!;
      this.assignVehicleToSlot(nextVehicle, index);
      message +=
        ' ' +
        nextVehicle +
        ' moved from the waiting queue into P' +
        (index + 1) +
        '.';
    }
    return message;
  }

  public searchVehicle(rawInput: string): string {
    const vehicle = SmartPark.normalize(rawInput);
    if (!vehicle) return 'Enter a vehicle registration number.';

    const slotIndex = this.vehicleToSlot.get(vehicle);
    if (slotIndex !== undefined) {
      return vehicle + ' is parked in slot P' + (slotIndex + 1) + '.';
    }

    if (this.isWaiting(vehicle)) {
      return vehicle + ' is in the waiting queue.';
    }

    return vehicle + ' was not found.';
  }

  public getWaitingQueue(): string {
    if (this.waitingQueue.length === 0) return 'No waiting vehicles.';
    return this.waitingQueue.join('\n');
  }

  public getExitedStack(): string {
    if (this.exitedStack.length === 0) return 'No exited vehicles yet.';
    // Stack is LIFO: most recent exit at the top
    const copy = [...this.exitedStack].reverse();
    return copy.join('\n');
  }

  public getHistory(): string {
    if (this.historyHead === null) return 'No parking history yet.';
    const items: string[] = [];
    let current: HistoryNode | null = this.historyHead;
    while (current !== null) {
      items.push(current.text);
      current = current.next;
    }
    return items.join('\n');
  }
}
