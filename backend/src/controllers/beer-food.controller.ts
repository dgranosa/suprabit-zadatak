import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  Beer,
  Food,
} from '../models';
import {BeerRepository} from '../repositories';

export class BeerFoodController {
  constructor(
    @repository(BeerRepository) protected beerRepository: BeerRepository,
  ) { }

  @get('/beers/{id}/foods', {
    responses: {
      '200': {
        description: 'Array of Beer has many Food',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Food)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Food>,
  ): Promise<Food[]> {
    return this.beerRepository.foods(id).find(filter);
  }

  @post('/beers/{id}/foods', {
    responses: {
      '200': {
        description: 'Beer model instance',
        content: {'application/json': {schema: getModelSchemaRef(Food)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Beer.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Food, {
            title: 'NewFoodInBeer',
            exclude: ['id'],
            optional: ['beerId']
          }),
        },
      },
    }) food: Omit<Food, 'id'>,
  ): Promise<Food> {
    return this.beerRepository.foods(id).create(food);
  }

  @patch('/beers/{id}/foods', {
    responses: {
      '200': {
        description: 'Beer.Food PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Food, {partial: true}),
        },
      },
    })
    food: Partial<Food>,
    @param.query.object('where', getWhereSchemaFor(Food)) where?: Where<Food>,
  ): Promise<Count> {
    return this.beerRepository.foods(id).patch(food, where);
  }

  @del('/beers/{id}/foods', {
    responses: {
      '200': {
        description: 'Beer.Food DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Food)) where?: Where<Food>,
  ): Promise<Count> {
    return this.beerRepository.foods(id).delete(where);
  }
}
