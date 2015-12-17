#!/bin/bash

cmds_exist() {
    if (command -v node 2>/dev/null) && (command -v npm 2>/dev/null); then
        return 0
    else
        return 1
    fi
}

if [ cmds_exist ]; then
    NODE_VERSION=$(node -v);

    if [[ $NODE_VERSION == v0.1* ]]; then
        npm install jsdom@3 --save
    fi
fi
