/**
 * Event Bus - Facilitates communication between game systems
 */

import Logger from '../utils/Logger';

// Event types will be defined as we implement specific features
export type EventCallback = (data: any) => void;

interface EventBusOptions {
  debugMode?: boolean;
  enableEventChaining?: boolean;
  maxListenersPerEvent?: number;
}

interface EventContext {
  eventType: string;
  timestamp: number;
  source?: string;
  chainDepth: number;
  parentEvent?: string;
}

interface ListenerInfo {
  callback: EventCallback;
  source?: string;
  added: number;
}

class EventBus {
  private listeners: Map<string, ListenerInfo[]> = new Map();
  private eventHistory: EventContext[] = [];
  private eventChain: string[] = [];
  private options: EventBusOptions;
  private debugMode: boolean;

  constructor(options: EventBusOptions = {}) {
    this.options = {
      debugMode: false,
      enableEventChaining: true,
      maxListenersPerEvent: 10,
      ...options
    };
    this.debugMode = this.options.debugMode || false;
  }

  /**
   * Get current health status of EventBus
   */
  public getHealthStatus(): { 
    totalEvents: number;
    totalListeners: number;
    eventCounts: Map<string, number>;
    warnings: string[];
  } {
    const warnings: string[] = [];
    const eventCounts = new Map<string, number>();
    let totalListeners = 0;

    this.listeners.forEach((listeners, eventType) => {
      eventCounts.set(eventType, listeners.length);
      totalListeners += listeners.length;
      
      if (listeners.length > (this.options.maxListenersPerEvent || 10)) {
        warnings.push(`Event '${eventType}' has ${listeners.length} listeners (max: ${this.options.maxListenersPerEvent})`);
      }
    });

    return {
      totalEvents: this.eventHistory.length,
      totalListeners,
      eventCounts,
      warnings
    };
  }

  /**
   * Subscribe to an event
   * @param eventType Type of event to listen for
   * @param callback Function to call when event is emitted
   * @param source Optional source identifier for debugging
   */
  public subscribe(eventType: string, callback: EventCallback, source?: string): void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, []);
    }
    
    const listeners = this.listeners.get(eventType);
    if (listeners) {
      const listenerInfo: ListenerInfo = {
        callback,
        source,
        added: Date.now()
      };
      listeners.push(listenerInfo);
      
      if (this.debugMode) {
        Logger.debug(`EventBus: Subscribed to '${eventType}' (source: ${source || 'unknown'})`);
      }
      
      // Check for max listeners
      if (listeners.length > (this.options.maxListenersPerEvent || 10)) {
        Logger.warn(`EventBus: Event '${eventType}' has ${listeners.length} listeners (max: ${this.options.maxListenersPerEvent})`);
      }
    }
  }

  /**
   * Unsubscribe from an event
   * @param eventType Type of event to stop listening for
   * @param callback Function to remove from listeners
   */
  public unsubscribe(eventType: string, callback: EventCallback): void {
    if (!this.listeners.has(eventType)) return;
    
    const listeners = this.listeners.get(eventType);
    if (listeners) {
      const index = listeners.findIndex(l => l.callback === callback);
      if (index !== -1) {
        const removed = listeners.splice(index, 1)[0];
        if (this.debugMode) {
          Logger.debug(`EventBus: Unsubscribed from '${eventType}' (source: ${removed.source || 'unknown'})`);
        }
      }
    }
  }

  /**
   * Emit an event to all subscribers
   * @param eventType Type of event to emit
   * @param data Data to pass to subscribers
   * @param source Optional source identifier for debugging
   */
  public emit(eventType: string, data: any = {}, source?: string): void {
    // Track event context
    const context: EventContext = {
      eventType,
      timestamp: Date.now(),
      source,
      chainDepth: this.eventChain.length,
      parentEvent: this.eventChain[this.eventChain.length - 1]
    };
    
    // Add to history
    if (this.eventHistory.length > 1000) {
      this.eventHistory.shift(); // Keep history manageable
    }
    this.eventHistory.push(context);
    
    // Track event chain
    if (this.options.enableEventChaining) {
      this.eventChain.push(eventType);
    }
    
    if (this.debugMode) {
      Logger.debug(`EventBus: Emitting '${eventType}' (source: ${source || 'unknown'}, chain depth: ${context.chainDepth})`);
    }
    
    if (!this.listeners.has(eventType)) {
      if (this.debugMode) {
        Logger.debug(`EventBus: No listeners for '${eventType}'`);
      }
      this.eventChain.pop(); // Clean up chain
      return;
    }
    
    const listeners = this.listeners.get(eventType);
    if (listeners) {
      let errorCount = 0;
      const listenersArray = Array.from(listeners);
      for (let index = 0; index < listenersArray.length; index++) {
        const listenerInfo = listenersArray[index];
        try {
          listenerInfo.callback(data);
        } catch (error) {
          errorCount++;
          const errorContext = {
            eventType,
            listenerIndex: index,
            listenerSource: listenerInfo.source || 'unknown',
            error: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,
            eventChain: [...this.eventChain],
            data: this.debugMode ? data : undefined
          };
          
          Logger.error(`EventBus: Error in listener for '${eventType}':`, errorContext);
          
          // Don't let one bad listener break the chain
          if (errorCount > listenersArray.length / 2) {
            Logger.error(`EventBus: Too many errors (${errorCount}/${listenersArray.length}) for '${eventType}', stopping emission`);
            break;
          }
        }
      }
    }
    
    // Clean up event chain
    if (this.options.enableEventChaining) {
      this.eventChain.pop();
    }
  }

  /**
   * Get event history for debugging
   */
  public getEventHistory(limit: number = 50): EventContext[] {
    return this.eventHistory.slice(-limit);
  }

  /**
   * Get current event chain
   */
  public getCurrentEventChain(): string[] {
    return [...this.eventChain];
  }

  /**
   * Clear event history
   */
  public clearHistory(): void {
    this.eventHistory = [];
  }

  /**
   * Get all listeners for debugging
   */
  public getListeners(eventType?: string): Map<string, ListenerInfo[]> | ListenerInfo[] | undefined {
    if (eventType) {
      return this.listeners.get(eventType);
    }
    return new Map(this.listeners);
  }

  /**
   * Enable/disable debug mode
   */
  public setDebugMode(enabled: boolean): void {
    this.debugMode = enabled;
    this.options.debugMode = enabled;
    Logger.info(`EventBus: Debug mode ${enabled ? 'enabled' : 'disabled'}`);
  }
}

export default EventBus;
export { EventBusOptions, EventContext, ListenerInfo };