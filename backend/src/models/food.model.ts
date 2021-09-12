import {Entity, model, property} from '@loopback/repository';
import {BeerWithRelations} from './beer.model';

@model({settings: {strict: false}})
export class Food extends Entity {
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
    type: 'number',
  })
  beerId?: number;
  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Food>) {
    super(data);
  }
}

export interface FoodRelations {
  beer?: BeerWithRelations;
}

export type FoodWithRelations = Food & FoodRelations;
