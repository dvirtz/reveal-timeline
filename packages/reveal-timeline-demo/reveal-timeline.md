---
scripts:
  - node_modules/reveal-timeline/dist/timeline.js
  - scripts/load-plugins.js
css:
  - css/demo.css
highlightTheme: github
revealOptions:
  timeline:
    position: top
---

<!-- .slide: data-timeline-title -->

# reveal-timeline

Dvir Yitzchaki

<div id="logos" style="column-count: 2">

<div id="github">

[![gitHub](https://github.githubassets.com/images/modules/logos_page/GitHub-Logo.png)](https://github.com/dvirtz/reveal-timeline/tree/main/packages/reveal-timeline)

</div>

[![npm version](https://badge.fury.io/js/reveal-timeline.svg)](https://badge.fury.io/js/reveal-timeline) 

</div>

-----

Powered by [reveal.js](https://revealjs.com/) and [TimelineJS](http://timeline.knightlab.com/)

---

<!-- .slide: data-timeline-start-date="1822" -->

add 

`data-timeline-start-date="`[ISO 8601 date](https://www.w3.org/TR/NOTE-datetime)`"` 

attribute to set slide date

<iframe width="560" height="315" src="https://www.youtube.com/embed/MRkDU-48f3U" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

#### The Beatles - 1822


---

<!-- .slide: data-timeline-start-date="1963-12" -->

The headline is set to the concatenation of all `<h1>–<h6>` elements in the slide or by a `data-timeline-headline` attribute.

<iframe width="560" height="315" src="https://www.youtube.com/embed/mTUhnIY3oRM" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

#### Frankie Valli & The Four Seasons 
#### December, 1963

---

<!-- .slide: data-timeline-start-date="2022-04-20" -->

The timeline moves with the slides

<iframe width="560" height="315" src="https://www.youtube.com/embed/ssSL9rAPczI" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

#### Eddie Vedder
#### 4/20/02

---

<!-- .slide: id="configurations" data-timeline-start-date="2022-14-07" data-timeline-headline="configuration" -->

## Configurable

- add `data-timeline-hide` attribute to hide the timeline on this slide

- add `timeline` object to reveal.js [config object](https://revealjs.com/config/) with the following optional properties:

| property | values |
|----------|--------|
| position | [top](?timeline=%7B%22position%22%3A%20%22top%22%7D#/configurations) [bottom](?timeline=%7B%22position%22%3A%20%22bottom%22%7D#/configurations) |
| height | e.g. [27mm](?timeline=%7B%22height%22%3A%20%2227mm%22%7D#/configurations) [140px](?timeline=%7B%22height%22%3A%20%22140px%22%7D#/configurations) [2in](?timeline=%7B%22height%22%3A%20%222in%22%7D#/configurations) |

<!-- .element: id="configuration" -->

---

<!-- .slide: data-timeline-hide -->

## Download

<div id="logos" style="column-count: 2">

<div id="github">

[![gitHub](https://github.githubassets.com/images/modules/logos_page/GitHub-Logo.png)](https://github.com/dvirtz/reveal-timeline/tree/main/packages/reveal-timeline)

</div>

[![npm version](https://badge.fury.io/js/reveal-timeline.svg)](https://badge.fury.io/js/reveal-timeline) 

</div>
