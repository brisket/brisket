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
        npm list 2>/dev/null | grep 'jsdom@3.1.2' >/dev/null || npm install jsdom@3.1.2 --save
    fi
fi
