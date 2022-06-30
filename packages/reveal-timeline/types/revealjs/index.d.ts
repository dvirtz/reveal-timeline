interface RevealStatic {
  on(type: string, listener: (event: any) => void, useCapture?: boolean): void;
  off(type: string, listener: (event: any) => void, useCapture?: boolean): void;

  getSlidesElement(): HTMLElement;
  getRevealElement(): HTMLElement;
  getViewportElement(): HTMLElement;
  getSlides(): Element[];

  addKeyBinding(keyBinding: RevealKeyBinding, callback: () => void): void;
  addKeyBinding(keyCode: number, callback: () => void): void;
  removeKeyBinding(keyCode: number): void;
}

interface RevealPlugin {
  id: string;
  init(deck: RevealStatic): void | Promise<any>;
}

interface RevealKeyBinding {
  keyCode: number;
  key: string;
  description: string;
}