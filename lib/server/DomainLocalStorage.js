import { create as createDomain } from 'domain';

const DATA_KEY = 'brisket:domainLocalStorage';

const DomainLocalStorage = {

  middleware(expressRequest, expressResponse, next) {
    const domain = createDomain();
    domain.id = domainUid(expressRequest);
    domain.add(expressRequest);
    domain.add(expressResponse);
    domain[DATA_KEY] = {};

    domain.run(function() {
      next();
    });

    domain.on('error', function(e) {
      next(e);
    });
  },

  get(attribute) {
    if (!currentDomain()) {
      return null;
    }

    return currentDomain()[DATA_KEY][attribute];
  },

  getAll() {
    if (!currentDomain()) {
      return null;
    }

    return currentDomain()[DATA_KEY];
  },

  set(attribute, value) {
    if (!currentDomain()) {
      return;
    }

    currentDomain()[DATA_KEY][attribute] = value;
  },

  clear() {
    if (currentDomain()) {
      currentDomain().exit();
    }
  }

};

function domainUid(expressRequest) {
  return expressRequest._id;
}

function currentDomain() {
  const domain = process.domain;

  if (!domain || !domain[DATA_KEY]) {
    return;
  }

  return domain;
}

export default DomainLocalStorage;

