import InstallHandler from './install';

export interface BotHandler {
    name: string;
    init: () => void;
};

export default [new InstallHandler()];