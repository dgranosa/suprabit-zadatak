import {Entity, model, property, belongsTo, hasMany} from '@loopback/repository';
import {User} from './user.model';
import {Food} from './food.model';

@model()
export class Beer extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @belongsTo(() => User)
  userId: string;

  @hasMany(() => Food)
  foods: Food[];

  constructor(data?: Partial<Beer>) {
    super(data);
  }
}

export interface BeerRelations {
  // describe navigational properties here
}

export type BeerWithRelations = Beer & BeerRelations;
