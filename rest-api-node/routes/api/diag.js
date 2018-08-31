/*---------------------------------------------------------------------------------------------
 *  Copyright (c) John Duckmanton. Portions Copyright (c) 2018 Brad Traversey. 
 *  All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
const express = require('express');
const router = express.Router();

const os = require('os');
const fs = require('fs');

// @route		GET api/diag/info
// @desc		Get system information
// @access	Public
//
router.get('/info', (req, res) => {
  var info = {
    version: require('../../package.json').version,
    hostname: os.hostname(),
    totalMemory: Math.round(os.totalmem() / 1048576),
    freeMemory: Math.round(os.freemem() / 1048576),
    osType: os.type(),
    osRelease: os.release(),
    cpuModel: os.cpus()[0].model,
    cpuCount: os.cpus().length,
    arch: os.arch(),
    nodeVer: process.version,
    container: fs.existsSync('/.dockerenv')
  };

  res.json({ info });
});

module.exports = router;
