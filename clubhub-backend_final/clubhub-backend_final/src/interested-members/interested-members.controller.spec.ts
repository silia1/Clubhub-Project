import { Test, TestingModule } from '@nestjs/testing';
import { InterestedMembersController } from './interested-members.controller';
import { InterestedMembersService } from './interested-members.service';

describe('InterestedMembersController', () => {
  let controller: InterestedMembersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InterestedMembersController],
      providers: [InterestedMembersService],
    }).compile();

    controller = module.get<InterestedMembersController>(InterestedMembersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
