"use strict";

// This should fail because an implicit remove without an export is not possible
require("../../lib/index.js?remove!../fixtures/legacy.js");
