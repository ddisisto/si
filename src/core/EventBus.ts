/**
 * Event Bus - Facilitates communication between game systems
 */

// Event types will be defined as we implement specific features
export type EventCallback = (data: any) => void;

class EventBus {
  private listeners: Map<string, EventCallback[]> = new Map();

  /**
   * Subscribe to an event
   * @param eventType Type of event to listen for
   * @param callback Function to call when event is emitted
   */
  public subscribe(eventType: string, callback: EventCallback): void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, []);
    }
    
    const callbacks = this.listeners.get(eventType);
    if (callbacks) {
      callbacks.push(callback);
    }
  }

  /**
   * Unsubscribe from an event
   * @param eventType Type of event to stop listening for
   * @param callback Function to remove from listeners
   */
  public unsubscribe(eventType: string, callback: EventCallback): void {
    if (!this.listeners.has(eventType)) return;
    
    const callbacks = this.listeners.get(eventType);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index !== -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  /**
   * Emit an event to all subscribers
   * @param eventType Type of event to emit
   * @param data Data to pass to subscribers
   */
  public emit(eventType: string, data: any = {}): void {
    if (!this.listeners.has(eventType)) return;
    
    const callbacks = this.listeners.get(eventType);
    if (callbacks) {
      callbacks.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in event listener for ${eventType}:`, error);
        }
      });
    }
  }
}

export default EventBus;