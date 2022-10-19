import fetch from 'cross-fetch';
import { Logger } from 'winston';
import { Config } from '@backstage/config';
import { Readable } from 'stream';
import { RandomUserDocument } from './RandomUserDocument';

export type RandomUserCollatorFactoryOptions = {
  baseUrl?: string;
  logger: Logger;
};
/**
 * 
 * @public
 */
export class RandomUserCollatorFactory implements RandomUserDocument {
    public readonly type: string = 'random-user';
    public id: string = "";
    public email: string = "";
    public firstName: string = "";
    public lastName: string = "";
    public title: string = "";
    public text: string = "";
    public location: string = "";

    private readonly baseUrl?: string;
    private readonly logger: Logger;

    private constructor(options: RandomUserCollatorFactoryOptions) {
        this.baseUrl = options.baseUrl;
        this.logger = options.logger;
    }

    public static fromConfig(config: Config, options: RandomUserCollatorFactoryOptions): RandomUserCollatorFactory {
        const baseUrl = config.getOptionalString('first.baseUrl') || 'http://localhost:7007/api/first/get-random-users';

        return new RandomUserCollatorFactory({ ...options, baseUrl});
    }

    public async getCollator(): Promise<Readable> {
        return Readable.from(this.execute());
    }

    public async *execute(): AsyncGenerator<RandomUserDocument> {
        if (!this.baseUrl) {
            this.logger.error(`There was no baseUrl defined in yourl app-config.yaml`);
            return;
        }

        const response = await fetch(this.baseUrl);
        const data = await response.json();

        for (const user of data) {
            yield {
                title: user.email,
                text: `${user.name.first} ${user.name.last}`,
                location: `/first/${user.id}`,
                id: user.id,
                firstName: user.name.first,
                lastName: user.name.last,
                email: user.email,
            };
        }
    }
}