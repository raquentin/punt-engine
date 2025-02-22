import { extensions } from '../extensions/Extensions.mjs';
import { Container } from '../scene/container/Container.mjs';
import { EventSystem } from './EventSystem.mjs';
import { FederatedContainer } from './FederatedEventTarget.mjs';

"use strict";
extensions.add(EventSystem);
Container.mixin(FederatedContainer);
//# sourceMappingURL=init.mjs.map
