import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { SG721 } from "./sg721.entity";

@Entity('traits')
export class Trait {
  @PrimaryGeneratedColumn()
  id: number;
  
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @ManyToOne(() => SG721, contract=>contract.traits)
  contract: SG721;

  @Column({
    type: "varchar",
    length: 1024,
  })
  name: string;   
}
