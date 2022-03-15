import { Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('sg721s')
export class SG721s {
  @PrimaryGeneratedColumn()
  id: number;
}
