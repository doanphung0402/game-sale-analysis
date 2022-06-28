(function (vega, vegaLite, vl, vegaTooltip, d3) {
  'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var vega__default = /*#__PURE__*/_interopDefaultLegacy(vega);
  var vegaLite__default = /*#__PURE__*/_interopDefaultLegacy(vegaLite);
  var vl__default = /*#__PURE__*/_interopDefaultLegacy(vl);

  // Appearance customization to improve readability.
  // See https://vega.github.io/vega-lite/docs/
  const dark = '#3e3c38';
  const config = {
    axis: {
      domain: false,
      tickColor: 'lightGray'
    },
    style: {
      "guide-label": {
        fontSize: 20,
        fill: dark
      },
      "guide-title": {
        fontSize: 30,
        fill: dark
      }
    }
  };

  const csvUrl = 'https://gist.githubusercontent.com/evarun22/39d2fdb26f358c0171aa87b989b4d816/raw/e52963e5791313311781b8e42e4623280d6d1754/vgsales.csv';

  const getData = async () => {
    const data = await d3.csv(csvUrl);
    
    // Have a look at the attributes available in the console!
    console.log(data[0]);

    return data;
  };

  const viz = vl__default["default"]
    .markBar({ size: 10, opacity: 1 })
    .encode(
      vl__default["default"].x().fieldT('Year').scale({ zero: false }),
      vl__default["default"].y().fieldQ('Global_Sales').scale({ zero: false }),
      vl__default["default"].color().fieldN('Genre'),
      vl__default["default"].tooltip().fieldN('Genre')
    );

  vl__default["default"].register(vega__default["default"], vegaLite__default["default"], {
    view: { renderer: 'svg' },
    init: view => { view.tooltip(new vegaTooltip.Handler().call); }
  });

  const run = async () => {
    const marks = viz
      .data(await getData())
      .width(window.innerWidth)
      .height(300)
      .autosize({ type: 'fit', contains: 'padding' })
      .config(config);
      
    document.body.appendChild(await marks.render()); 
  };
  run();

})(vega, vegaLite, vl, vegaTooltip, d3);
