import { Column, CreateDateColumn, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { SG721Trait } from "./sg721Trait.entity";
import { Exclude } from "class-transformer";
import { Token } from "./token.entity";
import { SG721Meta } from "./sg721Meta.entity";


@Entity('sg721s')
export class SG721 {

  @Exclude()
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: "varchar",
    length: 64,
    unique: true
  })
  contract: string; // Probably want to validate that it is a stars... address    

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @OneToMany(() => SG721Trait, trait => trait.contract)
  traits: SG721Trait[];

  @OneToMany(() => Token, token => token.contract)
  tokens: Token[];

  @OneToOne(() => SG721Meta, meta => meta.contract)
  meta: SG721Meta;
}
