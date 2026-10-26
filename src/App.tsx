import React, { useState, useRef, useEffect } from 'react';
import { SmartPark } from './smartpark';

interface SlotData {
  number: number;
  occupied: boolean;
  vehicle: string;
}

export const App: React.FC = () => {
  const smartParkRef = useRef<SmartPark>(new SmartPark());
  const inputRef = useRef<HTMLInputElement>(null);

  const [vehicleInput, setVehicleInput] = useState('');
  const [availableCount, setAvailableCount] = useState(12);
  const [occupiedCount, setOccupiedCount] = useState(0);
  const [waitingCount, setWaitingCount] = useState(0);
  const [slots, setSlots] = useState<SlotData[]>([]);
  const [waitingQueueText, setWaitingQueueText] = useState('No waiting vehicles.');
  const [exitedStackText, setExitedStackText] = useState('No exited vehicles yet.');
  const [historyText, setHistoryText] = useState('No parking history yet.');
  const [message, setMessage] = useState({
    text: 'SmartPark is ready. You can park, exit and search vehicles.',
    type: 'success' as 'success' | 'error' | '',
  });

  const syncState = () => {
    const sp = smartParkRef.current;
    setAvailableCount(sp.availableCount());
    setOccupiedCount(sp.occupiedCount());
    setWaitingCount(sp.waitingCount());

    const slotList: SlotData[] = [];
    const states = sp.getSlots();
    for (let i = 0; i < states.length; i++) {
      slotList.push({
        number: i + 1,
        occupied: states[i] === 1,
        vehicle: sp.getSlotVehicle(i + 1),
      });
    }
    setSlots(slotList);

    setWaitingQueueText(sp.getWaitingQueue());
    setExitedStackText(sp.getExitedStack());
    setHistoryText(sp.getHistory());
  };

  useEffect(() => {
    syncState();
  }, []);

  const handleAction = (actionType: 'park' | 'exit' | 'search') => {
    const sp = smartParkRef.current;
    const vehicle = vehicleInput.trim();

    if (!vehicle) {
      const errText =
        actionType === 'search'
          ? 'Enter a vehicle registration number.'
          : 'Please enter a vehicle registration number.';
      setMessage({ text: errText, type: 'error' });
      inputRef.current?.focus();
      return;
    }

    let result = '';
    if (actionType === 'park') {
      result = sp.parkVehicle(vehicle);
    } else if (actionType === 'exit') {
      result = sp.exitVehicle(vehicle);
    } else if (actionType === 'search') {
      result = sp.searchVehicle(vehicle);
    }

    syncState();

    const isError = /already parked|not currently parked|not found|Please enter|Enter a vehicle/i.test(result);
    setMessage({
      text: result,
      type: isError ? 'error' : 'success',
    });
  };

  const handleClear = () => {
    setVehicleInput('');
    inputRef.current?.focus();
    setMessage({ text: 'Input cleared.', type: '' });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAction('park');
    }
  };

  return (
    <div>
      <header className="topbar">
        <div className="brand">
          <div className="brand-icon">P</div>
          <div>
            <h1>SmartPark</h1>
            <p>Smart Parking Management System</p>
          </div>
        </div>
        <span id="status" className="status">
          Engine ready
        </span>
      </header>

      <main>
        <section className="welcome">
          <div>
            <p className="eyebrow">PARKING CONTROL CENTER</p>
            <h2>Dashboard</h2>
            <p className="muted">
              Manage parking slots, vehicle entry, waiting lines and activity.
            </p>
          </div>
          <div className="clock-note">
            12 parking slots <span>•</span> Local demo
          </div>
        </section>

        <section className="stats">
          <article className="stat-card">
            <div className="stat-label">
              <span className="dot green"></span> Available slots
            </div>
            <div id="available" className="stat-number">
              {availableCount}
            </div>
            <div className="stat-foot">Ready for parking</div>
          </article>
          <article className="stat-card">
            <div className="stat-label">
              <span className="dot red"></span> Occupied slots
            </div>
            <div id="occupied" className="stat-number">
              {occupiedCount}
            </div>
            <div className="stat-foot">Currently in use</div>
          </article>
          <article className="stat-card">
            <div className="stat-label">
              <span className="dot amber"></span> Waiting vehicles
            </div>
            <div id="waiting" className="stat-number">
              {waitingCount}
            </div>
            <div className="stat-foot">First-in, first-out</div>
          </article>
        </section>

        <section className="panel">
          <div className="section-heading">
            <div>
              <h3>Parking overview</h3>
              <p className="muted">Green means available; red means occupied.</p>
            </div>
            <span className="pill">12 slots</span>
          </div>
          <div id="slots" className="slots">
            {slots.map((slot) => (
              <div
                key={slot.number}
                className={`slot${slot.occupied ? ' occupied' : ''}`}
              >
                <div className="slot-top">
                  <span className="slot-number">SLOT P{slot.number}</span>
                  <span className="car-icon">🚘</span>
                </div>
                <div className="slot-state">
                  {slot.occupied ? '● Occupied' : '● Available'}
                </div>
                <div className="slot-vehicle">
                  {slot.vehicle || 'Ready to use'}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="two-column">
          <section className="panel">
            <div className="section-heading">
              <div>
                <h3>Vehicle management</h3>
                <p className="muted">Enter the vehicle registration below.</p>
              </div>
            </div>
            <label htmlFor="vehicle">Registration number</label>
            <input
              id="vehicle"
              ref={inputRef}
              type="text"
              placeholder="e.g. MH12AB1234"
              autoComplete="off"
              maxLength={20}
              value={vehicleInput}
              onChange={(e) => setVehicleInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <div className="button-grid">
              <button
                id="park"
                type="button"
                className="primary"
                onClick={() => handleAction('park')}
              >
                ＋ Park vehicle
              </button>
              <button
                id="exit"
                type="button"
                className="secondary"
                onClick={() => handleAction('exit')}
              >
                ↗ Vehicle exit
              </button>
              <button
                id="search"
                type="button"
                className="outline"
                onClick={() => handleAction('search')}
              >
                ⌕ Search vehicle
              </button>
              <button
                id="clear"
                type="button"
                className="outline"
                onClick={handleClear}
              >
                Clear input
              </button>
            </div>
            <div
              id="message"
              className={`message${message.type ? ' ' + message.type : ''}`}
              role="status"
              aria-live="polite"
            >
              {message.text}
            </div>
          </section>

          <section className="panel">
            <div className="section-heading">
              <div>
                <h3>Waiting queue</h3>
                <p className="muted">Vehicles waiting in FIFO order.</p>
              </div>
              <span className="mini-icon">↕</span>
            </div>
            <pre id="queue" className="record-list">
              {waitingQueueText}
            </pre>
          </section>
        </section>

        <section className="two-column">
          <section className="panel">
            <div className="section-heading">
              <div>
                <h3>Recently exited</h3>
                <p className="muted">Most recent exit appears first (stack).</p>
              </div>
              <span className="mini-icon">↶</span>
            </div>
            <pre id="exited" className="record-list">
              {exitedStackText}
            </pre>
          </section>

          <section className="panel">
            <div className="section-heading">
              <div>
                <h3>Parking history</h3>
                <p className="muted">Activity recorded in a linked list.</p>
              </div>
              <span className="mini-icon">≡</span>
            </div>
            <pre id="history" className="record-list history">
              {historyText}
            </pre>
          </section>
        </section>

        <footer>
          SmartPark DSA Mini Project <span>•</span> React + TypeScript
        </footer>
      </main>
    </div>
  );
};
