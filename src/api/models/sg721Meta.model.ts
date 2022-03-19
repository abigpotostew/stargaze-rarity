import { Exclude } from 'class-transformer';
import { SG721Model } from './sg721.model';

export class SG721MetaModel {

    @Exclude()
    id: number;

    @Exclude()
    createdAt: Date;

    @Exclude()
    contract: SG721Model;

    count: number;
}
