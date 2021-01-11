### Component Diagram

```
      <APP>
       / \
      /   \
[header]  [content]
<NAVBAR>  <HOME>
          <PROJECTOVERVIEW>
          <CONTACT>
          <MAP>
             [read state: sliders]
              \
             <SLIDEROVERLAY>
                \
                <ACCORDIONTOGGLE>
                <SLIDER>
                   [read/write state: sliders]

```