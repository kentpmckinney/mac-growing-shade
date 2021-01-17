KNOWN ISSUES:

1) Map does not show up on Heroku (using the transpiled version of the build)

Console Error: ReferenceError: y is not defined

Root Cause:
12/9/2020: https://github.com/mapbox/mapbox-gl-js/issues/10173
The root cause of this is that after our switch from a ES5 bundle to a ES6 one, Babel transpilation of the bundle breaks it due to the way we set up worker code. We're investigating ways to address this, but the current workaround is to configure your app to exempt mapbox-gl from being transpiled.

Solution: wait for a new release

2) findDOMNode errors in the console

Console Error: findDOMNode is deprecated in StrictMode

Root Cause:
https://github.com/react-bootstrap/react-bootstrap/issues/5075
Affects several react-bootstrap components
Doesn't cause a problem with the site, but may affect the Lighthouse score and Google search score

Solution: wait for a new release