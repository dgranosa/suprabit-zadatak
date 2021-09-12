import {authenticate} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository
} from '@loopback/repository';
import {
  del, get,
  getModelSchemaRef, HttpErrors, param, patch, post, requestBody,
  response
} from '@loopback/rest';
import {SecurityBindings, securityId, UserProfile} from '@loopback/security';
import {Beer} from '../models';
import {BeerRepository} from '../repositories';
import {SECURITY_SPEC} from '../utils/security-spec';

export class BeerController {
  constructor(
    @repository(BeerRepository)
    public beerRepository: BeerRepository,
  ) { }

  @post('/beers', {
    security: SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Beer model instance',
        content: {'application/json': {schema: getModelSchemaRef(Beer, {exclude: ['userId']})}},
      }
    }
  })
  @authenticate('jwt')
  async create(
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Beer, {
            title: 'NewBeer',
            exclude: ['id', 'userId'],
          }),
        },
      },
    })
    beer: Omit<Beer, 'id'>,
  ): Promise<Beer> {
    beer.userId = currentUserProfile[securityId];
    return this.beerRepository.create(beer);
  }

  @get('/beers/count')
  @response(200, {
    description: 'Beer model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    //@param.where(Beer) where?: Where<Beer>,
    @param.filter(Beer) filter?: Filter<Beer>,
  ): Promise<Count> {
    return this.beerRepository.count();
  }

  @get('/beers', {
    security: SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Array of Beer model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Beer, {includeRelations: true}),
            },
          },
        },
      }
    }
  })
  @authenticate('jwt')
  async find(
    @param.filter(Beer) filter?: Filter<Beer>,
  ): Promise<Beer[]> {
    return this.beerRepository.find(filter);
  }

  @get('/beers/{id}', {
    security: SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Beer model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Beer, {includeRelations: true}),
          },
        },
      }
    }
  })
  @authenticate('jwt')
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Beer, {exclude: 'where'}) filter?: FilterExcludingWhere<Beer>
  ): Promise<Beer> {
    return this.beerRepository.findById(id, filter);
  }

  @patch('/beers/{id}', {
    security: SECURITY_SPEC,
    responses: {
      '204': {
        description: 'Beer PATCH success',
      }
    }
  })
  @authenticate('jwt')
  async updateById(
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Beer, {partial: true, exclude: ['userId']}),
        },
      },
    })
    beer: Beer,
  ): Promise<void> {
    const pBeer = await this.beerRepository.findById(id);

    if (pBeer.userId != currentUserProfile[securityId])
      throw new HttpErrors[403];

    await this.beerRepository.updateById(id, beer);
  }

  @del('/beers/{id}', {
    security: SECURITY_SPEC,
    responses: {
      '204': {
        description: 'Beer DELETE success',
      }
    }
  })
  @authenticate('jwt')
  async deleteById(
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
    @param.path.number('id')
    id: number
  ): Promise<void> {
    const beer = await this.beerRepository.findById(id);

    if (beer.userId != currentUserProfile[securityId])
      throw new HttpErrors[403];

    await this.beerRepository.deleteById(id);
  }
}
