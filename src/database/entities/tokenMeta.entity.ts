import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { SG721 } from './sg721.entity';
import { Token } from './token.entity';

@Entity('token_meta')
@Unique(['token', 'contract'])
export class TokenMeta {

    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
    createdAt: Date;

    @ManyToOne(() => SG721)
    @JoinColumn({ name: 'contract_id' })
    contract: SG721;

    @OneToOne(() => Token, token => token.meta)
    @JoinColumn({ name: 'token_id' })
    token: Token;

    @Column({
        type: 'numeric'
    })
    score: number;

    @Column({
        type: 'numeric'
    })
    rank: number;
}
