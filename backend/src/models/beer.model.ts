import {belongsTo, Entity, hasMany, model, property} from '@loopback/repository';
import {Food} from './food.model';
import {User} from './user.model';

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

  @property({
    type: 'string',
    required: true,
  })
  tagline: string;

  @property({
    type: 'date',
    required: true,
  })
  first_brewed: string;

  @property({
    type: 'string',
    required: true,
  })
  yeast: string;

  @property({
    type: 'string',
    required: false,
  })
  image_url: string;

  @property({
    type: 'number',
    required: false,
    postgresql: {
      dataType: 'decimal'
    }
  })
  abv: number;

  @property({
    type: 'number',
    required: false,
    postgresql: {
      dataType: 'decimal'
    }
  })
  ibu: number;

  @property({
    type: 'number',
    required: false,
    postgresql: {
      dataType: 'decimal'
    }
  })
  ebc: number;

  @property({
    type: 'string',
    required: false,
  })
  description: string;

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
