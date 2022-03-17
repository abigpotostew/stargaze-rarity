import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { SG721 } from './sg721.entity';
import { TokenMeta } from './tokenMeta.entity';
import { TokenTrait } from './tokenTrait.entity';

@Entity('tokens')
@Unique(['tokenId', 'contract'])
export class Token {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
    createdAt: Date;

    @Column({
        type: 'varchar',
        length: 1024,
        name: 'token_id'
    })
    tokenId: string;

    @OneToOne(() => TokenMeta, meta => meta.token)
    meta: TokenMeta[];

    @ManyToOne(() => SG721, contract => contract.traits)
    @JoinColumn({ name: 'contract_id' })
    contract: SG721;

    @OneToMany(() => TokenTrait, trait => trait.token)
    traits: TokenTrait[];
}
