import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('sg721s')
export class SG721s {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: "varchar",
    length: 64,
    unique: true
    })
    contract: string; // Probably want to validate that it is a stars... address    
  
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

}
