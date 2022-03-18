import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { SG721 } from "./sg721.entity";
import { Token } from "./token.entity";
import { SG721Trait } from "./sg721Trait.entity";
import { TraitValue } from "../utils/types";
import { Exclude } from "class-transformer";

/**
 * Trying to follow: https://docs.opensea.io/docs/metadata-standards
 */
@Entity('token_traits')
@Unique(['contract', 'token', 'traitType'])
export class TokenTrait {

    @Exclude()
    @PrimaryGeneratedColumn()
    id: number;

    @Exclude()
    @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
    createdAt: Date;

    @Exclude()
    @ManyToOne(() => SG721)
    @JoinColumn({ name: 'contract_id' })
    contract: SG721;

    @Exclude()
    @ManyToOne(() => Token, token => token.traits)
    @JoinColumn({ name: 'token_id' })
    token: Token;

    @Column({
        type: 'varchar',
        length: 1024,
        name: 'trait_type'
    })
    traitType: string;

    @Column({
        type: "jsonb",
        array: false,
        nullable: true
    })
    value: TraitValue;

    // Might want to support this in the future
    //   @Column({
    //     type: "varchar",
    //     length: 1024,
    //     name: 'display_type'
    //   })
    //   displayType: string; 

    @ManyToOne(() => SG721Trait, sg721Trait => sg721Trait.tokenTraits)
    @JoinColumn({ name: 'trait_id' })
    trait: SG721Trait;

}
