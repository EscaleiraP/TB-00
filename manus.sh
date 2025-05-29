#!/bin/bash
pm2 start simple-server.js --name goibniu
pm2 logs goibniu
