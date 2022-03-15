import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Trait } from "./trait.entity";

@Entity('sg721s')
export class SG721 {
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

  @OneToMany(() => Trait, trait => trait.contract)
  traits: Trait[];
}
