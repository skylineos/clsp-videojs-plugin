
# CLSP Changelog


## v0.14.0 - WIP - Critical

* perform destroy / cleanup logic when the videojs player is disposed
* improve metrics
* minimize and minify the iframe srcdoc javascript
* make iframe javascript reference parent window paho library to reduce code duplication
* implement workaround for videojs 7 autoplay issue
* update to videojs 7 to improve memory management
* fix tab visibility memory leaks
* improve memory management
* implement destroy method for all classes
* fix destroy logic
* improve error handling
* attempt to recover from all known, recoverable errors
* demo displays index number and stream url
* demo page remembers last used urls
* demo page allows user to close an individual player
* demo page only contains wall
* fix webpack config mutations, which fixes dev server
* remove gulp, rely solely on bash scripts and webpack
* decouple mqtt conduit logic
* decouple the MSE abstraction by creating separate mediasource and sourcebuffer abstractions
* file / class restructure
* decrease coupling between classes
* decrease coupling between videojs and iovPlayer
* update dependencies


## v0.13.4 - 2018-08-27 - Critical

* tours are no longer supported - must be implemented by the caller
* fix high quality stream playback (streams with large segment intervals)
* video elements are now properly muted, so user interaction is no longer required for autoplay on page load
* make drift detection values dynamically calculated based on metrics
* make freeze detection values dynamically calculated based on metrics
* improve metrics
* improve memory management
* improve error handling
* tour improvements
* ensure all moofs have proper and sequential sequence numbers
* properly display version number on registered plugin
* add version script to automatically build whenever version is incremented
* demo page tracks number of videos playing, time started, and time elapsed
* improve dev server
* file / class restructure
* decrease coupling between classes
* decrease coupling between videojs and iovPlayer
* update dependencies


## v0.12.1 - 2018-08-27 - Optional

* improve demo page


## v0.12.0 - 2018-08-13 - Critical

* metric collection and calculation
* implement a queue to reduce unecessarily-dropped video segments
* implement "burst control" to ensure that video segments are not skipped
* rudimentary tab visibility handling
* rudimentary "drift detection" to respond to increases in lag
* rudimentary "freeze detection" to respond to seemingly frozen streams
* reduce video stuttering
* improve error handling
* require videojs 6.7.1 (the last version to properly support autoplay)
* document relationship between SFS settings and player performance and guarantees
* demo page improvements
* display metrics on demo page
* abstract the logic for MSE
* decrease coupling between classes
* decrease coupling between videojs and iovPlayer
* update dependencies


## v0.10.2 - 2018-08-27 - Optional

* improve demo page


## v0.10.0 - 2018-08-01 - Critical

* first stable production-ready build
* support cycling through multiple clsp streams (tours)
* can respond to mqtt resync messages
* use default secure and non-secure ports
* rudimentary error handling
* updated demo page
* headless player demo
* use webpack, babel, es6, etc
* use npm to manage dependencies
* decrease coupling between classes
* decrease coupling between videojs and iovPlayer


## v0.1.5 - 2017-08-27 - Critical

* first stable proof of concept
* rudimentary demo page
* point of reference for basic video playing via clsp, no advanced features


## Appendices

### Status Definitions

* Critical - this version fixes critical issues that were discovered in the previous version, and it is critical that users update
* Recommended - this version fixes important issues or adds important functionality, and it is recommended that users update
* Optional - this version fixes minor issues or adds minor or optional functionality, and users can safely wait to update
