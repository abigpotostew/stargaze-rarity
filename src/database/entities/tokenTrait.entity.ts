import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { SG721 } from "./sg721.entity";
import { Token } from "./token.entity";
import { Trait } from "./trait.entity";

/**
 * Trying to follow: https://docs.opensea.io/docs/metadata-standards
 */
@Entity('token_traits')
export class TokenTrait {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
    createdAt: Date;

    @ManyToOne(() => SG721)
    @JoinColumn({ name: 'contract_id' })
    contract: SG721;

    @ManyToOne(() => Token, token => token.traits)
    @JoinColumn({ name: 'token_id'})
    token: Token;

    @Column({
        type: 'varchar',
        length: 1024,
        name: 'trait_type'
    })
    traitType: string;

    @Column({
        type: "varchar",
        length: 1024,
    })
    value: string;

    // Might want to support this in the future
    //   @Column({
    //     type: "varchar",
    //     length: 1024,
    //     name: 'display_type'
    //   })
    //   displayType: string; 

    @OneToOne(() => Trait)
    @JoinColumn({name:'trait_id'})
    trait: Trait;

}
