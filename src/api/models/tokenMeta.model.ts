import { Exclude } from 'class-transformer';
import { SG721Model } from './sg721.model';
import { TokenModel } from './token.model';

export class TokenMetaModel {

    @Exclude()
    id: number;

    @Exclude()
    createdAt: Date;

    @Exclude()
    contract: SG721Model;

    @Exclude()
    token: TokenModel;

    score: number;

    rank: number;
}
