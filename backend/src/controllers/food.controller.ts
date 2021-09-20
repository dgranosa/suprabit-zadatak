import {authenticate} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where
} from '@loopback/repository';
import {
  del, get,
  getModelSchemaRef, param, patch, post, put, requestBody, response
} from '@loopback/rest';
import {SecurityBindings, UserProfile} from '@loopback/security';
import {Food} from '../models';
import {FoodRepository} from '../repositories';
import {SECURITY_SPEC} from '../utils/security-spec';

export class FoodController {
  constructor(
    @repository(FoodRepository)
    public foodRepository: FoodRepository,
  ) { }

  @post('/foods', {
    responses: {
      '200': {
        description: 'Food model instance',
        content: {'application/json': {schema: getModelSchemaRef(Food)}},
      }
    }
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Food, {
            title: 'NewFood',
            exclude: ['id'],
          }),
        },
      },
    })
    food: Omit<Food, 'id'>,
  ): Promise<Food> {
    return this.foodRepository.create(food);
  }

  @get('/foods/count')
  @response(200, {
    description: 'Food model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Food) where?: Where<Food>,
  ): Promise<Count> {
    return this.foodRepository.count(where);
  }

  @get('/foods')
  @response(200, {
    description: 'Array of Food model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Food, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Food) filter?: Filter<Food>,
  ): Promise<Food[]> {
    return this.foodRepository.find(filter);
  }

  @patch('/foods')
  @response(200, {
    description: 'Food PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Food, {partial: true}),
        },
      },
    })
    food: Food,
    @param.where(Food) where?: Where<Food>,
  ): Promise<Count> {
    return this.foodRepository.updateAll(food, where);
  }

  @get('/foods/{id}')
  @response(200, {
    description: 'Food model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Food, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Food, {exclude: 'where'}) filter?: FilterExcludingWhere<Food>
  ): Promise<Food> {
    return this.foodRepository.findById(id, filter);
  }

  @patch('/foods/{id}', {
    security: SECURITY_SPEC,
    responses: {
      '204': {
        description: 'Food PATCH success',
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
          schema: getModelSchemaRef(Food, {partial: true}),
        },
      },
    })
    food: Food,
  ): Promise<void> {
    await this.foodRepository.updateById(id, food);
  }

  @put('/foods/{id}')
  @response(204, {
    description: 'Food PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() food: Food,
  ): Promise<void> {
    await this.foodRepository.replaceById(id, food);
  }

  @del('/foods/{id}', {
    security: SECURITY_SPEC,
    responses: {
      '204': {
        description: 'Food DELETE success',
      }
    }
  })
  @authenticate('jwt')
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.foodRepository.deleteById(id);
  }
}
