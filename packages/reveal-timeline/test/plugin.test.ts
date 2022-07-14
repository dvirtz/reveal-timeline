const Reveal = require('reveal.js');

import Timeline from '../src/timeline';

describe('plugin', function () {

  // https://github.com/jsdom/jsdom/issues/135#issuecomment-602090020
  Object.defineProperties(window.HTMLElement.prototype, {
    offsetLeft: {
      get() { return parseFloat(this.style.marginLeft) || 0 }
    },
    offsetTop: {
      get() { return parseFloat(this.style.marginTop) || 0 }
    },
    offsetHeight: {
      get() { return parseFloat(this.style.height) || 0 }
    },
    offsetWidth: {
      get() { return parseFloat(this.style.width) || 0 }
    }
  });

  test('plugin no title', async function () {
    document.body.innerHTML = `
    <div class="reveal" style="height: 640px; width: 400px;">
      <div class="slides">
        <section data-timeline-start-date="1984">
          <h1>first</h1>
        </section>
        
        <section data-timeline-start-date="1985">
          <h1>second</h1>
        </section>
      </div>
    </div>
    `;


    let deck = new Reveal(document.body.querySelector('.reveal'), { history: true, plugins: [Timeline] });
    await deck.initialize();
    expect(deck.getPlugins()).toHaveProperty('timeline');

    const timeline = document.body.querySelector('div.tl-timeline') as HTMLDivElement;
    const first = timeline!.querySelector('.tl-timemarker[id=slide_0-marker]');
    const second = timeline!.querySelector('.tl-timemarker[id=slide_1-marker]');

    expect(timeline).not.toBeNull();
    expect(timeline.style.visibility).toBe('visible');
    expect(first?.classList).toContain('tl-timemarker-active');
    expect(second?.classList).not.toContain('tl-timemarker-active');
    expect(deck.getIndices(deck.getCurrentSlide())).toEqual({ h: 0 });

    // test timeline move causes slide move
    (second as HTMLElement).click();
    expect(first?.classList).not.toContain('tl-timemarker-active');
    expect(second?.classList).toContain('tl-timemarker-active');
    expect(deck.getIndices(deck.getCurrentSlide())).toEqual({ h: 1 });

    // test slide move causes timeline move
    deck.prev();
    expect(first?.classList).toContain('tl-timemarker-active');
    expect(second?.classList).not.toContain('tl-timemarker-active');
    expect(deck.getIndices(deck.getCurrentSlide())).toEqual({ h: 0 });

    // simulate a refresh
    await deck.initialize();
    expect(first?.classList).toContain('tl-timemarker-active');
    expect(second?.classList).not.toContain('tl-timemarker-active');
    expect(deck.getIndices(deck.getCurrentSlide())).toEqual({ h: 0 });
  });

  test('plugin with title', async function () {
    document.body.innerHTML = `
    <div class="reveal" style="height: 640px; width: 400px;">
      <div class="slides">
        <section data-timeline-hide>
          <h1>title</h1>
        </section>

        <section data-timeline-start-date="1984">
          <h1>first</h1>
        </section>
        
        <section data-timeline-start-date="1985">
          <h1>second</h1>
        </section>
      </div>
    </div>
    `;


    let deck = new Reveal(document.body.querySelector('.reveal'), { history: true, plugins: [Timeline], timeline: { height: 20 } });
    await deck.initialize();
    expect(deck.getPlugins()).toHaveProperty('timeline');

    const timeline = document.body.querySelector('div.tl-timeline') as HTMLDivElement;
    const first = timeline!.querySelector('.tl-timemarker[id=slide_1-marker]');
    const second = timeline!.querySelector('.tl-timemarker[id=slide_2-marker]');

    expect(timeline).not.toBeNull();
    expect(timeline.style.visibility).toBe('hidden');
    expect(first?.classList).not.toContain('tl-timemarker-active');
    expect(second?.classList).not.toContain('tl-timemarker-active');
    expect(deck.getIndices(deck.getCurrentSlide())).toEqual({ h: 0 });

    // test timeline move causes slide move
    (second as HTMLElement).click();
    expect(timeline.style.visibility).toBe('visible');
    expect(first?.classList).not.toContain('tl-timemarker-active');
    expect(second?.classList).toContain('tl-timemarker-active');
    expect(deck.getIndices(deck.getCurrentSlide())).toEqual({ h: 2 });

    // test slide move causes timeline move
    deck.prev();
    expect(first?.classList).toContain('tl-timemarker-active');
    expect(second?.classList).not.toContain('tl-timemarker-active');
    expect(deck.getIndices(deck.getCurrentSlide())).toEqual({ h: 1 });

    // simulate a refresh
    await deck.initialize();
    expect(first?.classList).toContain('tl-timemarker-active');
    expect(second?.classList).not.toContain('tl-timemarker-active');
    expect(deck.getIndices(deck.getCurrentSlide())).toEqual({ h: 1 });

    // move to slide with no timeline
    deck.prev();
    expect(timeline.style.visibility).toBe('hidden');
    expect(first?.classList).not.toContain('tl-timemarker-active');
    expect(second?.classList).not.toContain('tl-timemarker-active');
    expect(deck.getIndices(deck.getCurrentSlide())).toEqual({ h: 0 });
  });

  test('no timeline slides', async function () {
    document.body.innerHTML = `
    <div class="reveal" style="height: 640px; width: 400px;">
      <div class="slides">
        <section>
          <h1>TITLE</h1>
        </section>
      </div>
    </div>
    `;
    const warnSpy = jest.spyOn(console, 'warn');

    let deck = new Reveal(document.body.querySelector('.reveal'), { plugins: [Timeline] });
    await deck.initialize();

    expect(warnSpy).toBeCalledWith('no slides with "data-timeline-start-date" attribute, disabling');
    expect(document.body.querySelector('.tl-timeline')).toBeNull();
  });

  test('json configuration', async function () {
    document.body.innerHTML = `
    <div class="reveal" style="height: 640px; width: 400px;">
      <div class="slides">
        <section data-timeline-start-date="1984">
          <h1>TITLE</h1>
        </section>
      </div>
    </div>
    `;

    let deck = new Reveal(document.body.querySelector('.reveal'), { plugins: [Timeline], timeline: JSON.stringify({ height: '120px' }) });
    await deck.initialize();

    const timeline = document.body.querySelector('div.tl-timeline') as HTMLDivElement;
    expect(timeline.style.height == '120px');
  });

});