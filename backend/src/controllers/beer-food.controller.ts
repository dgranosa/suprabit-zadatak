import {authenticate} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor, HttpErrors, param,
  patch,
  post,
  requestBody
} from '@loopback/rest';
import {SecurityBindings, securityId, UserProfile} from '@loopback/security';
import {
  Beer,
  Food
} from '../models';
import {BeerRepository} from '../repositories';
import {SECURITY_SPEC} from '../utils/security-spec';

export class BeerFoodController {
  constructor(
    @repository(BeerRepository) protected beerRepository: BeerRepository,
  ) { }

  @get('/beers/{id}/foods', {
    security: SECURITY_SPEC,
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
  @authenticate('jwt')
  async find(
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Food>,
  ): Promise<Food[]> {
    return this.beerRepository.foods(id).find(filter);
  }

  @post('/beers/{id}/foods', {
    security: SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Beer model instance',
        content: {'application/json': {schema: getModelSchemaRef(Food)}},
      },
    },
  })
  @authenticate('jwt')
  async create(
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
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
    const pBeer = await this.beerRepository.findById(id);

    if (pBeer.userId != currentUserProfile[securityId])
      throw new HttpErrors[403];

    return this.beerRepository.foods(id).create(food);
  }

  @patch('/beers/{id}/foods', {
    security: SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Beer.Food PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  @authenticate('jwt')
  async patch(
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
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
    const pBeer = await this.beerRepository.findById(id);

    if (pBeer.userId != currentUserProfile[securityId])
      throw new HttpErrors[403];

    return this.beerRepository.foods(id).patch(food, where);
  }

  @del('/beers/{id}/foods', {
    security: SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Beer.Food DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  @authenticate('jwt')
  async delete(
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Food)) where?: Where<Food>,
  ): Promise<Count> {
    const pBeer = await this.beerRepository.findById(id);

    if (pBeer.userId != currentUserProfile[securityId])
      throw new HttpErrors[403];

    return this.beerRepository.foods(id).delete(where);
  }
}
