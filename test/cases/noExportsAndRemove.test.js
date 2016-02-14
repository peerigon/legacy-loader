"use strict";

// This should fail because neither exports nor remove is specified
require("../../lib/index.js!../fixtures/legacy.js");
