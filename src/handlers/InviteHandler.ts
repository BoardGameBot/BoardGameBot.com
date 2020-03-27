import { MessageHandler } from '../MessageHandler';
import { isCommand, convertUserToPlayer } from '../util';
import { GAMES_MAP } from '../games';
import { save } from '../save';
import { ChannelType, Reply, User, Mention } from '../messaging';

type MaybeReply = Reply | undefined;

export default class InviteHandler extends MessageHandler {
  name = 'Invite';

  async handlesMessage() {
    return this.msg.channel.type === ChannelType.PUBLIC_GROUP && isCommand(this.env, this.channel, this.msg, 'invite');
  }

  async reply(): Promise<Reply> {
    const args = this.msg.content.split(' ');
    const gameCode = args[1];
    const users: User[] = (this.msg.mentions || []).map(mention => mention.user);
    users.unshift(this.msg.author);
    // TODO: check min/max number of users for specific game
    const checks: MaybeReply[] = [
      this.checkGameInProgress(),
      this.checkNumberOfArguments(args),
      this.checkValidGame(gameCode),
      this.checkValidUserSelection(users),
      this.checkMinNumberOfUsers(users),
    ];
    const errorReply = checks.find(maybeReply => maybeReply !== undefined);
    if (errorReply) {
      return errorReply;
    }
    return this.invite(users, gameCode);
  }

  private checkGameInProgress(): MaybeReply {
    if (this.channel.currentGame) {
      return this.simpleReply('There is a game in progress. Wait for it to end in order to start a new one.');
    }
  }

  private checkNumberOfArguments(args: string[]): MaybeReply {
    if (args.length < 3) {
      return this.simpleReply(
        `Not enough arguments. Correct usage: "${this.env.prefix}invite GAME @PLAYER1 @PLAYER2..."\nAvailable games: ` +
          this.getHumanReadableGamesList(),
      );
    }
  }

  private checkValidGame(gameCode: string): MaybeReply {
    if (!(gameCode in GAMES_MAP)) {
      return this.simpleReply(
        'Invalid game. Check https://boardgamebot.com/games to see a list of games.\nAvailable games: ' +
          this.getHumanReadableGamesList(),
      );
    }
  }

  private checkValidUserSelection(users: User[]): MaybeReply {
    const ids = users.map(user => user.id.value);
    const idsSet = new Set(ids);
    if (ids.length != idsSet.size) {
      return this.simpleReply('Invalid selection of users.');
    }
  }

  private checkMinNumberOfUsers(users: User[]) {
    if (users.length <= 1) {
      return this.simpleReply('Not enough users to play this game!');
    }
  }

  private getHumanReadableGamesList(): string {
    return Object.keys(GAMES_MAP).join(',');
  }

  private async invite(users: User[], gameCode: string): Promise<Reply> {
    const players = users.map(user => convertUserToPlayer(user));
    const creator = this.msg.author;
    this.channel.invites = {
      players,
      accepted: [convertUserToPlayer(creator)],
      gameCode,
    };
    await save(this.state);

    const mentions: Mention[] = players
      .filter(player => player.id !== creator.id)
      .map((user, i) => ({ user, wordIndex: i }));

    mentions.push({ user: creator, wordIndex: mentions.length + 7 });

    return this.simpleReply(
      `@usernames, do you want to play ${gameCode} with @creator ? Use "${this.env.prefix}accept" to accept, or "${this.env.prefix}reject" to reject invite.`,
      mentions,
    );
  }
}
