import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from "sequelize-typescript";
import { User } from "./users.model";

interface TokenCreationAttrs {
  userId: number;
  refreshToken: string;
}

@Table({ tableName: "tokens" })
export class Token extends Model<
  Token,
  TokenCreationAttrs
> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({
    type: DataType.STRING(510),
    unique: true,
    allowNull: false,
  })
  refreshToken: string;

  @ForeignKey(() => User)
  userId: number;
}
