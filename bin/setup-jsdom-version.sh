if [[ $TRAVIS_NODE_VERSION == "iojs" ]]; then
	sed -i -e 's/"jsdom": ">=3.0.0"/"jsdom": "^6.0.0"/' 'package.json'
fi

if [[ $TRAVIS_NODE_VERSION == 0.1* ]]; then
	sed -i -e 's/"jsdom": ">=3.0.0"/"jsdom": "^3.0.0"/' 'package.json'
fi
