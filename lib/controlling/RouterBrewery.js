"use strict";

import Backbone from "../application/Backbone";
import _ from "lodash";
import ServerRouter from "../server/ServerRouter";
import ServerRenderingWorkflow from "../server/ServerRenderingWorkflow";
import ClientRenderingWorkflow from "../client/ClientRenderingWorkflow";
import RendersErrors from "../traits/RendersErrors";
import HasALayout from "../traits/HasALayout";
import HasErrorViewMapping from "../traits/HasErrorViewMapping";
import CloseableRouter from "../traits/CloseableRouter";
import HandlesRouteStartAndEnd from "../traits/HandlesRouteStartAndEnd";
import Environment from "../environment/Environment";

var RouterBrewery = {

    create: createRouter,

    makeBreweryWithDefaults: function(defaultProps) {
        return {

            create: function(props, classProps) {
                var propsWithDefaults = _.extend({}, defaultProps, props);

                return createRouter(propsWithDefaults, classProps);
            }

        };
    }

};

function createRouter(props, classProps) {
    var Router = Environment.isServer() ? ServerRouter : Backbone.Router;

    var extendedProps = _.extend({},
        HasALayout,
        HandlesRouteStartAndEnd,
        HasErrorViewMapping,
        RendersErrors,
        CloseableRouter,
        props
    );

    if (props) {
        extendedProps = augmentRouteHandlers(extendedProps);
    }

    var CreatedRouter = Router.extend(extendedProps, classProps);
    CreatedRouter.extend = throwsNoExtendAllowed;

    return CreatedRouter;
}

function throwsNoExtendAllowed() {
    throw new Error(
        "You cannot extend a Router. You can only create it using a brewery. " +
        "Use either the default Brisket.RouterBrewery.create or create your own brewery " +
        "with the Brisket.RouterBrewery.makeBreweryWithDefaults function."
    );
}

function makeHandlerThatRendersView(originalHandler) {
    if (Environment.isServer()) {
        return ServerRenderingWorkflow.createHandlerFrom(originalHandler);
    }

    if (Environment.isClient()) {
        return ClientRenderingWorkflow.createHandlerFrom(originalHandler);
    }
}

function augmentRouteHandlers(props) {
    var resultProps = _.clone(props);

    for (var route in props.routes) {
        if (props.routes.hasOwnProperty(route)) {
            var handler = props[props.routes[route]];

            if (!handler) {
                throw new Error(
                    "Route '" + route + "' does not have a handler"
                );
            }

            //handlers are excuted in reverse order
            handler = makeHandlerThatRendersView(handler);

            resultProps[props.routes[route]] = handler;
        }
    }

    return resultProps;
}

export default RouterBrewery;

// ----------------------------------------------------------------------------
// Copyright (C) 2015 Bloomberg Finance L.P.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// http://www.apache.org/licenses/LICENSE-2.0
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
// ----------------------------- END-OF-FILE ----------------------------------
