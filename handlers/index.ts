import EnableHandler from './enable';
import DisableHandler from './disable';

export interface BotHandler {
    name: string;
    init: () => void;
};

export default [
    new EnableHandler(),
    new DisableHandler()
];