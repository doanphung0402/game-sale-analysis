import vl from 'vega-lite-api';
export const viz = vl
  .markBar({ size: 10, opacity: 1 })
  .encode(
    vl.x().fieldT('Year').scale({ zero: false }),
    vl.y().fieldQ('Global_Sales').scale({ zero: false }),
    vl.color().fieldN('Genre'),
    vl.tooltip().fieldN('Genre')
  );