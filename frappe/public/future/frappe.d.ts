/**
 * The frappe framework namespace
 */
export declare module frappe {
  /**
   * Provides a globally accessible namespace.
   */
  export function provide(namespace: string): void;

  /**
   * Base list implementation class.
   */
  export abstract class BaseList {
    public page_title: string
    public abstract setup_defaults: () => void
  }

  /**
   * Default List view implementation class.
   */
  export class ListView extends BaseList {
    public setup_defaults: () => void
  }

  export interface FrappeViews {
    BaseList: BaseList
    ListView: ListView
    [name: string]: ListView
  }
  
  export const views:FrappeViews;
}

/**
 * Localisation helper.
 */
export declare function __(val: string): string;