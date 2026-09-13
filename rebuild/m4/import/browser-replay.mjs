import Core from './replay-core.cjs';
import Provider from './engine-provider.cjs';
import {createSourcePlatform} from '../../m3/w6/local/source-platform.mjs';
export const createBrowserReplay=(options={})=>Core.createReplayCore(options.platform||createSourcePlatform());
export const createSourceReplayEngine=Provider.createSourceReplayEngine;
