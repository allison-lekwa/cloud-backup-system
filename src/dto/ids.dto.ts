import { IsUUID } from 'class-validator';

export class IdsDto {
  @IsUUID(undefined, { each: true })
  ids: string[];
}
